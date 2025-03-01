<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\Flow;
use App\Models\FlowActivity;
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

    public function update(User $user, FlowActivity $flowActivity): bool
    {
        return $flowActivity->flow->owner_id === $user->id;
    }

    public function delete(User $user, FlowActivity $flowActivity): bool
    {
        return $flowActivity->flow->owner_id === $user->id;
    }
}
