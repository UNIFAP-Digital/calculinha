<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Room;
use App\Models\RoomModule;
use Illuminate\Support\Facades\Gate;

class RoomModuleController extends Controller
{
    public function moveUp(Room $room, Module $module)
    {
        Gate::authorize('update', [RoomModule::class, $room, $module]);

        $module = $room->modules()->find($module->id);
        $module->pivot->moveUp();

        return back();
    }

    public function moveDown(Room $room, Module $module)
    {
        Gate::authorize('update', [RoomModule::class, $room, $module]);

        $module = $room->modules()->find($module->id);
        $module->pivot->moveDown();

        return back();
    }
}
