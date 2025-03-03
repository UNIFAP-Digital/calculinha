<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuizResultRequest;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\RoomResource;
use App\Models\Module;
use App\Models\ModuleActivity;
use App\Models\Participant;
use App\Models\Room;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class GameController extends Controller
{
    public function index(Room $room)
    {
        $room->load([
            'modules'                => fn($query) => $query->withCount('moduleActivities')->orderBy('position'),
            'modules.moduleActivities' => fn($query) => $query->orderBy('position'),
            'modules.moduleActivities.activity'
        ]);

        if (auth()->check()) {
            $participant = null;
        } else {
            $participant = Participant::findOrFail(session('participant_id'));
            $participant->load('moduleActivities');
        }

        $response = [
            'id'    => $room->id,
            'name'  => $room->name,
            'modules' => []
        ];

        foreach ($room->modules as $i => $module) {
            $response['modules'][] = [
                'id'          => $module->id,
                'name'        => $module->name,
                'description' => $module->description,
                'icon'        => $module->icon,
                'color'       => $module->color,
                'order'       => $i + 1,
                'stats'       => [
                    'is_completed' => $participant !== null ? $module->module_activities_count === $participant->moduleActivities->count() : null,
                ],
                'activities'  => $module->moduleActivities->map(function ($moduleActivity, $j) use ($participant) {
                    $attempt = $participant?->moduleActivities->firstWhere('id', $moduleActivity->id) ?? null;

                    if ($attempt !== null) {
                        $attempt = [
                            'answer'     => $attempt->pivot->answer,
                            'is_correct' => $attempt->pivot->is_correct,
                        ];
                    }

                    return [
                        'id'             => $moduleActivity->id,
                        'type'           => $moduleActivity->activity->content['type'],
                        'order'          => $j + 1,
                        'question'       => $moduleActivity->activity->content['question'],
                        'correct_answer' => $moduleActivity->activity->content['correct_answer'],
                        'wrong_answers'  => $moduleActivity->activity->content['wrong_answers'],
                        'attempt'        => $attempt,
                    ];
                }),
            ];
        }

        return Inertia::render('game/GameSelect', [
            'response' => $response
        ]);
    }

    public function play(Room $room, Module $module)
    {
        $room->load([
            'modules'                => fn($query) => $query->withCount('moduleActivities')->orderBy('position'),
            'modules.moduleActivities' => fn($query) => $query->orderBy('position'),
            'modules.moduleActivities.activity'
        ]);

        if (auth()->check()) {
            $participant = null;
        } else {
            $participant = Participant::findOrFail(session('participant_id'));
            $participant->load('moduleActivities');
        }

        $response = [
            'id'    => $room->id,
            'name'  => $room->name,
            'modules' => []
        ];

        foreach ($room->modules as $i => $module2) {
            if ($module2->id !== $module->id) continue;

            $response['modules'][] = [
                'id'          => $module2->id,
                'room_id'     => $module2->room_id,
                'name'        => $module2->name,
                'description' => $module2->description,
                'icon'        => $module2->icon,
                'color'       => $module2->color,
                'order'       => $i + 1,
                'stats'       => [
                    'is_completed' => $participant !== null ? $module->module_activities_count === $participant->moduleActivities->count() : null,
                ],
                'activities'  => $module2->moduleActivities->map(function ($moduleActivity, $j) use ($participant) {
                    $attempt = $participant?->moduleActivities->firstWhere('id', $moduleActivity->id) ?? null;

                    if ($attempt !== null) {
                        $attempt = [
                            'answer'     => $attempt->pivot->answer,
                            'is_correct' => $attempt->pivot->is_correct,
                        ];
                    }

                    return [
                        'id'             => $moduleActivity->id,
                        'type'           => $moduleActivity->activity->content['type'],
                        'order'          => $j + 1,
                        'question'       => $moduleActivity->activity->content['question'],
                        'correct_answer' => $moduleActivity->activity->content['correct_answer'],
                        'wrong_answers'  => $moduleActivity->activity->content['wrong_answers'],
                        'attempt'        => $attempt,
                    ];
                }),
            ];

            if ($module2->id === $module->id) break;
        }

        return Inertia::render('game/PlayingGame', [
            'response' => $response
        ]);
    }

    public function result(QuizResultRequest $request)
    {
        if (!$request->ajax()) throw new BadRequestHttpException();

        $participantId = session('participant_id');

        $validated = $request->validated();

        $moduleActivityId = $validated['module_activity_id'];
        $answer = $validated['answer'];

        $moduleActivity = ModuleActivity::findOrFail($moduleActivityId);
        $correctAnswer = $moduleActivity->activity->content['correct_answer'] ?? null;
        $isCorrect = $correctAnswer !== null && $answer === $correctAnswer;

        $moduleActivity->participants()->syncWithoutDetaching([
            $participantId => [
                'answer'     => $answer,
                'is_correct' => $isCorrect
            ]
        ]);

        return response()->noContent();
    }
}
