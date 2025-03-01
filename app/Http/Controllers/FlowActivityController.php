<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowActivityRequest;
use App\Models\Flow;
use App\Models\FlowActivity;
use Illuminate\Support\Facades\Gate;

class FlowActivityController extends Controller
{
    public function store(FlowActivityRequest $request, Flow $flow)
    {
        $validated = $request->validated();
        $validated['position'] = FlowActivity::getInitialPosition($flow->id);
        $flow->flowActivities()->create($validated);
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
