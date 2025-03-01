<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Activity::class);
        $request->validate(['flow_id' => 'required|integer|exists:flows,id',]);

        $flowId = $request->flow_id;

        $activities = Activity
            ::whereNotIn(
                'id',
                fn($query) => $query->select('activity_id')->from('flow_activities')->where('flow_id', $flowId)
            )
            ->orderBy('created_at')
            ->get();

        return ActivityResource::collection($activities);
    }
}
