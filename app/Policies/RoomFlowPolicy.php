<?php

namespace App\Policies;

use App\Models\Flow;
use App\Models\Room;
use App\Models\RoomFlow;
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

    public function update(User $user, RoomFlow $roomFlow): bool
    {
        return $roomFlow->room->owner_id === $user->id;
    }

    public function delete(User $user, RoomFlow $roomFlow): bool
    {
        return $roomFlow->room->owner_id === $user->id;
    }
}
