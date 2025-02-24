<?php

namespace App\Http\Requests;

use App\Models\Flow;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property mixed $room_id
 */
class FlowRequest extends FormRequest
{
    public function rules(): array
    {
        $isUpdate = $this->method() === 'PUT';
        $flow = $this->route('flow');

        $rules = [
            'name'        => ['required', 'string', 'min:4', 'max:50'],
            'description' => ['nullable', 'string', 'max:160'],
            'icon'        => ['required', 'string', 'max:8'],
            'color'       => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/']
        ];

        if ($isUpdate) {
            $rules['name'][] = Rule::unique('flows', 'name')
                ->where('room_id', $flow->room_id)
                ->ignore($flow->id);
        } else {
            $rules['room_id'] = ['required', 'exists:rooms,id'];
            $rules['name'][] = Rule::unique('flows', 'name')
                ->where('room_id', $this->room_id);
        }

        return $rules;
    }

    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            $flow = $this->route('flow');
            return $this->user()->can('update', $flow);
        }

        $roomId = $this->room_id;
        return $this->user()->can('create', [Flow::class, $roomId]);
    }
}
