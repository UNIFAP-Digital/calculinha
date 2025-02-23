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
            'id'                 => $this->id,
            'name'               => $this->name,
            'participants_count' => $this->whenCounted('participants'),
            'invite_code'        => $this->invite_code,
            'is_active'          => $this->is_active,
            'created_at'         => $this->created_at,
        ];
    }
}
