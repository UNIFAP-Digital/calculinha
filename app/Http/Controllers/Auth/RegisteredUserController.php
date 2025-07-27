<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Module;
use App\Models\ModuleActivity;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::min(3)],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Copy default activities and modules for the new user
        $this->copyDefaultActivitiesAndModules($user);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('rooms.index', absolute: false));
    }

    /**
     * Copy all default activities and modules (with owner_id = null) for the new user
     */
    private function copyDefaultActivitiesAndModules(User $user): void
    {
        DB::transaction(function () use ($user) {
            // Get all default activities (owner_id = null)
            $defaultActivities = Activity::whereNull('owner_id')->get();

            // Create a mapping from old activity IDs to new activity IDs
            $activityIdMapping = [];

            // Copy activities
            foreach ($defaultActivities as $defaultActivity) {
                $newActivity = Activity::create([
                    'type' => $defaultActivity->type,
                    'operation' => $defaultActivity->operation,
                    'content' => $defaultActivity->content,
                    'owner_id' => $user->id,
                ]);

                $activityIdMapping[$defaultActivity->id] = $newActivity->id;
            }

            // Get all default modules (owner_id = null) with their activities
            $defaultModules = Module::whereNull('owner_id')
                ->with(['activities' => function ($query) {
                    $query->withPivot('position');
                }])
                ->get();

            // Copy modules and their activity relationships
            foreach ($defaultModules as $defaultModule) {
                $newModule = Module::create([
                    'name' => $defaultModule->name,
                    'description' => $defaultModule->description,
                    'operation' => $defaultModule->operation,
                    'type' => $defaultModule->type,
                    'owner_id' => $user->id,
                ]);

                // Copy module-activity relationships with positions
                $moduleActivities = [];
                foreach ($defaultModule->activities as $activity) {
                    if (isset($activityIdMapping[$activity->id])) {
                        $moduleActivities[$activityIdMapping[$activity->id]] = [
                            'position' => $activity->pivot->position
                        ];
                    }
                }

                if (!empty($moduleActivities)) {
                    $newModule->activities()->attach($moduleActivities);
                }
            }
        });
    }
}
