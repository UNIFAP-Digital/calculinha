<?php

namespace App\Http\Resources;

use App\Models\FlowActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FlowActivity */
class FlowActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'position'       => $this->position,
            'type'           => $this->activity->content['type'],
            'question'       => $this->activity->content['question'],
            'correct_answer' => $this->activity->content['correct_answer'],
            'wrong_answers'  => $this->activity->content['wrong_answers']
        ];
    }
}
