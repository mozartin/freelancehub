<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasColumn('freelance_jobs', 'client_id')) {
            Schema::table('freelance_jobs', function (Blueprint $table) {
                $table->foreignId('client_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('users')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('freelance_jobs', 'client_id')) {
            Schema::table('freelance_jobs', function (Blueprint $table) {
                $table->dropConstrainedForeignId('client_id');
            });
        }
    }
};
