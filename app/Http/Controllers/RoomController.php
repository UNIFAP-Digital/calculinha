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
        $coreModuleIds = $validated['module_ids'];
        unset($validated['module_ids']);

        $room = DB::transaction(function () use ($coreModuleIds, $validated) {
            $user = Auth::user();
            /** @var Room $room */
            $room = $user->rooms()->create($validated);

            // Create Pre‑Test and Post‑Test modules owned by the creator
            $preTestModule = $user->modules()->create([
                'name'        => 'Pre‑Test',
                'description' => 'Pre‑assessment automatically generated',
                'operation'   => \App\Enums\Operation::Addition, // Arbitrary – can contain mixed questions
                'type'        => \App\Enums\Type::PreTest,
            ]);

            $postTestModule = $user->modules()->create([
                'name'        => 'Post‑Test',
                'description' => 'Post‑assessment automatically generated',
                'operation'   => \App\Enums\Operation::Addition,
                'type'        => \App\Enums\Type::PostTest,
            ]);

            // Populate both assessments with 12 random activities
            $randomActivities = fn() => \App\Models\Activity::query()
                ->inRandomOrder()
                ->limit(12)
                ->pluck('id');

            $position = 1;
            foreach ([$preTestModule, $postTestModule] as $assessmentModule) {
                $assessmentModule->activities()->sync(
                    collect($randomActivities())->mapWithKeys(fn($id, $idx) => [
                        $id => ['position' => $idx + 1]
                    ])->all()
                );
            }

            // Build pivot data keeping desired order: PRE_TEST, CORE…, POST_TEST
            $pivotData = [];
            $position = \App\Models\RoomModule::$initialPosition;
            $gap      = \App\Models\RoomModule::$positionGap;

            // 1. Pre‑Test
            $pivotData[$preTestModule->id] = ['position' => $position];
            $position += $gap;

            // 2. Core modules chosen by user
            foreach ($coreModuleIds as $moduleId) {
                $pivotData[$moduleId] = ['position' => $position];
                $position += $gap;
            }

            // 3. Post‑Test
            $pivotData[$postTestModule->id] = ['position' => $position];

            $room->modules()->sync($pivotData);

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
