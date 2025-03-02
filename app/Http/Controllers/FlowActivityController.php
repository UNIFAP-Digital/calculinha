<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowActivityRequest;
use App\Models\Activity;
use App\Models\Flow;
use App\Models\FlowActivity;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Throwable;

class FlowActivityController extends Controller
{
    /**
     * @throws Throwable
     */
    public function store(FlowActivityRequest $request, Flow $flow)
    {
        $validated = $request->validated();
        $validated['position'] = FlowActivity::getInitialPosition($flow->id);

        DB::transaction(function () use ($flow, $validated) {
            foreach ($validated['activity_ids'] as $activityId) {
                $flow->activities()->attach(
                    $activityId, ['position' => $validated['position']]
                );
                $validated['position'] = $validated['position'] + FlowActivity::$positionGap;
            }
        });

        return back();
    }

    public function destroy(Flow $flow, Activity $activity)
    {
        Gate::authorize('delete', [FlowActivity::class, $flow]);
        $flow->activities()->detach($activity);
        return back();
    }

    public function moveUp(Flow $flow, Activity $activity)
    {
        Gate::authorize('update', [FlowActivity::class, $flow, $activity]);

        $activity = $flow->activities()->find($activity);
        $activity->pivot->moveUp();

        return back();
    }

    public function moveDown(Flow $flow, Activity $activity)
    {
        Gate::authorize('update', [FlowActivity::class, $flow, $activity]);

        $activity = $flow->activities()->find($activity);
        $activity->pivot->moveDown();

        return back();
    }
}
