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
        Schema::create('flows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->string('icon');
            $table->string('description')->nullable();
            $table->string('color');
            $table->integer('order');
            $table->timestamps();
        });

        Schema::create('flow_activity', function (Blueprint $table) {
            $table->foreignId('flow_id')->constrained()->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();

            $table->string('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flows');
        Schema::dropIfExists('flow_activity');
    }
};
