<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraphs(3, true),
            'skills' => implode(', ', fake()->randomElements(
                ['React', 'PHP', 'Laravel', 'MySQL', 'Node.js', 'TypeScript', 'CSS', 'Tailwind'],
                rand(2, 4)
            )),
            'budget_type' => fake()->randomElement(['fixed', 'hourly']),
            'budget_min' => fake()->numberBetween(200, 800),
            'budget_max' => fake()->numberBetween(900, 3000),
            'status' => 'open',
        ];
    }
}
