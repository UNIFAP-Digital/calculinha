<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowActivityRequest;
use App\Models\FlowActivity;
use App\Models\Room;
use Illuminate\Support\Facades\Gate;

class FlowActivityController extends Controller
{
    public function store(FlowActivityRequest $request)
    {
        $validated = $request->validated();
        $validated['position'] = FlowActivity::getInitialPosition($validated['flow_id']);
        FlowActivity::create($validated);
        return redirect()->back();
    }

    public function destroy(Room $room, int $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('delete', $flowActivity);
        $flowActivity->delete();
        return redirect()->back();
    }

    public function moveUp(Room $room, int $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('update', $flowActivity);
        $flowActivity->moveUp();

        if (FlowActivity::needsRebalancing($flowActivity))
            $flowActivity->rebalancePositions();

        return redirect()->back();
    }

    public function moveDown(Room $room, int $flow, FlowActivity $flowActivity)
    {
        Gate::authorize('update', $flowActivity);
        $flowActivity->moveDown();

        if (FlowActivity::needsRebalancing($flowActivity)) {
            $flowActivity->rebalancePositions();
        }

        return redirect()->back();
    }
}
