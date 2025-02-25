<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InviteController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/Invite');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invite_code' => ['required', 'string', 'exists:rooms,invite_code'],
            'name'        => ['required', 'string', 'min:3', 'max:255'],
        ], [
            'invite_code.required' => 'O código de convite é obrigatório.',
            'invite_code.exists'   => 'Código de convite inválido.',
            'name.required'        => 'Seu nome é obrigatório.',
            'name.min'             => 'O nome deve ter pelo menos 3 caracteres.',
        ]);

        $room = Room::where('invite_code', $validated['invite_code'])->first();

        if (!$room->is_active) {
            return back()->withErrors([
                'invite_code' => 'Esta sala não está mais disponível.'
            ]);
        }

        $participant = Participant::create([
            'room_id' => $room->id,
            'name'    => $validated['name'],
        ]);

        session()->put('participant_id', $participant->id);

        return redirect()->route('quiz.index', ['room' => $room->id]);
    }
}
