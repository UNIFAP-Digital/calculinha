<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Services\RoomModuleService;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class RoomController extends Controller
{
    public function __construct(
        private readonly RoomModuleService $roomModuleService
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            Room::with('modules.activities')->latest()->get()
        );
    }

    public function store(RoomRequest $request): JsonResponse
    {
        $room = $this->roomModuleService->createRoomWithAutoModules(
            $request->validated()['name'],
            $request->user()
        );

        return response()->json($room, 201);
    }

    public function show(Room $room): JsonResponse
    {
        return response()->json($room->load('modules.activities'));
    }

    public function update(RoomRequest $request, Room $room): JsonResponse
    {
        $this->authorize('update', $room);

        $room->update(['name' => $request->validated()['name']]);

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
