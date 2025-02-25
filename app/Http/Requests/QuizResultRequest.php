<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QuizResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->guest() && session()->has('participant_id');
    }

    public function rules(): array
    {
        return [
            'attempts'                    => ['required', 'array', 'min:1'],
            'attempts.*.flow_activity_id' => ['required', 'exists:flow_activities,id'],
            'attempts.*.answer'           => ['required', 'string', 'max:255']
        ];
    }
}
