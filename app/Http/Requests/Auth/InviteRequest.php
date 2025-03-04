<?php

namespace App\Http\Requests\Auth;

use App\Models\Student;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InviteRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'invite_code'   => ['required', 'string', Rule::exists('rooms')->where('is_active', true)],
            'enrollment_id' => ['required', 'string', 'min:3', 'max:8'],
            'name'          => ['required', 'string', 'min:3', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'invite_code.required' => 'O código de convite é obrigatório.',
            'invite_code.exists'   => 'Código de convite inválido.',
            'name.required'        => 'Seu nome é obrigatório.',
            'name.min'             => 'O nome deve ter pelo menos 3 caracteres.',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (Auth::guard('student')->validate($this->only('enrollment_id'))) {
            $student = Student::find($this->input('enrollment_id'));
            $student->name = $this->input('name');
            $student->save();
        } else {
            $student = Student::create([
                'name'          => $this->input('name'),
                'enrollment_id' => $this->input('enrollment_id'),
            ]);
        }

        Auth::guard('student')->login($student);

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 10)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'enrollment_id' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('enrollment_id')) . '|' . $this->ip());
    }
}
