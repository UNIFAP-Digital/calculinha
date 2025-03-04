<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invite_code'   => ['required', 'string', 'exists:rooms,invite_code'],
            'enrollment_id' => ['required', 'string', 'min:3', 'max:8'],
            'name'          => ['required', 'string', 'min:3', 'max:255'],
        ], [
            'invite_code.required' => 'O código de convite é obrigatório.',
            'invite_code.exists'   => 'Código de convite inválido.',
            'name.required'        => 'Seu nome é obrigatório.',
            'name.min'             => 'O nome deve ter pelo menos 3 caracteres.',
        ]);

        $room = Room::whereInviteCode($validated['invite_code'])->first();

        if (!$room->is_active) {
            return back()->withErrors([
                'invite_code' => 'Esta sala não está mais disponível.'
            ]);
        }

        DB::transaction(function () use ($room, $validated) {
            $student = Student::firstOrCreate(['enrollment_id' => $validated['enrollment_id']], [
                'enrollment_id' => $validated['enrollment_id'],
                'name'          => $validated['name']
            ]);

            // Apenas para criar uma tentativa inicial se ainda não existir.
            Attempt::current($room, $student);

            session()->put('student_id', $student->id);
        });

        return redirect()->route('quiz.index', ['room' => $room->id]);
    }
}
