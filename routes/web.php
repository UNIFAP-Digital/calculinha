<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\FlowActivityController;
use App\Http\Controllers\FlowController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome');

Route::controller(GameController::class)->middleware('room.access')->prefix('/salas/{room}/quiz')->group(function () {
    Route::get('/', 'index')->name('quiz.index');
    Route::get('/{flow}', 'play')->name('quiz.game');
    Route::post('/result', 'result')->name('quiz.result');
});

Route::middleware('auth')->group(function () {
    Route::controller(ActivityController::class)->prefix('/atividades')->group(function () {
        Route::get('/', 'index')->name('activities.index');
        Route::post('/', 'store')->name('activities.store');
        Route::put('/{activity}', 'update')->name('activities.update');
        Route::delete('/{activity}', 'destroy')->name('activities.destroy');
    });

    Route::controller(FlowController::class)->prefix('/trilhas')->group(function () {
        Route::get('/', 'index')->name('flows.index');
        Route::post('/', 'store')->name('flows.store');
        Route::put('/{flow}', 'update')->name('flows.update');
        Route::delete('/{flow}', 'destroy')->name('flows.destroy');
        Route::post('/{flow}/move-up', 'moveUp')->name('flows.move-up');
        Route::post('/{flow}/move-down', 'moveDown')->name('flows.move-down');

        Route::controller(FlowActivityController::class)->prefix('/{flow}/activities')->group(function () {
            Route::post('/', 'store')->name('flow.activities.store');
            Route::delete('/{flowActivity}', 'destroy')->name('flow.activities.destroy');
            Route::post('/{flowActivity}/move-up', 'moveUp')->name('flow.activities.move-up');
            Route::post('/{flowActivity}/move-down', 'moveDown')->name('flow.activities.move-down');
        });
    });

    Route::controller(RoomController::class)->prefix('/salas')->group(function () {
        Route::get('/{room?}', 'index')->name('rooms.index');
        Route::post('/', 'store')->name('rooms.store');
        Route::put('/{room}', 'update')->name('rooms.update');
        Route::delete('/{room}', 'destroy')->name('rooms.destroy');
    });
})->scopeBindings();

require __DIR__ . '/auth.php';
