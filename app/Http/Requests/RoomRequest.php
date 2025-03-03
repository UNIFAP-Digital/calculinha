<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            /** @var Room $room */
            $room = $this->route('room');
            return $this->user()->can('update', $room);
        }

        return $this->user()->can('create', Room::class);
    }

    public function rules(): array
    {
        $isUpdate = $this->method() === 'PUT';
        $ownerId = Auth::user()->id;
        $room = $this->route('room');
        $uniqueRule = Rule::unique('rooms', 'name')->where('owner_id', $ownerId);

        $rules = [
            'name'       => ['required', 'string', 'min:3', 'max:50'],
            'module_ids'   => ['required', 'array', 'size:4'],
            'module_ids.*' => [
                'required',
                'integer',
                Rule
                    ::exists('modules', 'id')
                    ->where(fn(Builder $query) => $query
                        ->where('owner_id', $ownerId)
                        ->orWhereNull('owner_id')
                    )],
        ];

        if ($isUpdate) $rules['name'][] = $uniqueRule->ignore($room);
        else $rules['name'][] = $uniqueRule;

        return $rules;
    }
}
