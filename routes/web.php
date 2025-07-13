<?php


use App\Http\Controllers\{
    ActivityController,
    Auth\LoginController,
    ModuleController,
    QuizPlayController,
    RoomController,
};

/* -------------------------------------------------
 |  GUEST
 * -------------------------------------------------*/
Route::inertia('/', 'Welcome')->name('welcome');

/* -------------------------------------------------
 |  AUTH
 * -------------------------------------------------*/
Route::middleware('guest')->group(function () {
    Route::inertia('/login/student',  'Auth/StudentLogin')->name('login.student');
    Route::inertia('/login/teacher',  'Auth/TeacherLogin')->name('login.teacher');
    Route::post('/login/student', [LoginController::class, 'student']);
    Route::post('/login/teacher', [LoginController::class, 'teacher']);
});

/* -------------------------------------------------
 |  STUDENT
 * -------------------------------------------------*/
Route::prefix('student')->middleware(['auth:sanctum', 'can:student-only'])->group(function () {
    Route::inertia('/dashboard', 'Student/Dashboard')->name('student.dashboard');
    Route::post('/join', [QuizPlayController::class, 'join'])->name('student.join');
    Route::get('/room/{room}', [QuizPlayController::class, 'status'])->name('student.room');
    Route::post('/answer', [QuizPlayController::class, 'answer'])->name('student.answer');
    Route::post('/retry/{module}', [QuizPlayController::class, 'retryModule'])->name('student.retry');
});

/* -------------------------------------------------
 |  TEACHER
 * -------------------------------------------------*/
Route::prefix('teacher')->middleware(['auth:sanctum', 'can:teacher-only'])->group(function () {
    Route::inertia('/dashboard', 'Teacher/Dashboard')->name('teacher.dashboard');

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
