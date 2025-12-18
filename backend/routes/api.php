<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PengeluaranController;

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

Route::prefix('admin')->group(function () {
    // List semua order (Pemasukan)
    Route::get('/orders', [OrderController::class, 'index']);
    
    // Input order manual (Pemasukan Cash)
    Route::post('/orders', [OrderController::class, 'store']);
    
    // Detail 1 order
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    
    // Update order (Ganti status jadi lunas manual)
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    
    // Hapus order
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    
    // API Khusus Widget Dashboard (Total Duit)
    Route::get('/income-summary', [OrderController::class, 'incomeSummary']);

    Route::get('/expenses', [PengeluaranController::class, 'index']);
    Route::post('/expenses', [PengeluaranController::class, 'store']);
    
    // Detail, Update, Delete
    Route::get('/expenses/{id}', [PengeluaranController::class, 'show']);
    Route::put('/expenses/{id}', [PengeluaranController::class, 'update']);
    Route::delete('/expenses/{id}', [PengeluaranController::class, 'destroy']);

    // API Summary Pengeluaran
    Route::get('/expense-summary', [PengeluaranController::class, 'expenseSummary']);
});

Route::post('/track-order', [OrderController::class, 'checkStatus']);