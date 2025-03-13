<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Activity::class);

        $activities = $request
            ->user()
            ->activities()
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('ActivityManagement', [
            'activities' => ActivityResource::collection($activities)
        ]);
    }

    public function store(ActivityRequest $request)
    {
        $validated = $request->validated();
        $request->user()->activities()->create($validated);
        return back();
    }

    public function update(ActivityRequest $request, Activity $activity)
    {
        $validated = $request->validated();
        $activity->update($validated);
        return back();
    }

    public function destroy(Activity $activity)
    {
        Gate::authorize('delete', $activity);
        $activity->delete();
        return back();
    }
}
