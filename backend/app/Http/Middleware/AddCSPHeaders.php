<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddCSPHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add CSP headers to all routes (web and API)
        // This is needed for payment SDKs like Midtrans that use eval()

        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://snap-assets.al-pc-id-b.cdn.gtflabs.io https://api.sandbox.midtrans.com https://pay.google.com https://js-agent.newrelic.com https://bam.nr-data.net https://gwk.gopayapi.com; " .
               "style-src 'self' 'unsafe-inline' https://snap-assets.al-pc-id-b.cdn.gtflabs.io https://api.sandbox.midtrans.com; " .
               "img-src 'self' data: https:; " .
               "connect-src 'self' https://api.sandbox.midtrans.com https://pay.google.com https://bam.nr-data.net https://gwk.gopayapi.com; " .
               "font-src 'self' https:; " .
               "frame-src 'self' https://api.sandbox.midtrans.com https://pay.google.com https://gwk.gopayapi.com; " .
               "object-src 'none'; " .
               "base-uri 'self'; " .
               "form-action 'self' https://api.sandbox.midtrans.com; " .
               "frame-ancestors 'none'; " .
               "upgrade-insecure-requests;";

        $response->header('Content-Security-Policy', $csp);

        return $response;
    }
}