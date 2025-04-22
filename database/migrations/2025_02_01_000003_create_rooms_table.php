<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();

            $table->string('name');
            $table->string('invite_code')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('room_module', function (Blueprint $table) {
            $table->foreignId('room_id')->constrained()->onDelete('restrict');
            $table->foreignId('module_id')->constrained()->onDelete('restrict');

            $table->integer('position');

            $table->unique(['room_id', 'module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_module');
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::dropIfExists('rooms');
    }
};
