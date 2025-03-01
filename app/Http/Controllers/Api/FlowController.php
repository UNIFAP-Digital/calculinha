<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FlowResource;
use App\Models\Flow;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FlowController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate(['room_id' => 'required|integer|exists:rooms,id',]);
        $room = Room::find($validated['room_id']);
        Gate::authorize('viewAny', [Flow::class, $room]);

        $flows = Flow::whereNotIn(
            'id',
            fn($query) => $query->select('flow_id')->from('room_flows')->where('room_id', $room->id)
        )->get();

        return FlowResource::collection($flows);
    }
}
