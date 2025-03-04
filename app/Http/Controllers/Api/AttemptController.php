<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttemptRequest;
use App\Models\AttemptModuleActivity;
use Illuminate\Support\Facades\DB;
use Throwable;

class AttemptController extends Controller
{
    /**
     * @throws Throwable
     */
    public function store(AttemptRequest $request)
    {
        $validated = $request->validated();
        $activityId = $validated['activity_id'];
        $answer = $validated['answer'];

        $activity = AttemptModuleActivity::findOrFail($activityId);

        DB::transaction(function () use ($activity, $answer) {
            $activity->markAsAnswered($answer);

            if ($activity->module->isCompleted()) {
                $activity->module->attempt->advanceModule();
            }
        });

        return response()->noContent();
    }
}
