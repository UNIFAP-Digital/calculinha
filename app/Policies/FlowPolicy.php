<?php

namespace App\Policies;

use App\Models\Flow;
use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlowPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, int $roomId): bool
    {
        $room = Room::findOrFail($roomId);
        return $user->id === $room->owner_id;
    }

    public function view(User $user, Flow $flow): bool
    {
        return $flow->room->owner_id === $user->id;
    }

    public function create(User $user, int $roomId): bool
    {
         $room = Room::findOrFail($roomId);
        return $user->id === $room->owner_id;
    }

    public function update(User $user, Flow $flow): bool
    {
        return $flow->room->owner_id === $user->id;
    }

    public function delete(User $user, Flow $flow): bool
    {
        return $flow->room->owner_id === $user->id;
    }
}
