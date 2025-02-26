<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuizResultRequest;
use App\Http\Resources\FlowResource;
use App\Http\Resources\ParticipantResource;
use App\Http\Resources\RoomResource;
use App\Models\Flow;
use App\Models\FlowActivity;
use App\Models\Participant;
use App\Models\Room;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class GameController extends Controller
{
    public function index(Room $room)
    {
        $room->load([
            'flows'                => fn($query) => $query->withCount('flowActivities')->orderBy('position'),
            'flows.flowActivities' => fn($query) => $query->orderBy('position'),
            'flows.flowActivities.activity'
        ]);

        if (auth()->check()) {
            $participant = null;
        } else {
            $participant = Participant::findOrFail(session('participant_id'));
            $participant->load('flowActivities');
        }

        $response = [
            'id'    => $room->id,
            'name'  => $room->name,
            'flows' => []
        ];

        foreach ($room->flows as $i => $flow) {
            $response['flows'][] = [
                'id'          => $flow->id,
                'name'        => $flow->name,
                'description' => $flow->description,
                'icon'        => $flow->icon,
                'color'       => $flow->color,
                'order'       => $i + 1,
                'stats'       => [
                    'is_completed' => $participant !== null ? $flow->flow_activities_count === $participant->flowActivities->count() : null,
                ],
                'activities'  => $flow->flowActivities->map(function ($flowActivity, $j) use ($participant) {
                    $attempt = $participant?->flowActivities->firstWhere('id', $flowActivity->id) ?? null;

                    if ($attempt !== null) {
                        $attempt = [
                            'answer'     => $attempt->pivot->answer,
                            'is_correct' => $attempt->pivot->is_correct,
                        ];
                    }

                    return [
                        'id'             => $flowActivity->id,
                        'type'           => $flowActivity->activity->content['type'],
                        'order'          => $j + 1,
                        'question'       => $flowActivity->activity->content['question'],
                        'correct_answer' => $flowActivity->activity->content['correct_answer'],
                        'wrong_answers'  => $flowActivity->activity->content['wrong_answers'],
                        'attempt'        => $attempt,
                    ];
                }),
            ];
        }

        return Inertia::render('game/GameSelect', [
            'response' => $response
        ]);
    }

    public function play(Room $room, Flow $flow)
    {
        $room->load([
            'flows'                => fn($query) => $query->withCount('flowActivities')->orderBy('position'),
            'flows.flowActivities' => fn($query) => $query->orderBy('position'),
            'flows.flowActivities.activity'
        ]);

        if (auth()->check()) {
            $participant = null;
        } else {
            $participant = Participant::findOrFail(session('participant_id'));
            $participant->load('flowActivities');
        }

        $response = [
            'id'    => $room->id,
            'name'  => $room->name,
            'flows' => []
        ];

        foreach ($room->flows as $i => $flow2) {
            if ($flow2->id !== $flow->id) continue;

            $response['flows'][] = [
                'id'          => $flow2->id,
                'room_id'     => $flow2->room_id,
                'name'        => $flow2->name,
                'description' => $flow2->description,
                'icon'        => $flow2->icon,
                'color'       => $flow2->color,
                'order'       => $i + 1,
                'stats'       => [
                    'is_completed' => $participant !== null ? $flow->flow_activities_count === $participant->flowActivities->count() : null,
                ],
                'activities'  => $flow2->flowActivities->map(function ($flowActivity, $j) use ($participant) {
                    $attempt = $participant?->flowActivities->firstWhere('id', $flowActivity->id) ?? null;

                    if ($attempt !== null) {
                        $attempt = [
                            'answer'     => $attempt->pivot->answer,
                            'is_correct' => $attempt->pivot->is_correct,
                        ];
                    }

                    return [
                        'id'             => $flowActivity->id,
                        'type'           => $flowActivity->activity->content['type'],
                        'order'          => $j + 1,
                        'question'       => $flowActivity->activity->content['question'],
                        'correct_answer' => $flowActivity->activity->content['correct_answer'],
                        'wrong_answers'  => $flowActivity->activity->content['wrong_answers'],
                        'attempt'        => $attempt,
                    ];
                }),
            ];

            if ($flow2->id === $flow->id) break;
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

        $flowActivityId = $validated['flow_activity_id'];
        $answer = $validated['answer'];

        $flowActivity = FlowActivity::findOrFail($flowActivityId);
        $correctAnswer = $flowActivity->activity->content['correct_answer'] ?? null;
        $isCorrect = $correctAnswer !== null && $answer === $correctAnswer;

        $flowActivity->participants()->syncWithoutDetaching([
            $participantId => [
                'answer'     => $answer,
                'is_correct' => $isCorrect
            ]
        ]);

        return response()->noContent();
    }
}
