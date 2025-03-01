<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Models\Flow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate(['flow_id' => 'required|integer|exists:flows,id']);
        $flow = Flow::find($validated['flow_id']);
        Gate::authorize('viewAny', [Activity::class, $flow]);

        $activities = Activity
            ::whereNotIn(
                'id',
                fn($query) => $query->select('activity_id')->from('flow_activities')->where('flow_id', $flow->id)
            )
            ->orderBy('created_at')
            ->get();

        return ActivityResource::collection($activities);
    }
}
