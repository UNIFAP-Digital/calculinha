<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\{Room, User};

class RoomPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === Role::Teacher;
    }

    public function create(User $user): bool
    {
        return $user->role === Role::Teacher;
    }

    public function update(User $user, Room $room): bool
    {
        return $user->role === Role::Teacher && $user->id === $room->owner_id;
    }

    public function delete(User $user, Room $room): bool
    {
        return $user->role === Role::Teacher && $user->id === $room->owner_id;
    }

    public function reorderModules(User $user, Room $room): bool
    {
        return $user->role === Role::Teacher && $user->id === $room->owner_id;
    }

    public function joinRoom(User $user, Room $room): bool
    {
        return $user->role === Role::Student;
    }
}
