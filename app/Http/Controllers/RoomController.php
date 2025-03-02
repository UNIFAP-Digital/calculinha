<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Http\Resources\FlowResource;
use App\Http\Resources\RoomResource;
use App\Models\Flow;
use App\Models\Room;
use App\Models\RoomFlow;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RoomController extends Controller
{
    public function index(?Room $room = null)
    {
        if ($room) Gate::authorize('view', [Room::class, $room]);

        $room?->load([
            'participants.flowActivities.activity',
            'participants.flowActivities.flow',
            'flows.activities'
        ]);

        $rooms = Auth::user()
            ->rooms()
            ->withCount('participants')
            ->orderByDesc('is_active')
            ->orderBy('name');

        return Inertia::render('room/Index', [
            'rooms' => fn() => RoomResource::collection($rooms->get()),
            'room'  => $room ? RoomResource::make($room) : null
        ]);
    }

    public function create(): Response
    {
        $flows = Auth
            ::user()
            ->flows()
            ->union(Flow::whereNull('owner_id'))
            ->get();

        return Inertia::render('room/Form', [
            'flows' => FlowResource::collection($flows)
        ]);
    }

    public function edit(Room $room)
    {
        $room->load('flows');

        $flows = Auth
            ::user()
            ->flows()
            ->union(Flow::whereNull('owner_id'))
            ->get();

        return Inertia::render('room/Form', [
            'room'  => new RoomResource($room),
            'flows' => FlowResource::collection($flows)
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(RoomRequest $request, Room $room)
    {
        $validated = $request->validated();
        $flowIds = $validated['flow_ids'];
        unset($validated['flow_ids']);

        DB::transaction(function () use ($flowIds, $room, $validated) {
            $room->flows()->sync(
                Arr::mapWithKeys($flowIds, fn($flowId, $index) => [
                    $flowId => ['position' => RoomFlow::$initialPosition + (RoomFlow::$positionGap * ($index + 1))]
                ])
            );
        });

        return to_route('rooms.index', $room);
    }

    /**
     * @throws Throwable
     */
    public function store(RoomRequest $request)
    {
        $validated = $request->validated();
        $flowIds = $validated['flow_ids'];
        unset($validated['flow_ids']);

        $room = DB::transaction(function () use ($flowIds, $validated) {
            $room = Auth::user()->rooms()->create($validated);

            $room->flows()->sync(
                Arr::mapWithKeys($flowIds, fn($flowId, $index) => [
                    $flowId => ['position' => RoomFlow::$initialPosition + (RoomFlow::$positionGap * ($index + 1))]
                ])
            );

            return $room;
        });

        return to_route('rooms.index', $room);
    }

    public function destroy(Room $room)
    {
        Gate::authorize('delete', $room);
        $room->delete();
        return to_route('rooms.index');
    }
}
