<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\RoomResource;
use App\Models\Module;
use App\Models\Room;
use App\Models\RoomModule;
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
            'students.attempts.modules.activities',
            'modules.activities'
        ]);

        $rooms = Auth::user()
            ->rooms()
            ->withCount('students')
            ->orderByDesc('is_active')
            ->orderBy('name');

        return Inertia::render('room/Index', [
            'rooms' => fn() => RoomResource::collection($rooms->get()),
            'room'  => $room ? RoomResource::make($room) : null
        ]);
    }

    public function create(): Response
    {
        $modules = Auth
            ::user()
            ->modules()
            ->union(Module::whereNull('owner_id'))
            ->get();

        return Inertia::render('room/Form', [
            'modules' => ModuleResource::collection($modules)
        ]);
    }

    public function edit(Room $room)
    {
        $room->load('modules');

        $modules = Auth
            ::user()
            ->modules()
            ->union(Module::whereNull('owner_id'))
            ->get();

        return Inertia::render('room/Form', [
            'room'    => new RoomResource($room),
            'modules' => ModuleResource::collection($modules)
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(RoomRequest $request, Room $room)
    {
        $validated = $request->validated();
        $moduleIds = $validated['module_ids'];
        unset($validated['module_ids']);

        DB::transaction(function () use ($moduleIds, $room, $validated) {
            $room->modules()->sync(
                Arr::mapWithKeys($moduleIds, fn($moduleId, $index) => [
                    $moduleId => ['position' => RoomModule::$initialPosition + (RoomModule::$positionGap * ($index + 1))]
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
        $moduleIds = $validated['module_ids'];
        unset($validated['module_ids']);

        $room = DB::transaction(function () use ($moduleIds, $validated) {
            $room = Auth::user()->rooms()->create($validated);

            $room->modules()->sync(
                Arr::mapWithKeys($moduleIds, fn($moduleId, $index) => [
                    $moduleId => ['position' => RoomModule::$initialPosition + (RoomModule::$positionGap * ($index + 1))]
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
