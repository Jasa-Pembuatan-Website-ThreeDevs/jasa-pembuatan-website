<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;

class OrderController extends Controller
{
    /**
     * 1. READ: Tampilkan semua order
     */
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('status')) {
            $query->where('status_pembayaran', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data'   => $orders,
        ]);
    }

    /**
     * 2. PUBLIC STORE: Order dari Website (Customer)
     * Aman dari manipulasi. Status otomatis 'belum_bayar' dulu.
     */
    public function store(Request $request)
    {
        // Validasi input Customer
        $request->validate([
            'nama_pelanggan' => 'required',
            'paket_layanan'  => 'required',
            'total_harga'    => 'required|numeric',
            'email'          => 'required|email',
            'no_hp'          => 'required',
        ]);

        // Setup Midtrans
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');

                                                        // Buat ID Transaksi
        $orderId = 'PRJ-' . strtoupper(Str::random(6)); // ID Project

        // Parameter Midtrans (Full Payment di awal sesuai harga paket)
        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $request->total_harga,
            ],
            'customer_details'    => [
                'first_name' => $request->nama_pelanggan,
                'email'      => $request->email,
                'phone'      => $request->no_hp,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Simpan ke Database
            $order = Order::create([
                'order_id'          => $orderId,
                'nama_pelanggan'    => $request->nama_pelanggan,
                'email'             => $request->email,
                'no_hp'             => $request->no_hp,
                'paket_layanan'     => $request->paket_layanan,
                'total_harga'       => $request->total_harga,

                // PENTING: Untuk publik, status AWAL selalu 'belum_bayar'
                // Nanti berubah jadi 'lunas' otomatis kalau Midtrans kirim notif/webhook
                'status_pembayaran' => 'belum_bayar',

                'status_pengerjaan' => 'pending',
                'sisa_tagihan'      => 0, // Dianggap full payment (tapi belum masuk duitnya)
                'snap_token'        => $snapToken,
            ]);

            return response()->json([
                'status' => 'success',
                'token'  => $snapToken,
                'data'   => $order,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 3. ADMIN STORE MANUAL: Input Jalur Belakang (Cash/Transfer)
     * Ini logika yang kamu minta, King! 👑
     */
    public function storeManual(Request $request)
    {
        // Validasi khusus Admin (Boleh tentukan status)
        $request->validate([
            'nama_pelanggan'    => 'required',
            'paket_layanan'     => 'required',
            'total_harga'       => 'required|numeric',
            // Admin boleh langsung tembak status
            'status_pembayaran' => 'required|in:belum_bayar,sudah_dp,lunas',
        ]);

        // ID Manual (Beda format biar ketahuan ini inputan admin)
        $orderId = 'MANUAL-' . strtoupper(Str::random(6));

        // Hitung Sisa Tagihan Otomatis
        $sisa = 0;
        if ($request->status_pembayaran == 'sudah_dp') {
            $sisa = $request->total_harga / 2; // Kalau DP, sisa setengah
        } elseif ($request->status_pembayaran == 'belum_bayar') {
            $sisa = $request->total_harga; // Kalau belum bayar, utang full
        }
        // Kalau 'lunas', sisa 0 (default)

        $order = Order::create([
            'order_id'          => $orderId,
            'nama_pelanggan'    => $request->nama_pelanggan,
            'email'             => $request->email ?? '-',
            'no_hp'             => $request->no_hp ?? '-',
            'paket_layanan'     => $request->paket_layanan,
            'total_harga'       => $request->total_harga,

            // Status sesuai inputan Admin
            'status_pembayaran' => $request->status_pembayaran,

            'status_pengerjaan' => 'pending',
            'sisa_tagihan'      => $sisa,
            'snap_token'        => null, // Cash gak butuh token midtrans
            'created_at'        => $request->tanggal ?? now(),
        ]);

        // Kirim Email Invoice ke Klien Manual
        if ($request->email && $request->email != '-') {
            try {
                Mail::to($request->email)->send(new OrderPaidMail($order));
            } catch (\Exception $e) {}
        }

        return response()->json([
            'message' => 'Order manual berhasil dicatat, King!',
            'data'    => $order,
        ]);
    }

    /**
     * 4. UPDATE: Update Status/Data
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $order->update($request->all());

        return response()->json([
            'message' => 'Data berhasil diperbarui',
            'data'    => $order,
        ]);
    }

    /**
     * 5. SHOW: Detail Order
     */
    public function show($id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['data' => $order]);
    }

    /**
     * 6. DELETE: Hapus Order
     */
    public function destroy($id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $order->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    /**
     * API Dashboard: Ringkasan Income
     */
    public function incomeSummary()
    {
        $totalPemasukan = Order::where('status_pembayaran', 'lunas')->sum('total_harga');
        $totalDP        = Order::where('status_pembayaran', 'sudah_dp')->sum('total_harga') * 0.5;
        $grandTotal     = $totalPemasukan + $totalDP;

        $countPending = Order::where('status_pembayaran', 'belum_bayar')->count();
        $countActive  = Order::where('status_pengerjaan', 'proses')->count();

        return response()->json([
            'total_income' => $grandTotal,
            'stats'        => [
                'pending_payment' => $countPending,
                'active_projects' => $countActive,
            ],
        ]);
    }

    /**
     * PUBLIC API: Cek Status (Tracking)
     */
    public function checkStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'no_hp'    => 'required',
        ]);

        $order = Order::where('order_id', $request->order_id)
            ->where('no_hp', $request->no_hp)
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Order tidak ditemukan.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'order_id'          => $order->order_id,
                'nama'              => $order->nama_pelanggan,
                'paket'             => $order->paket_layanan,
                'total_harga'       => $order->total_harga,
                'status_pembayaran' => $order->status_pembayaran,
                'status_pengerjaan' => $order->status_pengerjaan,
                'sisa_tagihan'      => $order->sisa_tagihan,
                'snap_token'        => $order->snap_token,
                'created_at'        => $order->created_at->format('d M Y'),
            ],
        ]);
    }

    /**
     * PUBLIC API: Bayar Pelunasan (Generate Token Baru)
     */
    public function payRemaining(Request $request)
    {
        $order = Order::where('order_id', $request->order_id)->first();
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($order->status_pembayaran == 'lunas') {
            return response()->json(['message' => 'Sudah Lunas!'], 400);
        }

        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');

        $midtransOrderId = 'LUNAS-' . $order->order_id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id'     => $midtransOrderId,
                'gross_amount' => (int) $order->sisa_tagihan,
            ],
            'customer_details'    => [
                'first_name' => $order->nama_pelanggan,
                'email'      => $order->email,
                'phone'      => $order->no_hp,
            ],
        ];

        try {
            $snapToken         = Snap::getSnapToken($params);
            $order->snap_token = $snapToken;
            $order->save();

            return response()->json(['status' => 'success', 'token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * PUBLIC API: Cancel Order (Dipanggil saat user close popup Midtrans)
     */
    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
        ]);

        $order = Order::where('order_id', $request->order_id)
            ->where('status_pembayaran', 'belum_bayar') // Pastikan cuma yg belum bayar yg bisa diapus
            ->first();

        if ($order) {
            // OPSI 1: HAPUS PERMANEN (Sesuai requestmu)
            $order->delete();

            // OPSI 2: SOFT DELETE (Cuma ganti status, biar ada history)
            // $order->update(['status_pembayaran' => 'cancelled']);

            return response()->json(['message' => 'Order berhasil dibatalkan']);
        }

        return response()->json(['message' => 'Order tidak ditemukan atau sudah dibayar'], 404);
    }
}
