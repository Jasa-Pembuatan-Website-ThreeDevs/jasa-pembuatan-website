<?php

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\PaymentCallbackController;

/*
|--------------------------------------------------------------------------
| ROUTE PUBLIK (Bisa diakses tanpa Login)
|--------------------------------------------------------------------------
| Jalur ini terbuka untuk Customer dan Halaman Website Depan.
*/

Route::get('/status', function () {
    return response()->json(['status' => 'ok']);
});

// 1. ORDER CUSTOMER (Dari Website)
// Otomatis status 'belum_bayar' & 'pending'.
Route::post('/orders', [OrderController::class, 'store']);

// 2. TRACKING ORDER
Route::post('/track-order', [OrderController::class, 'checkStatus']);

// 3. PELUNASAN (Midtrans)
Route::post('/pay-remaining', [OrderController::class, 'payRemaining']);

// 4. LOGIN ADMIN
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// 5. TEST MIDTRANS (Opsional, boleh dihapus nanti)
Route::get('/test-midtrans', function () {
    // ... logic test midtrans kamu ...
    return response()->json(['message' => 'Midtrans Configured']);
});

Route::post('/midtrans-callback', [PaymentCallbackController::class, 'receive']);

Route::post('/orders/cancel', [OrderController::class, 'cancelOrder']);

Route::get('/portfolios', [PortfolioController::class, 'index']);
Route::get('/portfolios/{id}', [PortfolioController::class, 'show']); // <--- TAMBAH INI

// Route Khusus Admin (Taruh di dalam middleware auth:sanctum)
/*
|--------------------------------------------------------------------------
| ROUTE PRIVATE ADMIN (Harus Login & Punya Token)
|--------------------------------------------------------------------------
| Jalur ini dikunci. Cuma Admin yang bawa token 'Bearer' yang bisa masuk.
*/
Route::middleware('auth:sanctum')->group(function () {

    // LOGOUT
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    // GROUP ADMIN DASHBOARD
    Route::prefix('admin')->group(function () {
        
        Route::post('/orders/{id}/handover', [OrderController::class, 'uploadHandover']);
        // --- MANAJEMEN ORDER (PEMASUKAN) ---
        // Lihat semua order
        Route::get('/orders', [OrderController::class, 'index']);
        
        // Detail satu order
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        
        // Update order (misal ganti status pengerjaan)
        Route::put('/orders/{id}', [OrderController::class, 'update']);
        
        // Hapus order
        Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

        // [BARU] INPUT ORDER MANUAL (CASH/TRANSFER)
        // Ini jalur khusus Admin (Function: storeManual)
        Route::post('/orders/manual', [OrderController::class, 'storeManual']);


        // --- MANAJEMEN PENGELUARAN (EXPENSES) ---
        Route::get('/expenses', [PengeluaranController::class, 'index']);
        Route::post('/expenses', [PengeluaranController::class, 'store']);
        Route::get('/expenses/{id}', [PengeluaranController::class, 'show']);
        Route::put('/expenses/{id}', [PengeluaranController::class, 'update']);
        Route::delete('/expenses/{id}', [PengeluaranController::class, 'destroy']);
        Route::get('/expense-summary', [PengeluaranController::class, 'expenseSummary']);


        // --- DASHBOARD & ANALYTICS ---
        // Ringkasan Pemasukan (Total Uang)
        Route::get('/income-summary', [OrderController::class, 'incomeSummary']); // Pastikan pakai OrderController
        
        // Grafik Dashboard Utama
        Route::get('/dashboard-chart', [DashboardController::class, 'getChartData']);

        // Analytics Tambahan (Kalau controller-nya ada)
        Route::get('/analytics/sales', [AnalyticsController::class, 'salesTrend']);
        Route::get('/analytics/top-categories', [AnalyticsController::class, 'topCategories']);
        Route::get('/analytics/expenses', [AnalyticsController::class, 'expenseTrend']);
        Route::get('/analytics/income-vs-expense', [AnalyticsController::class, 'incomeVsExpense']);
        // --- MANAJEMEN PORTFOLIO ---
         Route::post('/portfolios', [PortfolioController::class, 'store']);
    Route::delete('/portfolios/{id}', [PortfolioController::class, 'destroy']);
    });

});


Route::get('/invoice/{order_id}', function ($order_id) {
    $order = Order::where('order_id', $order_id)->first();
    
    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }
    
    return response()->json(['data' => $order]);
});

Route::post('/payment', [PaymentController::class, 'createTransaction']);
Route::get('/testimonials', [TestimonialController::class, 'index']); // Buat di Home
Route::post('/testimonials', [TestimonialController::class, 'store']); // Buat User kirim
