<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Auth::user()
            ->rooms()
            ->withCount('participants')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get();

        return Inertia::render('RoomManagement', [
            'rooms' => RoomResource::collection($rooms),
        ]);
    }

    public function store(RoomRequest $request)
    {
        Gate::authorize('create', Room::class);

        $validated = $request->validated();

        $validInviteCode = function (): string {
            do {
                $code = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
                $exists = Room::where('invite_code', $code)->exists();
            } while ($exists);

            return $code;
        };

        $validated['invite_code'] = $validInviteCode();

        $request->user()->rooms()->create($validated);

        return to_route('rooms.index');
    }
}
