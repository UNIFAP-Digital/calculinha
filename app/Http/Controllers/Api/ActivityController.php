<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate(['module_id' => 'required|integer|exists:modules,id']);
        $module = Module::find($validated['module_id']);
        Gate::authorize('viewAny', [Activity::class, $module]);

        $activities = Activity
            ::whereNotIn(
                'id',
                fn($query) => $query->select('activity_id')->from('module_activity')->where('module_id', $module->id)
            )
            ->orderBy('created_at')
            ->get();

        return ActivityResource::collection($activities);
    }
}
