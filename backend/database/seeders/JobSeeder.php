<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\User;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        // Get client users (or create one if none exist)
        $clients = User::where('role', 'client')->get();
        
        if ($clients->isEmpty()) {
            $this->command->warn('No client users found. Jobs will be created without client_id.');
        }
        
        // Create 15 jobs
        for ($i = 0; $i < 15; $i++) {
            $job = Job::factory()->make();
            
            // Assign a random client if available
            if ($clients->isNotEmpty()) {
                $job->client_id = $clients->random()->id;
            }
            
            $job->save();
        }
        
        $this->command->info('Created 15 jobs');
    }
}
