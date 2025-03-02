<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\FlowResource;
use App\Models\Activity;
use App\Models\Flow;
use App\Models\FlowActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FlowController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Flow::class);

        $flows = $request
            ->user()
            ->flows()
            ->with('activities')
            ->orderBy('name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('flow/Index', [
            'flows' => FlowResource::collection($flows)
        ]);
    }

    public function create()
    {
        $activities = Auth
            ::user()
            ->activities()
            ->union(Activity::whereNull('owner_id'))
            ->get();

        return Inertia::render('flow/Form', [
            'activities' => ActivityResource::collection($activities)
        ]);
    }

    public function edit(Flow $flow)
    {
        $flow->load('activities');

        $activities = Auth
            ::user()
            ->activities()
            ->union(Activity::whereNull('owner_id'))
            ->get();

        return Inertia::render('flow/Form', [
            'flow'       => new FlowResource($flow),
            'activities' => ActivityResource::collection($activities)
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(FlowRequest $request)
    {
        $validated = $request->validated();
        $activityIds = $validated['activity_ids'];
        unset($validated['activity_ids']);

        DB::transaction(function () use ($activityIds, $validated) {
            $flow = Auth::user()->flows()->create($validated);

            $flow->activities()->sync(
                Arr::mapWithKeys($activityIds, fn($activityId, $index) => [
                    $activityId => ['position' => FlowActivity::$initialPosition + (FlowActivity::$positionGap * ($index + 1))]
                ])
            );
        });

        return to_route('flows.index');
    }

    /**
     * @throws Throwable
     */
    public function update(FlowRequest $request, Flow $flow)
    {
        $validated = $request->validated();
        $activityIds = $validated['activity_ids'];
        unset($validated['activity_ids']);

        DB::transaction(function () use ($activityIds, $flow, $validated) {
            $flow->update($validated);

            $flow->activities()->sync(
                Arr::mapWithKeys($activityIds, fn($activityId, $index) => [
                    $activityId => ['position' => FlowActivity::$initialPosition + (FlowActivity::$positionGap * ($index + 1))]
                ])
            );
        });

        $flow->update($validated);
        return to_route('flows.index');
    }

    public function destroy(Flow $flow)
    {
        Gate::authorize('delete', $flow);
        $flow->delete();
        return back();
    }
}
