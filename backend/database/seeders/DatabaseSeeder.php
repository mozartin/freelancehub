<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Job;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if database is empty
        if (User::count() === 0 && Job::count() === 0) {
            $this->call([
                UserSeeder::class,
                JobSeeder::class
            ]);
            $this->command->info('Database seeded successfully!');
        } else {
            $this->command->info('Database already has data. Skipping seeders.');
        }
    }

}
