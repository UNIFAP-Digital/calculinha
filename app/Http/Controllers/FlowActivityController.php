<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowActivityRequest;
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
                $flow->flowActivities()->upsert([
                    'activity_id' => $activityId,
                    'position'    => FlowActivity::getInitialPosition($flow->id)
                ],
                    ['flow_id', 'activity_id']
                );
            }
        });

        return back();
    }

    public function destroy(Flow $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('delete', $flowActivity);
        $flowActivity->delete();
        return back();
    }

    public function moveUp(Flow $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('update', $flowActivity);
        $flowActivity->moveUp();
        return back();
    }

    public function moveDown(Flow $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('update', $flowActivity);
        $flowActivity->moveDown();
        return back();
    }
}
