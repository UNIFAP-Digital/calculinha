<?php

namespace App\Http\Controllers;

use App\Http\Requests\{StoreRoomRequest, UpdateRoomRequest};
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Room::with('modules.activities')->latest()->get()
        );
    }

    public function store(StoreRoomRequest $request): JsonResponse
    {
        $room = $request->user()
                        ->ownedRooms()
                        ->create($request->validated());

        // attach modules with positions in one call
        $room->modules()->sync(
            collect($request->modules)
                ->mapWithKeys(fn ($id, $index) => [$id => ['position' => $index + 1]])
        );

        return response()->json($room->load('modules.activities'), 201);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json($room->load('modules.activities'));
    }

    public function update(UpdateRoomRequest $request, Room $room): JsonResponse
    {
        $this->authorize('update', $room);

        $room->update($request->validated());

        if ($request->has('modules')) {
            $room->modules()->sync(
                collect($request->modules)
                    ->mapWithKeys(fn ($id, $index) => [$id => ['position' => $index + 1]])
            );
        }

        return response()->json($room->load('modules.activities'));
    }

    public function destroy(Room $room): JsonResponse
    {
        $this->authorize('delete', $room);
        $room->delete();

        return response()->json(null, 204);
    }

    /* -------------------------------------------------
     |  Re-order modules
     * -------------------------------------------------*/
    public function reorderModules(Room $room): JsonResponse
    {
        $this->authorize('update', $room);

        request()->validate(['order' => 'required|array']);
        foreach (request('order') as $index => $moduleId) {
            $room->modules()->updateExistingPivot($moduleId, ['position' => $index + 1]);
        }

        return response()->json($room->modules);
    }
}
