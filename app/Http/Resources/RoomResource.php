<?php

namespace App\Http\Resources;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Room
 */
class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'students_count' => $this->whenCounted('students'),
            'students'       => StudentResource::collection($this->whenLoaded('students')),
            'modules'        => ModuleResource::collection($this->whenLoaded('modules')),
            'invite_code'    => $this->invite_code,
            'is_active'      => $this->is_active,
            'created_at'     => $this->created_at->toIso8601ZuluString(),
            'updated_at'     => $this->updated_at->toIso8601ZuluString()
        ];
    }
}
