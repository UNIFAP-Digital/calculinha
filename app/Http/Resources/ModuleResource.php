<?php

namespace App\Http\Resources;

use App\Models\AttemptModule;
use App\Models\Module;
use App\Models\RoomModule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Module | AttemptModule */
class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id'                   => $this->id,
            'name'                 => $this->name,
            'description'          => $this->description,
            'operation'            => $this->operation,
            'type'                 => $this->type,
            'activities_count'     => $this->whenCounted('activities'),
            'activities_completed' => $this->whenHas('activities_completed'),
            'activities'           => ActivityResource::collection($this->whenLoaded('activities')),
            'created_at'           => $this->created_at->toIso8601ZuluString(),
            'updated_at'           => $this->updated_at->toIso8601ZuluString()
        ];

        if ($this->resource->hasAttribute('status')) {
            $data['status'] = $this->status;
        }

        if ($this->resource instanceof AttemptModule) {
            $data['order'] = $this->order;

            $data['score'] = $this->score;

            if ($this->relationLoaded('activities')) {
                $data['stats'] = [
                    'hits'     => $this->activities->where('is_correct', true)->whereNotNull('is_correct')->count(),
                    'mistakes' => $this->activities->where('is_correct', false)->whereNotNull('is_correct')->count(),
                    'total'    => $this->activities->count(),
                ];
            }
        } else {
            $data['order'] = $this->whenPivotLoaded(new RoomModule(), fn () => $this->pivot->position);
        }

        return $data;
    }
}
