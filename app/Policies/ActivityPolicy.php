<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\Flow;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ActivityPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, ?Flow $flow = null): bool
    {
        return !$flow || $user->can('view', $flow);
    }

    public function view(User $user, Activity $activity): bool
    {
        return $activity->owner_id === $user->id || $activity->owner_id === null;
    }

    public function create(): bool
    {
        return true;
    }

    public function update(User $user, Activity $activity): bool
    {
        return $activity->owner_id === $user->id;
    }

    public function delete(User $user, Activity $activity): bool
    {
        return $activity->owner_id === $user->id;
    }
}
