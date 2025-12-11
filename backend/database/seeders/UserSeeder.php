<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10 clients
        User::factory()->count(10)->create(['role' => 'client']);
        
        // Create 10 freelancers
        User::factory()->count(10)->create(['role' => 'freelancer']);
        
        $this->command->info('Created 10 clients and 10 freelancers');
    }
}
