<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(?Room $room = null)
    {
        if ($room) Gate::authorize('view', [Room::class, $room]);

        $room?->load([
            'participants.flowActivities.activity',
            'participants.flowActivities.flow',
            'flows'                => fn($query) => $query->withCount('flowActivities')->orderBy('position'),
            'flows.flowActivities' => fn($query) => $query->orderBy('position'),
            'flows.flowActivities.activity'
        ]);

        $rooms = Auth::user()
            ->rooms()
            ->withCount('participants')
            ->orderByDesc('is_active')
            ->orderBy('name');

        return Inertia::render('RoomManagement', [
            'rooms' => fn() => RoomResource::collection($rooms->get()),
            'room'  => $room ? new RoomResource($room) : null
        ]);
    }

    public function update(RoomRequest $request, Room $room)
    {
        Gate::authorize('update', [Room::class, $room]);
        $validated = $request->validated();
        $room->update($validated);
        return back();
    }

    public function store(RoomRequest $request)
    {
        Gate::authorize('create', Room::class);

        $validated = $request->validated();
        $validated['invite_code'] = Room::generateValidInviteCode();

        $room = $request->user()->rooms()->create($validated);

        return to_route('rooms.index', $room);
    }

    public function destroy(Room $room)
    {
        Gate::authorize('delete', $room);
        $room->delete();
        return to_route('rooms.index');
    }
}
