<?php

namespace App\Http\Controllers;

use App\Http\Requests\JoinRoomRequest;
use App\Models\{Activity, Attempt, Module, Room};
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;

class QuizPlayController extends Controller
{
    /* -------------------------------------------------
     |  Join room
     * -------------------------------------------------*/
    public function join(JoinRoomRequest $request)
    {
        $room = Room::where('invite_code', $request->validated()['invite_code'])->firstOrFail();

        Gate::authorize('join-room', $room);

        $student = auth()->user();
        $attempt = Attempt::current($student, $room) ?? Attempt::start($student, $room);

        return redirect()->route('student.room', $room);
    }

    /* -------------------------------------------------
     |  Current state
     * -------------------------------------------------*/
    public function status(Room $room)
    {
        $student = auth()->user();
        $attempt = Attempt::current($student, $room);

        abort_if(!$attempt, 404, 'No active attempt');

        $completedActivityIds = $attempt->completedActivityIds();



        $modules = $room->modules()
    ->withCount('activities as activities_count')   // only counts
    ->orderBy('room_module.position')
    ->get()
    ->map(fn (Module $module) => [
        'id'          => $module->id,
        'name'        => $module->name,
        'type'        => $module->type,
        'operation'   => $module->operation,
        'status' => match (true) {
            $module->activities->isEmpty() => 'locked',
            $module->activities->every(fn ($act) => in_array($act->id, $completedActivityIds)) => 'completed',
            default => 'current',
        },
        'activities_count'     => $module->activities_count,
        'activities_completed' => $module->activities->every(fn ($act) => in_array($act->id, $completedActivityIds))
    ]);

        return inertia('student/room', [
            'room' => $room->only('id', 'name'),
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
            'answer' => 'required|string',
            'time_ms' => 'required|integer|min:0',
        ]);

        $activity = Activity::findOrFail($request->activity_id);
        $student = auth()->user();
        $attempt = Attempt::current($student, $activity->room());

        abort_if(!$attempt, 404, 'No active attempt');

        $module = $activity->modules()->first();
        $noFeedback = $module?->no_feedback ?? false;

        $correct = ($activity->content['correct_answer'] ?? null) === $request->answer;

        $attempt->markAnswer($activity, $correct, $request->time_ms);
        $next = $attempt->nextActivity();
        $attempt->advance($next);

        return response()->json([
            'next_activity_id' => $next?->id,
            'finished' => $attempt->isCompleted(),
            ...(!$noFeedback ? ['correct' => $correct] : []),
        ]);
    }

    /* -------------------------------------------------
     |  Retry a completed module
     * -------------------------------------------------*/
    public function retryModule(Module $module): JsonResponse
    {
        $student = auth()->user();
        $room = $module->rooms()->first();
        $attempt = Attempt::current($student, $room);

        abort_if(!$attempt, 404, 'No active attempt');

        $moduleActivityIds = $module->activities->pluck('id')->toArray();
        $answers = collect($attempt->answers)->reject(
            fn ($_, $id) => in_array((int) $id, $moduleActivityIds, true)
        )->toArray();

        $attempt->update([
            'answers' => $answers,
            'score' => collect($answers)->where('correct', true)->count(),
            'time_spent' => collect($answers)->sum('time'),
            'current_activity_id' => $module->activities->sortBy('pivot.position')->first()->id,
        ]);

        return response()->json($attempt);
    }

    /* -------------------------------------------------
     |  Student dashboard
     * -------------------------------------------------*/
    public function dashboard()
    {
        $student = auth()->user();

        $rooms = Room::whereHas('attempts', fn ($query) => $query->where('student_id', $student->id))
            ->with(['attempts' => fn ($query) => $query->where('student_id', $student->id)->latest()])
            ->get()
            ->map(fn ($room) => [
                'id' => $room->id,
                'name' => $room->name,
                'invite_code' => $room->invite_code,
                'progress' => optional($room->attempts->first())->only('score', 'completed', 'time_spent'),
            ]);

        return inertia('student/dashboard', compact('rooms'));
    }

    public function show(Room $room, Module $module)
    {

        $activities = $module->activities()
        ->orderBy('module_activity.position')
        ->get();

        return inertia('quiz/show', [
            'room'   => $room->only('id', 'name'),
            'module' => [
                ...$module->only('id', 'name', 'type', 'operation'),
                'activities' => $activities,
            ],
        ]);
    }
}
