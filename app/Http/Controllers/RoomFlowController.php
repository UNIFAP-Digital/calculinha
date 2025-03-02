<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomFlowActivityRequest;
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
    public function store(RoomFlowActivityRequest $request, Room $room)
    {
        $validated = $request->validated();
        $validated['position'] = RoomFlow::getInitialPosition($room->id);

        DB::transaction(function () use ($room, $validated) {
            foreach ($validated['flow_ids'] as $flowId) {
                $room->roomFlow()->upsert([
                    'flow_id'  => $flowId,
                    'position' => RoomFlow::getInitialPosition($room->id)
                ],
                    ['room_id', 'flow_id']
                );
            }
        });

        return back();
    }

    public function destroy(Room $room, RoomFlow $roomFlow)
    {
        Gate::authorize('delete', $roomFlow);
        $roomFlow->delete();
        return back();
    }

    public function moveUp(Room $room, RoomFlow $roomFlow)
    {
        Gate::authorize('update', $roomFlow);
        $roomFlow->moveUp();
        return back();
    }

    public function moveDown(Room $room, RoomFlow $roomFlow)
    {
        Gate::authorize('update', $roomFlow);
        $roomFlow->moveDown();
        return back();
    }
}
