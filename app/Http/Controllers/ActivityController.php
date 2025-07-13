<?php

namespace App\Http\Controllers;

use App\Http\Requests\{StoreActivityRequest, UpdateActivityRequest};
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ActivityController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Activity::latest()->get());
    }

    public function store(StoreActivityRequest $request): JsonResponse
    {
        $activity = $request->user()
                            ->ownedActivities()
                            ->create($request->validated());

        return response()->json($activity, 201);
    }

    public function show(Activity $activity): JsonResponse
    {
        return response()->json($activity);
    }

    public function update(UpdateActivityRequest $request, Activity $activity): JsonResponse
    {
        $this->authorize('update', $activity);
        $activity->update($request->validated());

        return response()->json($activity);
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $this->authorize('delete', $activity);
        $activity->delete();

        return response()->json(null, 204);
    }
}