<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\FlowActivityController;
use App\Http\Controllers\FlowController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomFlowController;
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

    Route
        ::controller(FlowController::class)
        ->name('flows.')
        ->prefix('/trilhas')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{flow}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{flow}', 'update')->name('update');
            Route::delete('/{flow}', 'destroy')->name('destroy');

            Route
                ::controller(FlowActivityController::class)
                ->name('activities.')
                ->prefix('/{flow}/atividades')
                ->group(function () {
                    Route::post('/{activity}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{activity}/move-down', 'moveDown')->name('move-down');
                });
        });

    Route
        ::controller(RoomController::class)
        ->name('rooms.')
        ->prefix('/salas')
        ->group(function () {
            Route::get('/adicionar', 'create')->name('create');
            Route::get('/{room?}', 'index')->name('index');
            Route::get('/{room}/editar', 'edit')->name('edit');
            Route::post('/', 'store')->name('store');
            Route::put('/{room}', 'update')->name('update');
            Route::delete('/{room}', 'destroy')->name('destroy');

            Route
                ::controller(RoomFlowController::class)
                ->prefix('/{room}/trilhas')
                ->name('flows.')
                ->group(function () {
                    Route::post('/{flow}/move-up', 'moveUp')->name('move-up');
                    Route::post('/{flow}/move-down', 'moveDown')->name('move-down');
                });
        });
})->scopeBindings();

require __DIR__ . '/auth.php';
