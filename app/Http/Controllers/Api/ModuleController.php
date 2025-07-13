<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Module;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate(['room_id' => 'required|integer|exists:rooms,id']);
        $room = Room::find($validated['room_id']);
        Gate::authorize('viewAny', [Module::class, $room]);

        $modules = Module::whereNotIn(
            'id',
            fn ($query) => $query->select('module_id')->from('room_module')->where('room_id', $room->id)
        )
            ->withCount('activities')
            ->get();

        return ModuleResource::collection($modules);
    }
}
