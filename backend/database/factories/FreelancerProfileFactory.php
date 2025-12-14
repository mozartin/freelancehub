<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FreelancerProfileFactory extends Factory
{
    public function definition(): array
    {
        $skillsPool = [
            'React',
            'Laravel',
            'Node.js',
            'TypeScript',
            'Tailwind',
            'PostgreSQL',
            'MySQL',
            'AWS',
            'Docker',
            'GraphQL',
        ];

        $skills = collect($this->faker->randomElements($skillsPool, rand(3, 6)))
            ->join(', ');

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'skills' => $skills,
            'hourly_rate' => $this->faker->numberBetween(25, 120),
            'experience_level' => $this->faker->randomElement(['Junior', 'Mid', 'Senior']),
            'website_url' => $this->faker->optional()->url(),
            'github_url' => $this->faker->optional()->url(),
            'linkedin_url' => $this->faker->optional()->url(),
        ];
    }
}

