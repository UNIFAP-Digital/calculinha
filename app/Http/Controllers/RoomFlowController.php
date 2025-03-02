<?php

namespace App\Http\Controllers;

use App\Models\Flow;
use App\Models\Room;
use App\Models\RoomFlow;
use Illuminate\Support\Facades\Gate;

class RoomFlowController extends Controller
{
    public function moveUp(Room $room, Flow $flow)
    {
        Gate::authorize('update', [RoomFlow::class, $room, $flow]);

        $flow = $room->flows()->find($flow->id);
        $flow->pivot->moveUp();

        return back();
    }

    public function moveDown(Room $room, Flow $flow)
    {
        Gate::authorize('update', [RoomFlow::class, $room, $flow]);

        $flow = $room->flows()->find($flow->id);
        $flow->pivot->moveDown();

        return back();
    }
}
