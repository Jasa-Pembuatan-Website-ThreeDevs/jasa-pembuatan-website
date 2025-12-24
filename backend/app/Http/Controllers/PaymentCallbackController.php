<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log; // Buat ngecek log error nanti

class PaymentCallbackController extends Controller
{
    public function receive(Request $request)
    {
        // 1. Ambil Data Notifikasi dari Midtrans
        $serverKey = config('midtrans.server_key');
        $hashed = hash("sha512", $request->order_id.$request->status_code.$request->gross_amount.$serverKey);

        // 2. Verifikasi Signature (Validasi Keamanan)
        if ($hashed == $request->signature_key) {
            
            // Logika untuk menangani notifikasi
            if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                
                // Cari Order berdasarkan ID
                // Note: Jika pakai logika DP/Lunas yang ada prefix 'DP-' atau 'LUNAS-', 
                // kita perlu bersihkan stringnya dulu.
                // Tapi kalau pakai logika Full Payment Hostinger kemarin, ID-nya murni.
                
                $orderIdAsli = $request->order_id;
                
                // Cek apakah ini pembayaran pelunasan (Ada prefix LUNAS-)?
                if (str_contains($orderIdAsli, 'LUNAS-')) {
                    // Ambil ID asli (hapus 'LUNAS-')
                    // Format: LUNAS-PRJ-123-TIME
                    // Kita cari order yg cocok lewat logikamu atau simpan order_id murni di metadata midtrans (opsional)
                    // Simplenya: Kita cari order yg snap_token nya sama kalau ID ribet
                    // Tapi biar aman kita cari order where 'order_id' match pattern
                    
                    // KASUS SIMPLE (SESUAI LOGIKA HOSTINGER - FULL PAYMENT):
                    $order = Order::where('order_id', $orderIdAsli)->first();
                } else {
                    // Kasus Order Baru
                    $order = Order::where('order_id', $orderIdAsli)->first();
                }

                if ($order) {
                    $order->update([
                        'status_pembayaran' => 'lunas', // Langsung LUNAS karena full payment
                        'sisa_tagihan' => 0,
                        'status_pengerjaan' => 'proses' // Otomatis mulai pengerjaan
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Callback received']);
    }
}