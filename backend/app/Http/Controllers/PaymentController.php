<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; // Jangan lupa import Model
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function createTransaction(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'nama' => 'required',
            'email' => 'required|email',
            'no_hp' => 'required',
            'paket' => 'required',
            'harga' => 'required|numeric',
        ]);

        // 2. Setup Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // 3. Buat Order ID Unik (Misal: ORDER-detik-random)
        $orderId = 'TRX-' . time() . '-' . Str::random(5);

        // 4. Siapkan Parameter Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $request->harga,
            ],
            'customer_details' => [
                'first_name' => $request->nama,
                'email' => $request->email,
                'phone' => $request->no_hp,
            ],
        ];

        try {
            // 5. Minta Snap Token
            $snapToken = Snap::getSnapToken($params);

            // 6. SIMPAN KE DATABASE (Penting!)
            $order = Order::create([
                'order_id' => $orderId,
                'nama_pelanggan' => $request->nama,
                'email' => $request->email,
                'no_hp' => $request->no_hp,
                'paket_layanan' => $request->paket,
                'total_harga' => $request->harga,
                'status' => 'pending',
                'snap_token' => $snapToken,
            ]);

            // 7. Balikin Token ke Frontend
            return response()->json([
                'status' => 'success',
                'token' => $snapToken,
                'redirect_url' => "https://app.sandbox.midtrans.com/snap/v2/vtweb/" . $snapToken
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}