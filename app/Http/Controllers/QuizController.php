<?php

namespace App\Http\Controllers;

use App\Http\Resources\FlowResource;
use App\Http\Resources\RoomResource;
use App\Models\Flow;
use App\Models\Room;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Room $room)
    {
        $room->load([
            'flows'                => fn($query) => $query->withCount('flowActivities')->orderBy('position'),
            'flows.flowActivities' => fn($query) => $query->orderBy('position'),
            'flows.flowActivities.activity'
        ]);

        return Inertia::render('quiz/Intro', [
            'room' => new RoomResource($room),
        ]);
    }

    public function game(Room $room, Flow $flow)
    {
        $flow->load([
            'flowActivities' => fn($query) => $query->orderBy('position'),
            'flowActivities.activity'
        ]);

        return Inertia::render('quiz/Game', [
            'flow' => new FlowResource($flow),
        ]);
    }
}
