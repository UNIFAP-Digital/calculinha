<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\Flow;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FlowActivityPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Flow $flow, Activity $activity): bool
    {
        if ($flow->owner_id === null && $activity->owner_id === null) {
            return true;
        }

        $flowOwnedByUser = $flow->owner_id === null || $flow->owner_id === $user->id;
        $activityOwnedByUser = $activity->owner_id === null || $activity->owner_id === $user->id;

        return $flowOwnedByUser && $activityOwnedByUser;
    }

    public function update(User $user, Flow $flow, Activity $activity): bool
    {
        return $flow->owner_id === $user->id && $flow->activities()->find($activity);
    }

    public function delete(User $user, Flow $flow): bool
    {
        return $flow->owner_id === $user->id;
    }
}
