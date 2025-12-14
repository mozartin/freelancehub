<?php

namespace App\Providers;

use App\Exceptions\Handler;
use App\Models\User;
use App\Models\FreelancerProfile;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind the exception handler explicitly (missing binding caused 500s)
        $this->app->singleton(ExceptionHandler::class, Handler::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ensure every new freelancer user gets an associated profile
        User::created(function (User $user) {
            if ($user->role === 'freelancer') {
                FreelancerProfile::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'title' => null,
                        'skills' => null,
                        'hourly_rate' => null,
                        'experience_level' => null,
                        'website_url' => null,
                        'github_url' => null,
                        'linkedin_url' => null,
                    ]
                );
            }
        });
    }
}
