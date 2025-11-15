<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_id')
                ->constrained('freelance_jobs')
                ->cascadeOnDelete();

            $table->foreignId('freelancer_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('cover_letter');
            $table->integer('proposed_budget')->nullable(); // e.g. fixed price
            $table->integer('estimated_days')->nullable();

            $table->enum('status', ['sent', 'accepted', 'rejected'])
                ->default('sent');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
