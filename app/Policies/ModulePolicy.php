<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\Room;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ModulePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, ?Room $room = null): bool
    {
        return !$room || $user->can('view', $room);
    }

    public function view(User $user, Module $module): bool
    {
        return $module->owner_id === $user->id;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Module $module): bool
    {
        return $module->owner_id === $user->id;
    }

    public function delete(User $user, Module $module): bool
    {
        return $module->owner_id === $user->id;
    }
}
