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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->string('name');
            $table->string('description')->nullable();
            $table->enum('operation', ['addition', 'subtraction', 'multiplication', 'division']);
            $table->enum('type', ['pre-test', 'exercise','post-test']);

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('module_activity', function (Blueprint $table) {
            $table->foreignId('module_id')->constrained()->onDelete('restrict');
            $table->foreignId('activity_id')->constrained()->onDelete('restrict');

            $table->float('position');

            $table->unique(['module_id', 'activity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_activity');
        Schema::table('modules', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::dropIfExists('modules');
    }
};
