<?php

namespace App\Http\Controllers;

use App\Http\Requests\FlowRequest;
use App\Models\Flow;
use Illuminate\Support\Facades\Gate;

class FlowController extends Controller
{
    public function store(FlowRequest $request)
    {
        $validated = $request->validated();
        $validated['position'] = Flow::getInitialPosition($validated['room_id']);
        Flow::create($validated);
        return redirect()->back();
    }

    public function update(FlowRequest $request, Flow $flow)
    {
        $validated = $request->validated();
        $flow->update($validated);
        return redirect()->back();
    }

    public function destroy(Flow $flow)
    {
        Gate::authorize('delete', $flow);
        $flow->delete();
        return redirect()->back();
    }

    public function moveUp(Flow $flow)
    {
        Gate::authorize('update', $flow->room);
        $flow->moveUp();

        if ($this->needsRebalancing($flow))
            $flow->rebalancePositions();

        return redirect()->back();
    }

    public function moveDown(Flow $flow)
    {
        Gate::authorize('update', $flow->room);
        $flow->moveDown();

        if ($this->needsRebalancing($flow)) {
            $flow->rebalancePositions();
        }

        return redirect()->back();
    }

    private function needsRebalancing(Flow $flow): bool
    {
        // Verifica se existem posições muito próximas
        return Flow::where('room_id', $flow->room_id)
            ->where(function ($query) use ($flow) {
                $query->whereBetween('position', [
                    $flow->position - Flow::POSITION_GAP / 4,
                    $flow->position + Flow::POSITION_GAP / 4
                ])
                    ->where('id', '!=', $flow->id);
            })
            ->exists();
    }
}
