<?php

namespace App\Http\Requests;

use App\Models\Activity;
use App\Models\FlowActivity;
use Illuminate\Foundation\Http\FormRequest;

class FlowActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $flow = $this->route('flow');
        $activityIds = $this->input('activity_ids', []);
        if (empty($activityIds)) return false;

        $activities = Activity::findOrFail($activityIds);

        foreach ($activities as $activity) {
            if (!$this->user()->can('create', [FlowActivity::class, $flow, $activity])) {
                return false;
            }
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'activity_ids'   => 'required|array',
            'activity_ids.*' => 'required|integer',
        ];
    }
}
