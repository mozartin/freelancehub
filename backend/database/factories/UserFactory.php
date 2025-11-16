<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),

            'role' => fake()->randomElement(['client', 'freelancer']),
            'avatar_url' => fake()->imageUrl(200, 200, 'people'),
            'location' => fake()->city(),
            'bio' => fake()->sentence(8),
        ];
    }
}
