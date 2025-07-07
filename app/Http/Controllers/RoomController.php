<?php

namespace App\Http\Controllers;

use App\Enums\Operation;
use App\Enums\Type;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\RoomResource;
use App\Models\Activity;
use App\Models\Module;
use App\Models\Room;
use App\Models\RoomModule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\support\facades\gate;
use Illuminate\Support\Str;
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

        $userModules = Auth::user()->modules()->withoutAllOperation(); 

        $publicModules = Module::whereNull('owner_id')
            ->withoutAllOperation(); 

        $modules = $userModules->union($publicModules)->get();

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

            do {
                $inviteCode = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
            } while (Room::where('invite_code', $inviteCode)->exists());
            $validated['invite_code'] = $inviteCode;

            /** @var Room $room */
            $room = $user->rooms()->create($validated);

            $preTestModule = $user->modules()->create([
                'name'        => 'Pré-Teste',
                'description' => 'Avaliação prévia gerada automaticamente para a sala ' . $room->name,
                'type'        => Type::PreTest,
                'operation'   => Operation::All,
            ]);

            $postTestModule = $user->modules()->create([
                'name'        => 'Pós-Teste',
                'description' => 'Avaliação final gerada automaticamente para a sala ' . $room->name,
                'type'        => Type::PostTest,
                'operation'   => Operation::All,
            ]);

            $randomActivityIds = Activity::query()->inRandomOrder()->limit(12)->pluck('id');
            $pivotDataForTests = collect($randomActivityIds)->mapWithKeys(fn($id, $idx) => [
                $id => ['position' => RoomModule::$initialPosition + ($idx * RoomModule::$positionGap)]
            ])->all();
            
            $preTestModule->activities()->sync($pivotDataForTests);
            $postTestModule->activities()->sync($pivotDataForTests);

            $pivotData = [];
            $position = RoomModule::$initialPosition;
            $gap = RoomModule::$positionGap;

            $pivotData[$preTestModule->id] = ['position' => $position];
            $position += $gap;

            foreach ($coreModuleIds as $moduleId) {
                $pivotData[$moduleId] = ['position' => $position];
                $position += $gap;
            }

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
