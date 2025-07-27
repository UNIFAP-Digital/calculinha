<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        // Força a regeneração do token CSRF para evitar conflitos entre guards
        $request->session()->regenerateToken();

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

        // Força uma atualização completa da página para garantir que o novo token CSRF seja carregado
        return redirect('/')
            ->withHeaders([
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
    }
}
