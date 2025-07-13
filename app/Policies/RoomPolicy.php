<?php

namespace App\Policies;

use App\Models\{Room, User};

class RoomPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function create(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function update(User $user, Room $room): bool
    {
        return $user->role === 'teacher' && $user->id === $room->owner_id;
    }

    public function delete(User $user, Room $room): bool
    {
        return $user->role === 'teacher' && $user->id === $room->owner_id;
    }

    public function reorderModules(User $user, Room $room): bool
    {
        return $user->role === 'teacher' && $user->id === $room->owner_id;
    }
}