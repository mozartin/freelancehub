<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')
                ->default('client')
                ->after('email'); // client | freelancer | admin

            $table->string('avatar_url')->nullable()->after('role');
            $table->string('location')->nullable()->after('avatar_url');
            $table->text('bio')->nullable()->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar_url', 'location', 'bio']);
        });
    }
};
