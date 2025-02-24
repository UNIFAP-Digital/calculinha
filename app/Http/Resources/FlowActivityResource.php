<?php

namespace App\Http\Resources;

use App\Models\Activity;
use App\Models\FlowActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FlowActivity */
class FlowActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'flow_id'     => $this->flow_id,
            'activity_id' => $this->activity_id,
            'position'    => $this->position,
            'activity'    => new ActivityResource($this->whenLoaded('activity')),
        ];
    }
}
