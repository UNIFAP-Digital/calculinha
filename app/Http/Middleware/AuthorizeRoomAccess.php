<?php

namespace App\Http\Middleware;

use App\Models\Student;
use App\Models\Room;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthorizeRoomAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $roomOrId = $request->route('room');
        $room = $roomOrId instanceof Room ? $roomOrId : Room::find($roomOrId);

        if (!$room instanceof Room) {
            abort(404, 'Sala não encontrada');
        }

        if (Auth::check()) {
            $user = Auth::user();

            if ($room->owner_id !== $user->id) abort(401);

            return $next($request);
        }

        if (session()->has('student_id')) {
            $student = Student::findOrFail(session('student_id'));

            if ($student && $student->rooms()->find($room))
                return $next($request);
        }

        abort(401);
    }
}
