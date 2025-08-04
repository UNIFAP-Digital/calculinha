<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JoinRoomController extends Controller
{
    public function create()
    {
        $student = Auth::user();

        return Inertia::render('Student/JoinRoom', [
            'room' => $student->room,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'exists:rooms,code'],
        ]);

        $room = Room::where('code', $request->code)->firstOrFail();

        $student = Auth::user();
        $student->room()->associate($room);
        $student->save();

        return redirect()->route('student.dashboard');
    }
}
