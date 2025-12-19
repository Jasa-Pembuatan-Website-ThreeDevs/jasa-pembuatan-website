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

// Public admin login (returns sanctum token)
Route::post('/admin/login', [\App\Http\Controllers\AdminAuthController::class, 'login']);

// NOTE: temporarily using only 'auth:sanctum' here to avoid errors when
// Spatie permission tables are not migrated. Run the Spatie migrations and
// restore 'role:admin' middleware when ready.
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
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

    // Income endpoints (wrapper around orders)
    Route::get('/income', [\App\Http\Controllers\IncomeController::class, 'index']);
    Route::get('/income/summary', [\App\Http\Controllers\IncomeController::class, 'summary']);

    // Analytics endpoints for frontend charts
    Route::get('/analytics/sales', [\App\Http\Controllers\AnalyticsController::class, 'salesTrend']);
    Route::get('/analytics/top-categories', [\App\Http\Controllers\AnalyticsController::class, 'topCategories']);
    Route::get('/analytics/expenses', [\App\Http\Controllers\AnalyticsController::class, 'expenseTrend']);
    Route::get('/analytics/income-vs-expense', [\App\Http\Controllers\AnalyticsController::class, 'incomeVsExpense']);

    // Admin auth actions
    Route::post('/logout', [\App\Http\Controllers\AdminAuthController::class, 'logout']);
});

// Maksimal 60 request per menit per IP
Route::middleware('throttle:60,1')->post('/track-order', [OrderController::class, 'checkStatus']);