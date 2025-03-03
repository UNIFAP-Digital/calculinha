<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Module;
use App\Models\ModuleActivity;
use Illuminate\Support\Facades\Gate;

class ModuleActivityController extends Controller
{
    public function moveUp(Module $module, Activity $activity)
    {
        Gate::authorize('update', [ModuleActivity::class, $module, $activity]);

        $activity = $module->activities()->find($activity);
        $activity->pivot->moveUp();

        return back();
    }

    public function moveDown(Module $module, Activity $activity)
    {
        Gate::authorize('update', [ModuleActivity::class, $module, $activity]);

        $activity = $module->activities()->find($activity);
        $activity->pivot->moveDown();

        return back();
    }
}
