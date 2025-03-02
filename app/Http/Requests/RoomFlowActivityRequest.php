<?php

namespace App\Http\Requests;

use App\Models\Flow;
use App\Models\RoomFlow;
use Illuminate\Foundation\Http\FormRequest;

class RoomFlowActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $room = $this->route('room');
        $flowIds = $this->input('flow_ids', []);
        if (empty($flowIds)) return false;

        $flows = Flow::findOrFail($flowIds);

        foreach ($flows as $flow) {
            if (!$this->user()->can('create', [RoomFlow::class, $room, $flow])) {
                return false;
            }
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'flow_ids'   => 'required|array',
            'flow_ids.*' => 'required|integer',
        ];
    }
}
