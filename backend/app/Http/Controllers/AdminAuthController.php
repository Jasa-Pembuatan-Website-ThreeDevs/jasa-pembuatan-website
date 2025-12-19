<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
// --- TAMBAHAN BARU ---
use Illuminate\Support\Facades\RateLimiter; 
use Illuminate\Support\Str;
// ---------------------

class AdminAuthController extends Controller
{
    /**
     * Login admin and return a sanctum token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // --- 1. MEMBUAT KUNCI PEMBATAS (Key: email|ip) ---
        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();

        // --- 2. CEK APAKAH SEDANG DIBLOKIR? ---
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            
            return response()->json([
                'message' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam ' . $seconds . ' detik.',
            ], 429); // 429 Too Many Requests
        }

        $credentials = $request->only('email', 'password');

        // --- 3. COBA LOGIN ---
        if (!Auth::attempt($credentials)) {
            // JIKA GAGAL: Catat kesalahan (Hit)
            RateLimiter::hit($throttleKey, 180); // Blokir dihitung selama 60 detik

            return response()->json([
                'message' => 'Invalid credentials',
                'sisa_percobaan' => RateLimiter::remaining($throttleKey, 5)
            ], 401);
        }

        // --- 4. JIKA BERHASIL: Hapus catatan kesalahan ---
        RateLimiter::clear($throttleKey);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Ensure user has admin role, but only if Spatie package and tables exist.
        if (
            method_exists($user, 'hasRole') &&
            class_exists('\Spatie\Permission\Models\Role') &&
            Schema::hasTable('roles')
        ) {
            if (!$user->hasRole('admin')) {
                return response()->json(['message' => 'Unauthorized: admin only'], 403);
            }
        }

        // Create token for API usage
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }

    /**
     * Optional: logout (revoke current token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'success', 'message' => 'Logged out']);
    }
}