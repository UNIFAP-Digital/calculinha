<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
{
    public function rules(): array
    {
        if ($this->method() === 'PUT') {
            return [
                'name'      => 'required|string|min:3|max:255',
                'is_active' => 'required|boolean',
            ];
        }

        return [
            'name' => 'required|string|min:3|max:255',
        ];
    }
}
