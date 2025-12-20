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
     * Support filter status_pembayaran
     */
    public function index(Request $request)
    {
        $query = Order::query();

        // Filter status pembayaran (misal: ?status=lunas)
        if ($request->has('status')) {
            $query->where('status_pembayaran', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * 2. CREATE: Input Pemasukan Manual (Cash/Transfer Langsung)
     * Karena manual, kita anggap langsung LUNAS atau setara DP.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'paket_layanan' => 'required',
            'total_harga' => 'required|numeric',
            // Input status sekarang pakai format baru
            'status_pembayaran' => 'required|in:belum_bayar,sudah_dp,lunas',
        ]);

        // ID Manual
        $orderId = 'MANUAL-' . strtoupper(Str::random(6));

        // Logika sederhana: Kalau status lunas, sisa tagihan 0. Kalau DP, sisa 50%.
        $sisa = 0;
        if ($request->status_pembayaran == 'sudah_dp') {
            $sisa = $request->total_harga / 2;
        } elseif ($request->status_pembayaran == 'belum_bayar') {
            $sisa = $request->total_harga;
        }

        $order = Order::create([
            'order_id' => $orderId,
            'nama_pelanggan' => $request->nama_pelanggan,
            'email' => $request->email ?? '-',
            'no_hp' => $request->no_hp ?? '-',
            'paket_layanan' => $request->paket_layanan,
            'total_harga' => $request->total_harga,
            
            // KOLOM BARU (Pengganti 'status')
            'status_pembayaran' => $request->status_pembayaran, 
            'status_pengerjaan' => 'pending', // Default
            'sisa_tagihan' => $sisa,
            
            'snap_token' => null, // Manual gak pake token
            'created_at' => $request->tanggal ?? now(),
        ]);

        return response()->json([
            'message' => 'Order manual berhasil dicatat!',
            'data' => $order
        ]);
    }

    /**
     * 3. SHOW: Detail Order
     */
    public function show($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Data tidak ditemukan'], 404);
        return response()->json(['data' => $order]);
    }

    /**
     * 4. UPDATE: Update Status Manual
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Data tidak ditemukan'], 404);

        $order->update($request->all()); // Pastikan frontend kirim field yang benar (status_pembayaran, dll)

        return response()->json([
            'message' => 'Data berhasil diperbarui',
            'data' => $order
        ]);
    }

    /**
     * 5. DELETE: Hapus Order
     */
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Data tidak ditemukan'], 404);
        $order->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    /**
     * API Dashboard: Ringkasan Income
     */
    public function incomeSummary()
    {
        // Hitung total uang yang statusnya 'lunas' atau 'sudah_dp' (DP dianggap pemasukan juga)
        // Logika: Ambil total_harga order lunas + (total_harga/2) order DP
        // Biar simpel kita hitung yang lunas dulu
        $totalPemasukan = Order::where('status_pembayaran', 'lunas')->sum('total_harga');
        
        // Tambahan dari DP (50%)
        $totalDP = Order::where('status_pembayaran', 'sudah_dp')->sum('total_harga') * 0.5;

        $grandTotal = $totalPemasukan + $totalDP;
        
        $countPending = Order::where('status_pembayaran', 'belum_bayar')->count();
        $countActive = Order::where('status_pengerjaan', 'proses')->count();

        return response()->json([
            'total_income' => $grandTotal,
            'stats' => [
                'pending_payment' => $countPending,
                'active_projects' => $countActive
            ]
        ]);
    }

    /**
     * PUBLIC API: Cek Status (Tracking)
     */
    public function checkStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'no_hp' => 'required',
        ]);

        $order = Order::where('order_id', $request->order_id)
                      ->where('no_hp', $request->no_hp)
                      ->first();

        if (!$order) {
            return response()->json(['message' => 'Order tidak ditemukan.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'order_id' => $order->order_id,
                'nama' => $order->nama_pelanggan,
                'paket' => $order->paket_layanan,
                'total_harga' => $order->total_harga,
                
                // Return field BARU biar frontend TrackOrder.jsx jalan
                'status_pembayaran' => $order->status_pembayaran,
                'status_pengerjaan' => $order->status_pengerjaan,
                'sisa_tagihan' => $order->sisa_tagihan,
                'snap_token' => $order->snap_token,
                
                'created_at' => $order->created_at->format('d M Y'),
            ]
        ]);
    }

    /**
     * PUBLIC API: Bayar Pelunasan (Generate Token Baru)
     */
    public function payRemaining(Request $request)
    {
        $order = Order::where('order_id', $request->order_id)->first();
        if (!$order) return response()->json(['message' => 'Order not found'], 404);

        if ($order->status_pembayaran == 'lunas') {
            return response()->json(['message' => 'Sudah Lunas!'], 400);
        }

        // Setup Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Buat ID Transaksi Baru: LUNAS-TRX-xxxx
        $midtransOrderId = 'LUNAS-' . $order->order_id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $midtransOrderId,
                'gross_amount' => (int)$order->sisa_tagihan, // Bayar sisa
            ],
            'customer_details' => [
                'first_name' => $order->nama_pelanggan,
                'email' => $order->email,
                'phone' => $order->no_hp,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            
            // Update token di DB biar frontend bisa pake
            $order->snap_token = $snapToken;
            $order->save();

            return response()->json(['status' => 'success', 'token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}