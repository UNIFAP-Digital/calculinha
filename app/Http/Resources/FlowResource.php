<?php

namespace App\Http\Resources;

use App\Models\Flow;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Flow */
class FlowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'icon'                  => $this->icon,
            'description'           => $this->description,
            'color'                 => $this->color,
            'position'              => $this->position,
            'flow_activities_count' => $this->whenCounted('flowActivities'),
            'flow_activities'       => FlowActivityResource::collection($this->whenLoaded('flowActivities')),
            'room_id'               => $this->room_id
        ];
    }
}
