<?php

namespace App\Policies;

use App\Models\{Activity, User};

class ActivityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function create(User $user): bool
    {
        return $user->role === 'teacher';
    }

    public function update(User $user, Activity $activity): bool
    {
        return $user->role === 'teacher' && $user->id === $activity->owner_id;
    }

    public function delete(User $user, Activity $activity): bool
    {
        return $user->role === 'teacher' && $user->id === $activity->owner_id;
    }
}