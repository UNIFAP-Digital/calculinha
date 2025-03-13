<?php

namespace App\Http\Requests;

use App\Enums\Operation;
use App\Models\Module;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            /** @var Module $module */
            $module = $this->route('module');
            return $this->user()->can('update', $module);
        }

        return $this->user()->can('create', Module::class);
    }

    public function rules(): array
    {
        $isUpdate = $this->method() === 'PUT';
        $module = $this->route('module');
        $operation = $isUpdate ? $module->operation : $this->input('operation');
        $ownerId = Auth::user()->id;
        $uniqueRule = Rule::unique('modules', 'name')->where('owner_id', $ownerId);

        $rules = [
            'name'           => ['required', 'string', 'min:4', 'max:50'],
            'description'    => ['nullable', 'string', 'max:160'],
            'activity_ids'   => ['required', 'array', 'size:10'],
            'activity_ids.*' => [
                'required',
                'integer',
                Rule
                    ::exists('activities', 'id')
                    ->where('operation', $operation)
                    ->where(fn(Builder $query) => $query
                        ->where('owner_id', $ownerId)
                        ->orWhereNull('owner_id')
                    )],
        ];

        if ($isUpdate)
            $rules['name'][] = $uniqueRule->ignore($module);
        else {
            $rules['operation'] = ['required', Rule::enum(Operation::class)];
            $rules['name'][] = $uniqueRule;
        }

        return $rules;
    }
}
