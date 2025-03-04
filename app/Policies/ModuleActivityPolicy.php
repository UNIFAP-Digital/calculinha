<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\Module;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ModuleActivityPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Module $module, Activity $activity): bool
    {
        if ($module->owner_id === null && $activity->owner_id === null) {
            return true;
        }

        $moduleOwnedByUser = $module->owner_id === null || $module->owner_id === $user->id;
        $activityOwnedByUser = $activity->owner_id === null || $activity->owner_id === $user->id;

        return $moduleOwnedByUser && $activityOwnedByUser;
    }

    public function update(User $user, Module $module, Activity $activity): bool
    {
        return $module->owner_id === $user->id && $module->activities()->find($activity->id);
    }

    public function delete(User $user, Module $module): bool
    {
        return $module->owner_id === $user->id;
    }
}
