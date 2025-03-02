<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Flow;
use App\Models\FlowActivity;
use Illuminate\Support\Facades\Gate;

class FlowActivityController extends Controller
{
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
