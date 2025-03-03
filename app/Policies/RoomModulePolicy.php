<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RoomModulePolicy
{
    use HandlesAuthorization;

    public function create(User $user, Room $room, Module $module): bool
    {
        if ($room->owner_id === null && $module->owner_id === null) {
            return true;
        }

        $roomOwnedByUser = $room->owner_id === null || $room->owner_id === $user->id;
        $moduleOwnedByUser = $module->owner_id === null || $module->owner_id === $user->id;

        return $roomOwnedByUser && $moduleOwnedByUser;
    }

    public function update(User $user, Room $room, Module $module): bool
    {
        return $room->owner_id === $user->id && $room->modules()->find($module);
    }

    public function delete(User $user, Room $room): bool
    {
        return $room->owner_id === $user->id;
    }
}
