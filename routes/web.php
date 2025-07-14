<?php

use App\Http\Controllers\{
    ActivityController,
    Auth\LoginController,
    ModuleController,
    QuizPlayController,
    RoomController,
};
use App\Http\Controllers\Auth\RegisterUserController;
use Illuminate\Support\Facades\Route;

/* -------------------------------------------------
 |  ROOT - Redirect based on role
 * -------------------------------------------------*/
Route::get('/', function () {
    if (auth()->check()) {
        return match(auth()->user()->role->value) {
            'student' => redirect()->route('student.dashboard'),
            'teacher' => redirect()->route('teacher.dashboard'),
            default => redirect()->route('welcome'),
        };
    }

    return inertia('welcome');
})->name('welcome');

/* -------------------------------------------------
 |  AUTH
 * -------------------------------------------------*/
Route::middleware('guest')->group(function () {
    Route::inertia('/login/student', 'auth/student-login')->name('student.login');
    Route::inertia('/login/teacher', 'auth/teacher-login')->name('teacher.login');
    Route::post('/login/student', [LoginController::class, 'student'])->name('student.login.post');
    Route::post('/login/teacher', [LoginController::class, 'teacher'])->name('teacher.login.post');
    Route::inertia('/register/student', 'auth/student-register')->name('student.register');
    Route::inertia('/register/teacher', 'auth/teacher-register')->name('teacher.register');
    Route::post('/register/student', [RegisterUserController::class, 'student'])->name('student.register.post');
    Route::post('/register/teacher', [RegisterUserController::class, 'teacher'])->name('teacher.register.post');
});

/* -------------------------------------------------
 |  STUDENTS
 * -------------------------------------------------*/
Route::prefix('student')->middleware(['auth:sanctum', 'can:student-only'])->group(function () {
    Route::get('/dashboard', [QuizPlayController::class, 'dashboard'])->name('student.dashboard');
    Route::post('/join', [QuizPlayController::class, 'join'])->name('student.join');
    Route::get('/room/{room}', [QuizPlayController::class, 'status'])->name('student.room');
    Route::post('/answer', [QuizPlayController::class, 'answer'])->name('student.answer');
    Route::post('/retry/{module}', [QuizPlayController::class, 'retryModule'])->name('student.retry');
    Route::get('/student/room/{room}/module/{module}', [QuizPlayController::class, 'show'])
    ->name('quiz.show');
});

/* -------------------------------------------------
 |  TEACHER
 * -------------------------------------------------*/
Route::prefix('teacher')->middleware(['auth:sanctum', 'can:teacher-only'])->group(function () {
    Route::inertia('/dashboard', 'teacher/dashboard')->name('teacher.dashboard');

    /* Rooms */
    Route::resource('rooms', RoomController::class)->except(['show']);
    Route::put('rooms/{room}/reorder-modules', [RoomController::class, 'reorderModules'])
         ->name('rooms.reorder-modules');

    /* Modules */
    Route::resource('modules', ModuleController::class)->except(['show']);
    Route::put('modules/{module}/reorder-activities', [ModuleController::class, 'reorderActivities'])
         ->name('modules.reorder-activities');

    /* Activities */
    Route::resource('activities', ActivityController::class)->except(['show']);
});

require __DIR__ . '/auth.php';
