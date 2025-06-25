<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class InviteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:students,username'],
            'enrollment_id' => ['required', 'string', 'max:255', 'unique:students,enrollment_id'],
            'password' => ['required', 'confirmed'],
            'invite_code' => ['required', 'string', 'exists:rooms,invite_code'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
            'name.min' => 'O nome precisa ter no mínimo 3 caracteres.',
            'username.required' => 'O nome de usuário é obrigatório.',
            'username.unique' => 'Este nome de usuário já está em uso.',
            'enrollment_id.required' => 'O número da matrícula é obrigatório.',
            'enrollment_id.unique' => 'Esta matrícula já foi registrada.',
            'password.required' => 'A senha é obrigatória.',
            'password.confirmed' => 'A confirmação de senha não confere.',
            'invite_code.required' => 'O código de convite é obrigatório.',
            'invite_code.exists' => 'O código de convite é inválido.',
        ];
    }
}
