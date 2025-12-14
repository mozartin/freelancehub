<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Job;
use App\Models\FreelancerProfile;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        try {
            $userCount = User::count();
            $jobCount = Job::count();
            $freelancerProfileCount = FreelancerProfile::count();
            
            $this->command->info("Current database state: $userCount users, $jobCount jobs, $freelancerProfileCount freelancer profiles");
            
            // Only seed everything if database is empty
            if ($userCount === 0 && $jobCount === 0 && $freelancerProfileCount === 0) {
                $this->command->info('Database is empty. Starting seeders...');
                $this->call([
                    UserSeeder::class,
                    JobSeeder::class,
                    FreelancerProfileSeeder::class,
                ]);
                
                $newUserCount = User::count();
                $newJobCount = Job::count();
                $newProfileCount = FreelancerProfile::count();
                $this->command->info("Database seeded successfully! Created $newUserCount users, $newJobCount jobs, $newProfileCount freelancer profiles.");
            } else {
                // If profiles are missing but users exist, seed profiles only
                if ($freelancerProfileCount === 0) {
                    $this->command->info('No freelancer profiles found. Seeding profiles...');
                    $this->call([
                        FreelancerProfileSeeder::class,
                    ]);
                } else {
                    $this->command->info('Database already has data. Skipping seeders.');
                }
            }
        } catch (\Exception $e) {
            $this->command->error('Seeder failed: ' . $e->getMessage());
            $this->command->error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

}
