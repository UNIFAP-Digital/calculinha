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
use Inertia\Inertia;

class AttemptController extends Controller
{
    public function index(Room $room)
    {
        if (auth()->check()) {
            $student = null;
            $attempt = Attempt::fake($room);
        } else {
            $student = Student::findOrFail(session('student_id'));

//            Gate::authorize('createY', [Attempt::class, $student, $room]);

            $attempt = Attempt::current($room, $student);
            $attempt->load('modules.activities');
        }

        return Inertia::render('quiz/Index', [
            'attempt' => AttemptResource::make($attempt),
            'room'    => RoomResource::make($room),
            'student' => $student ? StudentResource::make($student) : null,
        ]);
    }

    public function show(Room $room, int $moduleId)
    {
        if (auth()->check()) {
            $module = Module::findOrFail($moduleId);
            $module->load('activities');

            $student = null;
        } else {
            $module = AttemptModule::findOrFail($moduleId);
            $student = Student::findOrFail(session('student_id'));

//            Gate::authorize('view', [Attempt::class, $student, $room]);

            $attempt = Attempt::current($room, $student);
            $module = $attempt->modules()->findOrFail($moduleId);

            $module->load('activities');
        }

        return Inertia::render('quiz/Show', [
            'room'    => RoomResource::make($room),
            'module'  => ModuleResource::make($module),
            'student' => $student ? StudentResource::make($student) : null,
        ]);
    }
}
