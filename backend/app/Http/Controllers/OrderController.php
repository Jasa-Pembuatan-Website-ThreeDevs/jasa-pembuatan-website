<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // Untuk bikin random string

class OrderController extends Controller
{
    /**
     * 1. READ: Tampilkan semua data pemasukan (Order)
     * Bisa difilter statusnya biar rapi.
     */
    public function index(Request $request)
    {
        // Ambil data urut dari yang terbaru
        // Kalau ada parameter ?status=paid, dia cuma ambil yang lunas
        $query = Order::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    /**
     * 2. CREATE: Input Pemasukan Manual
     * Gunanya: Kalau ada klien bayar CASH atau Transfer Langsung (Bypass Midtrans)
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'paket_layanan' => 'required',
            'total_harga' => 'required|numeric',
            'status' => 'required|in:pending,paid,failed', // Admin bisa langsung set 'paid'
            'tanggal' => 'date', // Opsional, default hari ini
        ]);

        // Bikin Order ID Manual tapi unik
        $orderId = 'MANUAL-' . strtoupper(Str::random(6));

        $order = Order::create([
            'order_id' => $orderId,
            'nama_pelanggan' => $request->nama_pelanggan,
            'email' => $request->email ?? '-', // Boleh kosong kalau manual
            'no_hp' => $request->no_hp ?? '-',
            'paket_layanan' => $request->paket_layanan,
            'total_harga' => $request->total_harga,
            'status' => $request->status, // Langsung PAID kalau cash
            'snap_token' => null, // Gak ada token Midtrans karena manual
            'created_at' => $request->tanggal ?? now(),
        ]);

        return response()->json([
            'message' => 'Pemasukan manual berhasil dicatat!',
            'data' => $order
        ]);
    }

    /**
     * 3. SHOW: Lihat detail 1 order
     */
    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['data' => $order]);
    }

    /**
     * 4. UPDATE: Edit Data / Ubah Status
     * Gunanya: Mengubah status 'Pending' jadi 'Paid' secara paksa (Manual Approval)
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // Validasi apa yang mau diubah
        $request->validate([
            'status' => 'in:pending,paid,failed,cancelled',
            'total_harga' => 'numeric',
        ]);

        $order->update($request->all());

        return response()->json([
            'message' => 'Data order berhasil diperbarui',
            'data' => $order
        ]);
    }

    /**
     * 5. DELETE: Hapus Order (Misal order spam/iseng)
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    /**
     * BONUS: API RINGKASAN PEMASUKAN
     * Dipanggil untuk Widget Dashboard "Total Income"
     */
    public function incomeSummary()
    {
        // Hitung total uang yang statusnya 'paid'
        $totalPemasukan = Order::where('status', 'paid')->sum('total_harga');
        
        // Hitung jumlah order berdasarkan status
        $countPending = Order::where('status', 'pending')->count();
        $countSuccess = Order::where('status', 'paid')->count();

        return response()->json([
            'total_income' => $totalPemasukan,
            'stats' => [
                'pending' => $countPending,
                'success' => $countSuccess
            ]
        ]);
    }
}