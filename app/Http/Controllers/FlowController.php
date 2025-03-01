<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowRequest;
use App\Http\Resources\FlowResource;
use App\Models\Flow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlowController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Flow::class);

        $flows = $request
            ->user()
            ->flows()
            ->with([
                'flowActivities' => fn($query) => $query->orderBy('position'),
                'flowActivities.activity'
            ])
            ->orderBy('name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('FlowManagement', [
            'flows' => FlowResource::collection($flows)
        ]);
    }

    public function store(FlowRequest $request)
    {
        $validated = $request->validated();
        $flow = Auth::user()->flows()->create($validated);
        return to_route('flows.index', $flow);
    }

    public function update(FlowRequest $request, Flow $flow)
    {
        $validated = $request->validated();
        $flow->update($validated);
        return back();
    }

    public function destroy(Flow $flow)
    {
        Gate::authorize('delete', $flow);
        $flow->delete();
        return to_route('flows.index');
    }
}
