<?php

namespace App\Http\Requests;

use App\Models\Activity;
use App\Models\FlowActivity;
use Illuminate\Foundation\Http\FormRequest;

class FlowActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->method() === 'PUT') {
            /** @var FlowActivity $flowActivity */
            $flowActivity = $this->route('flowActivity');
            return $this->user()->can('update', $flowActivity);
        }

        $flow = $this->route('flow');
        $activity = Activity::findOrFail($this->input('activity_id'));
        return $this->user()->can('create', [FlowActivity::class, $flow, $activity]);
    }

    public function rules(): array
    {
        return [
            'activity_id' => 'required',
        ];
    }
}
