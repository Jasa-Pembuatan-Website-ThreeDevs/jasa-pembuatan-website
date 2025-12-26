<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderPaidMail;
use App\Mail\AdminNotificationMail;
// Buat ngecek log error nanti

class PaymentCallbackController extends Controller
{
    public function receive(Request $request)
    {
        // 1. Ambil Data Notifikasi dari Midtrans
        $serverKey = config('midtrans.server_key');
        $hashed    = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

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
                    // 1. Update Database
                    $order->update([
                        'status_pembayaran' => 'lunas',
                        'sisa_tagihan'      => 0,
                        'status_pengerjaan' => 'proses',
                    ]);

                    // 2. KIRIM EMAIL (Logic Baru Disini) 🚀
                    try {
                        // Kirim ke Customer
                        Mail::to($order->email)->send(new OrderPaidMail($order));

                        // Kirim ke Admin (Ganti email lo)
                        Mail::to('aryapranajaya02@gmail.com ')->send(new AdminNotificationMail($order));

                    } catch (\Exception $e) {
                        // Kalau email gagal, jangan bikin error callback midtrans. Cukup log aja.
                        Log::error("Gagal kirim email: " . $e->getMessage());
                    }
                }
            }
        }

        return response()->json(['message' => 'Callback received']);
    }
}
