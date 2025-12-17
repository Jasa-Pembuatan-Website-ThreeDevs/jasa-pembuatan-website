<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use App\Http\Middleware\AddCSPHeaders;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enable HTTPS for secure URLs
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Register the CSP middleware globally
        $this->app['router']->pushMiddlewareToGroup('web', AddCSPHeaders::class);
        $this->app['router']->pushMiddlewareToGroup('api', AddCSPHeaders::class);
    }
}
