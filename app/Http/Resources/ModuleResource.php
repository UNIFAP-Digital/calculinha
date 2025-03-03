<?php

namespace App\Http\Resources;

use App\Models\Module;
use App\Models\RoomModule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Module */
class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'icon'             => $this->icon,
            'description'      => $this->description,
            'color'            => $this->color,
            'position'         => $this->whenPivotLoaded(new RoomModule, fn() => $this->pivot->position),
            'activities_count' => $this->whenCounted('activities'),
            'activities'       => ActivityResource::collection($this->whenLoaded('activities')),
        ];
    }
}
