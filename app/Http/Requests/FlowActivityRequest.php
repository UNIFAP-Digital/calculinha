<?php

namespace App\Http\Requests;

use App\Models\Flow;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @property mixed $room_id
 */
class FlowActivityRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'flow_id'     => ['required', 'exists:flows,id'],
            'activity_id' => ['required', 'exists:activities,id'],
        ];
    }

    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            $flowActivity = $this->route('flowActivity');
            return $this->user()->can('update', $flowActivity);
        }

        $roomId = $this->route('room');
        return $this->user()->can('create', [Flow::class, $roomId]);
    }
}
