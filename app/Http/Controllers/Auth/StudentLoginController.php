<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia; // 1. Importe o Inertia
use Inertia\Response; // 2. Importe a classe Response

class StudentLoginController extends Controller
{
    /**
     * Mostra o formulário de login para o aluno.
     *
     * @return \Inertia\Response
     */
    public function create(): Response // 3. Altere o tipo de retorno para Response
    {
        // 4. Use Inertia::render para chamar seu componente React
        return Inertia::render('auth/StudentLogin');
    }

    /**
     * Processa a tentativa de login do aluno.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('student')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'username' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }

    /**
     * Faz o logout do aluno.
     */
    public function destroy(Request $request)
    {
        Auth::guard('student')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
