<?php

namespace App\Http\Requests;

use App\Models\Flow;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FlowRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            /** @var Flow $flow */
            $flow = $this->route('flow');
            return $this->user()->can('update', $flow);
        }

        return $this->user()->can('create', Flow::class);
    }

    public function rules(): array
    {
        $isUpdate = $this->method() === 'PUT';
        $flow = $this->route('flow');
        $ownerId = Auth::user()->id;
        $uniqueRule = Rule::unique('flows', 'name')->where('owner_id', $ownerId);

        $rules = [
            'name'           => ['required', 'string', 'min:4', 'max:50'],
            'description'    => ['nullable', 'string', 'max:160'],
            'icon'           => ['required', 'string', 'max:8'],
            'color'          => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6})$/'],
            'activity_ids'   => ['required', 'array', 'size:10'],
            'activity_ids.*' => [
                'required',
                'integer',
                Rule
                    ::exists('activities', 'id')
                    ->where(fn(Builder $query) => $query
                        ->where('owner_id', $ownerId)
                        ->orWhereNull('owner_id')
                    )],
        ];

        if ($isUpdate) $rules['name'][] = $uniqueRule->ignore($flow);
        else $rules['name'][] = $uniqueRule;

        return $rules;
    }
}
