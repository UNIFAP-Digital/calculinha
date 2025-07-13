<?php

namespace App\Http\Requests;

use App\Enums\OperationType;
use App\Models\Activity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            $activity = $this->route('activity');
            return $this->user()->can('update', $activity);
        }

        return $this->user()->can('create', Activity::class);
    }

    public function rules(): array
    {
        $rules = [
            'question'        => ['required', 'string', 'min:5', 'max:255'],
            'correct_answer'  => [
                'required',
                'string',
                'min:1',
                'max:100',
                function ($attribute, $value, $fail) {
                    if (is_array($this->wrong_answers)) {
                        foreach ($this->wrong_answers as $wrongAnswer) {
                            if ($value === $wrongAnswer) {
                                $fail('A resposta correta não pode ser igual a uma resposta incorreta.');
                                break;
                            }
                        }
                    }
                }
            ],
            'wrong_answers'   => ['required', 'array', 'size:3'],
            'wrong_answers.*' => ['required', 'string', 'min:1', 'max:100', 'distinct'],
        ];

        if ($this->method() === 'POST') {
            $rules['operation'] = ['required', Rule::enum(OperationType::class)];
        }

        return $rules;
    }

    public function validated($key = null, $default = null): mixed
    {
        $validated = parent::validated($key, $default);
        if ($key !== null) {
            return $validated;
        }

        $content = [
            'question'       => $validated['question'] ?? null,
            'correct_answer' => $validated['correct_answer'] ?? null,
            'wrong_answers'  => $validated['wrong_answers'] ?? null
        ];

        $fieldsToRemove = ['question', 'correct_answer', 'wrong_answers'];
        foreach ($fieldsToRemove as $field) {
            unset($validated[$field]);
        }

        $validated['type'] = 'multiple_choice';
        $validated['content'] = $content;

        return $validated;
    }
}
