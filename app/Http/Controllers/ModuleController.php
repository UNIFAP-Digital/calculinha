<?php

namespace App\Http\Controllers;

use App\Http\Requests\{StoreModuleRequest, UpdateModuleRequest};
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ModuleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Module::with('activities')->latest()->get()
        );
    }

    public function store(StoreModuleRequest $request): JsonResponse
    {
        $module = $request->user()
                          ->ownedModules()
                          ->create($request->validated());

        $module->activities()->sync(
            collect($request->activities)
                ->mapWithKeys(fn ($id, $index) => [$id => ['position' => $index + 1]])
        );

        return response()->json($module->load('activities'), 201);
    }

    public function show(Module $module): JsonResponse
    {
        return response()->json($module->load('activities'));
    }

    public function update(UpdateModuleRequest $request, Module $module): JsonResponse
    {
        $this->authorize('update', $module);

        $module->update($request->validated());

        if ($request->has('activities')) {
            $module->activities()->sync(
                collect($request->activities)
                    ->mapWithKeys(fn ($id, $index) => [$id => ['position' => $index + 1]])
            );
        }

        return response()->json($module->load('activities'));
    }

    public function destroy(Module $module): JsonResponse
    {
        $this->authorize('delete', $module);
        $module->delete();

        return response()->json(null, 204);
    }

    /* -------------------------------------------------
     |  Re-order activities
     * -------------------------------------------------*/
    public function reorderActivities(Module $module): JsonResponse
    {
        $this->authorize('update', $module);

        request()->validate(['order' => 'required|array']);
        foreach (request('order') as $index => $activityId) {
            $module->activities()->updateExistingPivot($activityId, ['position' => $index + 1]);
        }

        return response()->json($module->activities);
    }
}