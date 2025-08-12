<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\ModuleActivityController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomModuleController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\QuizCompletionController;

Route::inertia('/', 'Welcome')->name('index');

Route::middleware('auth:student')->group(function () {
    Route::get('/student/dashboard', function () {
        $student = Auth::user();

        $lastAttempt = $student->attempts()->latest()->first();

        if ($lastAttempt) {
            return redirect()->route('quiz.index', ['room' => $lastAttempt->room_id]);
        }

        return redirect()->route('index');

    })->name('student.dashboard');
    
    Route::post('/quiz/complete', [QuizCompletionController::class, 'store'])->name('quiz.complete');

    Route::controller(AttemptController::class)
        ->name('quiz.')
        ->prefix('/salas/{room}/quiz')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{module}', 'show')->name('show');
        });
});

Route::middleware('auth')->group(function () {
    Route::controller(ActivityController::class)
        ->name('activities.')
        ->prefix('/atividades')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/{activity}', 'update')->name('update');
            Route::delete('/{activity}', 'destroy')->name('destroy');
        });

    Route::controller(ModuleController::class)
        ->name('modules.')
        ->prefix('/trilhas')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{module}', 'show')->name('show');
            Route::get('/{module}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{module}', 'update')->name('update');
            Route::delete('/{module}', 'destroy')->name('destroy');

            Route::controller(ModuleActivityController::class)
                ->name('activities.')
                ->prefix('/{module}/atividades')
                ->group(function () {
                    Route::post('/{activity}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{activity}/move-down', 'moveDown')->name('move-down');
                });
        });

    Route::controller(RoomController::class)
        ->name('rooms.')
        ->prefix('/salas')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{room}', 'show')->name('show');
            Route::get('/{room}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{room}', 'update')->name('update');
            Route::delete('/{room}', 'destroy')->name('destroy');

            Route::controller(RoomModuleController::class)
                ->prefix('/{room}/trilhas')
                ->name('modules.')
                ->group(function () {
                    Route::post('/{module}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{module}/move-down', 'moveDown')->name('move-down');
                });
        });
})->scopeBindings();

require __DIR__ . '/auth.php'; 
