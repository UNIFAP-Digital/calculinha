<?php

namespace App\Http\Controllers;

use App\Models\{Activity, Attempt, Module, Room, User};
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;

class QuizPlayController extends Controller
{
    /* -------------------------------------------------
     |  Join room
     * -------------------------------------------------*/
    public function join(string $inviteCode): JsonResponse
    {
        $room = Room::where('invite_code', $inviteCode)->firstOrFail();

        /** @var User $student */
        $student = auth()->user();
        Gate::authorize('join-room', $room);

        $attempt = Attempt::current($student, $room)
                    ?? Attempt::start($student, $room);

        return response()->json([
            'room'    => $room->load('modules.activities'),
            'attempt' => $attempt,
        ]);
    }

    /* -------------------------------------------------
     |  Current state
     * -------------------------------------------------*/
    public function status(Room $room): JsonResponse
    {
        /** @var User $student */
        $student = auth()->user();
        $attempt = Attempt::current($student, $room);

        abort_if(!$attempt, 404, 'No active attempt');

        $completedActivityIds = $attempt->completedActivityIds();

        // decorate each module with its status
        $modules = $room->modules()
                        ->with('activities')
                        ->orderBy('room_module.position')
                        ->get()
                        ->map(function (Module $module) use ($completedActivityIds) {
                            $total      = $module->activities->count();
                            $completed  = $module->activities
                                                 ->filter(fn ($act) => in_array($act->id, $completedActivityIds))
                                                 ->count();

                            $module->status = match (true) {
                                $completed === 0          => 'locked',
                                $completed < $total       => 'current',
                                default                   => 'completed',
                            };
                            return $module;
                        });

        return response()->json([
            'room'    => $room->only('id', 'name'),
            'modules' => $modules,
            'attempt' => $attempt->only('id', 'current_activity_id', 'score', 'time_spent', 'finished_at'),
        ]);
    }

    /* -------------------------------------------------
     |  Answer an activity
     * -------------------------------------------------*/
    public function answer(Request $request): JsonResponse
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'answer'      => 'required|string',
            'time_ms'     => 'required|integer|min:0',
        ]);

        /** @var User $student */
        $student = auth()->user();
        $activity = Activity::findOrFail($request->activity_id);

        $attempt = Attempt::current($student, $activity->room());
        abort_if(!$attempt, 404, 'No active attempt');

        // correctness check (simple string match)
        $correct = ($activity->content['correct_answer'] ?? null) === $request->answer;

        $attempt->markAnswer($activity, $correct, $request->time_ms);
        $next = $attempt->nextActivity();
        $attempt->advance($next);

        return response()->json([
            'correct'           => $correct,
            'next_activity_id'  => $next?->id,
            'finished'          => $attempt->isCompleted(),
        ]);
    }

    /* -------------------------------------------------
     |  Retry a completed module
     * -------------------------------------------------*/
    public function retryModule(Module $module): JsonResponse
    {
        /** @var User $student */
        $student = auth()->user();
        $room    = $module->rooms()->first();   // module belongs to one room via pivot
        $attempt = Attempt::current($student, $room);

        abort_if(!$attempt, 404, 'No active attempt');

        // remove answers that belong to this module
        $moduleActivityIds = $module->activities->pluck('id')->toArray();
        $answers = collect($attempt->answers)->reject(
            fn ($_, $id) => in_array((int) $id, $moduleActivityIds, true)
        )->toArray();

        $attempt->answers      = $answers;
        $attempt->score        = collect($answers)->where('correct', true)->count();
        $attempt->time_spent   = collect($answers)->sum('time');

        // set current to first activity of this module
        $attempt->current_activity_id = $module->activities->sortBy('pivot.position')->first()->id;
        $attempt->save();

        return response()->json($attempt);
    }
}