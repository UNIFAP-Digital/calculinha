<?php

namespace App\Http\Resources;

use App\Models\Activity;
use App\Models\AttemptModuleActivity;
use App\Models\ModuleActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Activity | AttemptModuleActivity
 */
class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id'             => $this->id,
            'type'           => $this->type,
            'operation'      => $this->operation,
            'question'       => $this->content['question'],
            'correct_answer' => $this->content['correct_answer'],
            'wrong_answers'  => $this->content['wrong_answers'],
            'created_at'     => $this->created_at->toIso8601ZuluString(),
            'updated_at'     => $this->whenNotNull($this->updated_at?->toIso8601ZuluString()),
        ];

        if ($this->resource instanceof AttemptModuleActivity) {
            $data['answer'] = $this->answer;
            $data['is_correct'] = $this->is_correct;
            $data['order'] = $this->order;
        } else {
            $data['order'] = $this->whenPivotLoaded(new ModuleActivity, fn() => $this->pivot->position);
        }

        return $data;
    }
}
