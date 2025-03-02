<?php

namespace App\Http\Resources;

use App\Models\Activity;
use App\Models\FlowActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Activity */
class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'type'           => $this->content['type'],
            'question'       => $this->content['question'],
            'correct_answer' => $this->content['correct_answer'],
            'wrong_answers'  => $this->content['wrong_answers'],
            'position'       => $this->whenPivotLoaded(new FlowActivity, fn() => $this->pivot->position),
        ];
    }
}
