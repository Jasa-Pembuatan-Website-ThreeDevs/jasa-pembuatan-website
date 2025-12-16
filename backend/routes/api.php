<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

// routes/api.php
Route::get('/status', function () {
    return response()->json(['status' => 'ok']);
});

Route::post('/payment', [PaymentController::class, 'createTransaction']);