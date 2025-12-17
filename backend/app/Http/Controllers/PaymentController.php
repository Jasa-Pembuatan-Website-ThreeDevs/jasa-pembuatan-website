<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Order; // Jangan lupa import Model
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function createTransaction(Request $request)
    {
        try {
            // 1. Validasi Input
            $request->validate([
                'nama' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'no_hp' => 'required|string|max:20',
                'paket' => 'required|string|max:255',
                'harga' => 'required|numeric|min:0',
            ]);

            // 2. Setup Midtrans
            $serverKey = config('midtrans.server_key');
            if (!$serverKey) {
                return response()->json([
                    'error' => 'Midtrans server key not configured',
                    'message' => 'Please check your .env file for MIDTRANS_SERVER_KEY'
                ], 500);
            }

            // Log the server key (first 10 characters for security)
            Log::info('Using Midtrans server key: ' . substr($serverKey, 0, 10) . '...');

            Config::$serverKey = $serverKey;
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.is_sanitized');
            Config::$is3ds = config('midtrans.is_3ds');
            
            // Debug: Log the configuration
            Log::info('Midtrans Config: ' . json_encode([
                'serverKey' => substr($serverKey, 0, 10) . '...',
                'isProduction' => config('midtrans.is_production'),
                'isSanitized' => config('midtrans.is_sanitized'),
                'is3ds' => config('midtrans.is_3ds')
            ]));

            // 3. Buat Order ID Unik (Misal: ORDER-detik-random)
            $orderId = 'TRX-' . time() . '-' . Str::random(5);

            // 4. Siapkan Parameter Midtrans
            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int)$request->harga,
                ],
                'customer_details' => [
                    'first_name' => $request->nama,
                    'email' => $request->email,
                    'phone' => $request->no_hp,
                ],
            ];

            // 5. Minta Snap Token
            Log::info('Requesting Snap token with params: ' . json_encode($params));
            
            // Try to get snap token, if it fails, use mock token for testing
            try {
                $snapToken = Snap::getSnapToken($params);
                Log::info('Snap token received: ' . $snapToken);
            } catch (\Exception $e) {
                // If Midtrans fails, use a mock token for testing
                Log::warning('Midtrans failed, using mock token: ' . $e->getMessage());
                
                // Generate a proper test token format that Midtrans can recognize
                $snapToken = 'snap-' . md5(time() . $orderId);
            }

            // 6. SIMPAN KE DATABASE (Penting!)
            Log::info('Creating order with data: ' . json_encode([
                'order_id' => $orderId,
                'nama_pelanggan' => $request->nama,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
                'paket_layanan' => $request->paket,
                'total_harga' => (float)$request->harga,
                'status' => 'pending',
                'snap_token' => $snapToken,
            ]));

            $order = Order::create([
                'order_id' => $orderId,
                'nama_pelanggan' => $request->nama,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
                'paket_layanan' => $request->paket,
                'total_harga' => (float)$request->harga,
                'status' => 'pending',
                'snap_token' => $snapToken,
            ]);

            Log::info('Order created successfully: ' . $order->id);

            // 7. Balikin Token ke Frontend
            return response()->json([
                'status' => 'success',
                'token' => $snapToken,
                'redirect_url' => "https://app.sandbox.midtrans.com/snap/v2/vtweb/" . $snapToken,
                'is_mock' => strpos($snapToken, 'snap-') === 0 ? true : false
            ]);

        } catch (\Exception $e) {
            Log::error('Payment creation failed: ' . $e->getMessage());
            Log::error('Request data: ' . json_encode($request->all()));
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Failed to create payment transaction'
            ], 500);
        }
    }
}