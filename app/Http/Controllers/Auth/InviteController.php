<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\InviteRequest;
use App\Models\Attempt;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InviteController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/StudentRegister');
    }

    /**
     * @throws Throwable
     */
    public function store(InviteRequest $request): RedirectResponse
    {
        [$student, $room] = DB::transaction(function () use ($request) {
            $newStudent = Student::create([
                'name' => $request->input('name'),
                'username' => $request->input('username'),
                'enrollment_id' => $request->input('enrollment_id'),
                'password' => $request->input('password'),
            ]);

            $foundRoom = Room::where('invite_code', $request->input('invite_code'))->firstOrFail();

            Attempt::current($foundRoom, $newStudent);
            
            return [$newStudent, $foundRoom];
        });

        Auth::guard('student')->login($student);

        $request->session()->regenerate();
        
        return redirect()->route('quiz.index', ['room' => $room->id]);
    }
}
