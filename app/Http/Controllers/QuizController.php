<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuizResultRequest;
use App\Http\Resources\FlowResource;
use App\Http\Resources\RoomResource;
use App\Models\Flow;
use App\Models\FlowActivity;
use App\Models\Room;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class QuizController extends Controller
{
    public function index(Room $room)
    {
        $room->load([
            'flows'                => fn($query) => $query->withCount('flowActivities')->orderBy('position'),
            'flows.flowActivities' => fn($query) => $query->orderBy('position'),
            'flows.flowActivities.activity'
        ]);

        return Inertia::render('quiz/Intro', [
            'room' => new RoomResource($room),
        ]);
    }

    public function game(Room $room, Flow $flow)
    {
        $flow->load([
            'flowActivities' => fn($query) => $query->orderBy('position'),
            'flowActivities.activity'
        ]);

        return Inertia::render('quiz/Game', [
            'flow' => new FlowResource($flow),
        ]);
    }

    public function result(QuizResultRequest $request)
    {
        if (!$request->ajax()) throw new BadRequestHttpException();

        $participantId = session('participant_id');

        $validated = $request->validated();
        $attempts = $validated['attempts'];

        foreach ($attempts as $attemptData) {
            $flowActivityId = $attemptData['flow_activity_id'];
            $answer = $attemptData['answer'];

            $flowActivity = FlowActivity::findOrFail($flowActivityId);
            $correctAnswer = $flowActivity->activity->content['correct_answer'] ?? null;
            $isCorrect = $correctAnswer !== null && $answer === $correctAnswer;

            $flowActivity->participants()->syncWithoutDetaching([
                $participantId => [
                    'answer'     => $answer,
                    'is_correct' => $isCorrect
                ]
            ]);
        }

        return response()->noContent();
    }
}
