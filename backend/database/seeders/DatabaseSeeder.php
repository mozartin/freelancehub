<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Job;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        try {
            $userCount = User::count();
            $jobCount = Job::count();
            
            $this->command->info("Current database state: $userCount users, $jobCount jobs");
            
            // Only seed if database is empty
            if ($userCount === 0 && $jobCount === 0) {
                $this->command->info('Database is empty. Starting seeders...');
                $this->call([
                    UserSeeder::class,
                    JobSeeder::class
                ]);
                
                $newUserCount = User::count();
                $newJobCount = Job::count();
                $this->command->info("Database seeded successfully! Created $newUserCount users and $newJobCount jobs.");
            } else {
                $this->command->info('Database already has data. Skipping seeders.');
            }
        } catch (\Exception $e) {
            $this->command->error('Seeder failed: ' . $e->getMessage());
            $this->command->error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

}
