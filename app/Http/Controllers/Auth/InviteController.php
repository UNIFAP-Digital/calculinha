<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\InviteRequest;
use App\Models\Attempt;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InviteController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/Invite');
    }

    /**
     * @throws Throwable
     */
    public function store(InviteRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $room = Room::whereInviteCode($request->input('invite_code'))->first();
        $student = Auth::guard('student')->user();

        DB::transaction(fn() => Attempt::current($room, $student));

        return redirect()->route('quiz.index', ['room' => $room->id]);
    }
}
