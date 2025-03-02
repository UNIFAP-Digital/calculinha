<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomFlowRequest;
use App\Models\Flow;
use App\Models\Room;
use App\Models\RoomFlow;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Throwable;

class RoomFlowController extends Controller
{
    /**
     * @throws Throwable
     */
    public function store(RoomFlowRequest $request, Room $room)
    {
        $validated = $request->validated();
        $validated['position'] = RoomFlow::getInitialPosition($room->id);

        DB::transaction(function () use ($room, $validated) {
            foreach ($validated['flow_ids'] as $flowId) {
                $room->flows()->attach(
                    $flowId, ['position' => $validated['position']]
                );
                $validated['position'] = $validated['position'] + RoomFlow::$positionGap;
            }
        });

        return back();
    }

    public function destroy(Room $room, Flow $flow)
    {
        Gate::authorize('delete', [RoomFlow::class, $room]);
        $room->flows()->detach($flow);
        return back();
    }

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
