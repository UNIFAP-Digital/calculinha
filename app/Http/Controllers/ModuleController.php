<?php

namespace App\Http\Controllers;

use App\Enums\Type;
use App\Http\Requests\ModuleRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ModuleResource;
use App\Models\Activity;
use App\Models\Module;
use App\Models\ModuleActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Module::class);

        $modules = $request
            ->user()
            ->modules()
            ->withCount('activities')
            ->orderBy('name')
            ->orderByDesc('created_at')
            ->where('type', Type::Exercise)
            ->get();

        return Inertia::render('module/Index', [
            'modules' => ModuleResource::collection($modules)
        ]);
    }

    public function show(Module $module)
    {
        Gate::authorize('view', [$module]);

        $module->load([
            'activities' => fn($query) => $query->orderBy('position'),
            'activities.owner'
        ]);

        $modules = Auth::user()
            ->modules()
            ->withCount('activities')
            ->orderBy('name')
            ->get();

        return Inertia::render('module/Show', [
            'modules' => ModuleResource::collection($modules),
            'currentModule' => ModuleResource::make($module)
        ]);
    }

    public function create()
    {
        $activities = Auth
            ::user()
            ->activities()
            ->union(Activity::whereNull('owner_id'))
            ->get();

        return Inertia::render('module/Form', [
            'activities' => ActivityResource::collection($activities)
        ]);
    }

    public function edit(Module $module)
    {
        $module->load('activities');

        $activities = Auth
            ::user()
            ->activities()
            ->union(Activity::whereNull('owner_id'))
            ->get();

        return Inertia::render('module/Form', [
            'module'       => new ModuleResource($module),
            'activities' => ActivityResource::collection($activities)
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(ModuleRequest $request)
    {
        $validated = $request->validated();
        $activityIds = $validated['activity_ids'];
        unset($validated['activity_ids']);

        DB::transaction(function () use ($activityIds, $validated) {
            $module = Auth::user()->modules()->create($validated);

            $module->activities()->sync(
                Arr::mapWithKeys($activityIds, fn($activityId, $index) => [
                    $activityId => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * ($index + 1))]
                ])
            );
        });

        return to_route('modules.index');
    }

    /**
     * @throws Throwable
     */
    public function update(ModuleRequest $request, Module $module)
    {
        $validated = $request->validated();
        $activityIds = $validated['activity_ids'];
        unset($validated['activity_ids']);

        DB::transaction(function () use ($activityIds, $module, $validated) {
            $module->update($validated);

            $module->activities()->sync(
                Arr::mapWithKeys($activityIds, fn($activityId, $index) => [
                    $activityId => ['position' => ModuleActivity::$initialPosition + (ModuleActivity::$positionGap * ($index + 1))]
                ])
            );
        });

        $module->update($validated);
        return to_route('modules.index');
    }

    public function destroy(Module $module)
    {
        Gate::authorize('delete', $module);
        $module->delete();
        return back();
    }
}
