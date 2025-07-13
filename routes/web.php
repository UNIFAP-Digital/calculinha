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
 |  GUEST
 * -------------------------------------------------*/
Route::inertia('/', 'welcome')->name('welcome');

/* -------------------------------------------------
 |  AUTH
 * -------------------------------------------------*/
Route::middleware('guest')->group(function () {
    Route::inertia('/login/student', 'auth/student-login')->name('login.student');
    Route::inertia('/login/teacher', 'auth/teacher-login')->name('login.teacher');
    Route::post('/login/student', [LoginController::class, 'student']);
    Route::post('/login/teacher', [LoginController::class, 'teacher']);
    Route::inertia('/register/student', 'auth/student-register')->name('register.student');
    Route::inertia('/register/teacher', 'auth/teacher-register')->name('register.teacher');
    Route::post('/register/student', [RegisterUserController::class, 'student']);
    Route::post('/register/teacher', [RegisterUserController::class, 'teacher']);
});

/* -------------------------------------------------
 |  STUDENTS
 * -------------------------------------------------*/
Route::prefix('student')->middleware(['auth:sanctum', 'can:student-only'])->group(function () {
    Route::inertia('/dashboard', 'student/dashboard')->name('student.dashboard');
    Route::post('/join', [QuizPlayController::class, 'join'])->name('student.join');
    Route::get('/room/{room}', [QuizPlayController::class, 'status'])->name('student.room');
    Route::post('/answer', [QuizPlayController::class, 'answer'])->name('student.answer');
    Route::post('/retry/{module}', [QuizPlayController::class, 'retryModule'])->name('student.retry');
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
