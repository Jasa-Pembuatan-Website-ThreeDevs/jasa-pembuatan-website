<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

// routes/api.php
Route::get('/status', function () {
    return response()->json(['status' => 'ok']);
});

// Test Midtrans configuration
Route::get('/test-midtrans', function () {
    try {
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
        
        // Try to get snap token with minimal data
        $params = [
            'transaction_details' => [
                'order_id' => 'TEST-' . time(),
                'gross_amount' => 1000,
            ],
            'customer_details' => [
                'first_name' => 'Test',
                'email' => 'test@example.com',
                'phone' => '08123456789',
            ],
        ];
        
        $snapToken = \Midtrans\Snap::getSnapToken($params);
        return response()->json(['status' => 'success', 'token' => $snapToken]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Get all orders (for testing)
Route::get('/orders', function () {
    return response()->json(\App\Models\Order::all());
});

Route::post('/payment', [PaymentController::class, 'createTransaction']);