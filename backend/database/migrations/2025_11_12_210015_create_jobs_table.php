<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('freelance_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('skills')->nullable();
            $table->enum('budget_type', ['fixed', 'hourly'])->default('fixed');
            $table->integer('budget_min')->nullable();
            $table->integer('budget_max')->nullable();
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('freelance_jobs');
    }
};
