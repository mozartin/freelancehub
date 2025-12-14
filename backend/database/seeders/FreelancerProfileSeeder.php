<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\FreelancerProfile;

class FreelancerProfileSeeder extends Seeder
{
    public function run(): void
    {
        // Use existing freelancer users; if none exist, create a few.
        $freelancers = User::where('role', 'freelancer')->get();

        if ($freelancers->isEmpty()) {
            $freelancers = User::factory()->count(5)->create(['role' => 'freelancer']);
            $this->command->warn('No freelancer users found. Created 5 freelancers.');
        }

        foreach ($freelancers as $user) {
            FreelancerProfile::factory()->create(['user_id' => $user->id]);
        }

        $this->command->info('Created freelancer profiles for freelancer users.');
    }
}

