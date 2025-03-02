<?php

namespace App\Policies;

use App\Models\Flow;
use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RoomFlowPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Room $room, Flow $flow): bool
    {
        if ($room->owner_id === null && $flow->owner_id === null) {
            return true;
        }

        $roomOwnedByUser = $room->owner_id === null || $room->owner_id === $user->id;
        $flowOwnedByUser = $flow->owner_id === null || $flow->owner_id === $user->id;

        return $roomOwnedByUser && $flowOwnedByUser;
    }

    public function update(User $user, Room $room, Flow $flow): bool
    {
        return $room->owner_id === $user->id && $room->flows()->find($flow);
    }

    public function delete(User $user, Room $room): bool
    {
        return $room->owner_id === $user->id;
    }
}
