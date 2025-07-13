<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Display the student login form.
     */
    public function showStudentLoginForm(): Response
    {
        return Inertia::render('auth/student-login');
    }

    /**
     * Display the teacher login form.
     */
    public function showTeacherLoginForm(): Response
    {
        return Inertia::render('auth/teacher-login');
    }

    /**
     * Handle student login.
     */
    public function student(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        // Check if user exists and is a student
        $user = \App\Models\User::where('username', $credentials['username'])
            ->where('role', Role::Student)
            ->first();

        if (!$user || !Auth::attempt([
            'username' => $credentials['username'],
            'password' => $credentials['password'],
        ], $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'username' => __('Credenciais inválidas ou usuário não é um aluno.'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));

        $request->session()->regenerate();

        return redirect()->intended(route('student.dashboard'));
    }

    /**
     * Handle teacher login.
     */
    public function teacher(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        // Check if user exists and is a teacher
        $user = \App\Models\User::where('email', $credentials['email'])
            ->where('role', Role::Teacher)
            ->first();

        if (!$user || !Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $request->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'email' => __('Credenciais inválidas ou usuário não é um professor.'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));

        $request->session()->regenerate();

        return redirect()->intended(route('teacher.dashboard'));
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    protected function throttleKey(Request $request): string
    {
        return strtolower($request->input('email') ?? $request->input('username')).'|'.$request->ip();
    }

    /**
     * Log the user out of the application.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
