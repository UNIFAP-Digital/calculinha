<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowRequest;
use App\Models\Flow;
use App\Models\Room;
use Illuminate\Support\Facades\Gate;

class FlowController extends Controller
{
    public function store(FlowRequest $request)
    {
        $validated = $request->validated();
        $validated['position'] = Flow::getInitialPosition($validated['room_id']);
        Flow::create($validated);
        return redirect()->back();
    }

    public function update(FlowRequest $request, Room $room, Flow $flow)
    {
        $validated = $request->validated();
        $flow->update($validated);
        return redirect()->back();
    }

    public function destroy(Room $room, Flow $flow)
    {
        Gate::authorize('delete', $flow);
        $flow->delete();
        return redirect()->back();
    }

    public function moveUp(Room $room, Flow $flow)
    {
        Gate::authorize('update', $flow->room);
        $flow->moveUp();
        return redirect()->back();
    }

    public function moveDown(Room $room, Flow $flow)
    {
        Gate::authorize('update', $flow->room);
        $flow->moveDown();
        return redirect()->back();
    }
}
