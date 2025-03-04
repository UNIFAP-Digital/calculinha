<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttemptRequest;
use App\Models\AttemptModuleActivity;

class AttemptController extends Controller
{
    public function store(AttemptRequest $request)
    {
        $validated = $request->validated();
        $activityId = $validated['activity_id'];
        $answer = $validated['answer'];

        $activity = AttemptModuleActivity::findOrFail($activityId);
        $correctAnswer = $activity->content['correct_answer'] ?? null;
        $isCorrect = $correctAnswer !== null && $answer === $correctAnswer;

        $activity->answer = $answer;
        $activity->is_correct = $isCorrect;

        $activity->save();

        return response()->noContent();
    }
}
