<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttemptResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\RoomResource;
use App\Http\Resources\StudentResource;
use App\Models\Attempt;
use App\Models\AttemptModule;
use App\Models\Module;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AttemptController extends Controller
{
    public function index(Room $room)
    {
        Gate::authorize('create', [Attempt::class, $room]);
        $user = Auth::user();

        if ($user instanceof Student) {
            $attempt = Attempt::current($room, $user);
            $attempt->load([
                'modules' =>
                    fn($query) => $query->withCount([
                        'activities',
                        'activities as activities_completed' => fn($query) => $query->whereNotNull('is_correct')
                    ])
            ]);
        } else {
            $attempt = Attempt::fake($room);

        }

        return Inertia::render('quiz/Index', [
            'attempt' => AttemptResource::make($attempt),
            'room'    => RoomResource::make($room),
            'student' => $user instanceof Student ? StudentResource::make($user) : null,
        ]);
    }

    public function show(Room $room, int $moduleId)
    {
        Gate::authorize('view', [Attempt::class, $room]);
        $user = Auth::user();

        if ($user instanceof Student) {
            $module = AttemptModule::findOrFail($moduleId);
            $attempt = Attempt::current($room, $user);
            $attempt->modules()->findOrFail($module->id);
        } else {
            $module = Module::findOrFail($moduleId);
        }

        $module->load('activities');

        return Inertia::render('quiz/Show', [
            'room'    => RoomResource::make($room),
            'module'  => ModuleResource::make($module),
            'student' => $user instanceof Student ? StudentResource::make($user) : null
        ]);
    }
}
