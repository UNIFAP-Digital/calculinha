<?php

namespace App\Http\Resources;

use App\Models\RoomFlow;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin RoomFlow */
class RoomFlowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->flow->name,
            'icon'        => $this->flow->icon,
            'description' => $this->flow->description,
            'color'       => $this->flow->color,
            'position'    => $this->position,
            'activities'  => FlowActivityResource::collection($this->flow->flowActivities),
        ];
    }
}
