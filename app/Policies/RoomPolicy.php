<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RoomPolicy
{
    use HandlesAuthorization;

    public function create(): bool
    {
        return true;
    }

    public function viewAny(): bool
    {
        return true;
    }

    public function view(User $user, Room $room): bool
    {
        return $room->owner_id === $user->id;
    }

    public function update(User $user, Room $room): bool
    {
        return $room->owner_id === $user->id;
    }

    public function delete(User $user, Room $room): bool
    {
        return $room->owner_id === $user->id;
    }
}
