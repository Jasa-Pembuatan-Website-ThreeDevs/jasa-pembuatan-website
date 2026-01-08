<?php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderPaidMail;

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
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pelanggan' => 'required',
            'paket_layanan'  => 'required',
            'total_harga'    => 'required|numeric',
            'email'          => 'required|email',
            'no_hp'          => 'required',
        ]);

        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');

        $orderId = 'PRJ-' . strtoupper(Str::random(6)); 

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

            $order = Order::create([
                'order_id'          => $orderId,
                'nama_pelanggan'    => $request->nama_pelanggan,
                'email'             => $request->email,
                'no_hp'             => $request->no_hp,
                'paket_layanan'     => $request->paket_layanan,
                'total_harga'       => $request->total_harga,
                'status_pembayaran' => 'belum_bayar',
                'status_pengerjaan' => 'pending',
                'progress'          => 0, // Default progress 0%
                'sisa_tagihan'      => 0, 
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
     * 3. ADMIN STORE MANUAL
     */
    public function storeManual(Request $request)
    {
        $request->validate([
            'nama_pelanggan'    => 'required',
            'paket_layanan'     => 'required',
            'total_harga'       => 'required|numeric',
            'status_pembayaran' => 'required|in:belum_bayar,sudah_dp,lunas',
        ]);

        $orderId = 'MANUAL-' . strtoupper(Str::random(6));

        $sisa = 0;
        if ($request->status_pembayaran == 'sudah_dp') {
            $sisa = $request->total_harga / 2; 
        } elseif ($request->status_pembayaran == 'belum_bayar') {
            $sisa = $request->total_harga; 
        }

        $order = Order::create([
            'order_id'          => $orderId,
            'nama_pelanggan'    => $request->nama_pelanggan,
            'email'             => $request->email ?? '-',
            'no_hp'             => $request->no_hp ?? '-',
            'paket_layanan'     => $request->paket_layanan,
            'total_harga'       => $request->total_harga,
            'status_pembayaran' => $request->status_pembayaran,
            'status_pengerjaan' => 'pending',
            'progress'          => 0,
            'sisa_tagihan'      => $sisa,
            'snap_token'        => null, 
            'created_at'        => $request->tanggal ?? now(),
        ]);

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
     * 4. UPDATE
     */
    public function update(\App\Http\Requests\UpdateOrderRequest $request, $id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // Now using validated data, preventing mass assignment vulnerabilities.
        $validatedData = $request->validated();
        $order->update($validatedData);

        return response()->json([
            'message' => 'Data berhasil diperbarui',
            'data'    => $order,
        ]);
    }

    /**
     * 5. SHOW
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
     * 6. DELETE
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
     * API Dashboard: Income Summary
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
     * PUBLIC API: Cek Status (Tracking) - SUDAH DIPERBAIKI
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
                
                // FIX: Ubah key biar sama kayak frontend (nama -> nama_pelanggan)
                'nama_pelanggan'    => $order->nama_pelanggan, 
                'paket_layanan'     => $order->paket_layanan,
                
                'total_harga'       => $order->total_harga,
                'status_pembayaran' => $order->status_pembayaran,
                'status_pengerjaan' => $order->status_pengerjaan,
                
                // FIX: Tambahkan field progress biar bar-nya jalan
                'progress'          => $order->progress, 
                
                'handover_file'     => $order->handover_file,
                'sisa_tagihan'      => $order->sisa_tagihan,
                'snap_token'        => $order->snap_token,
                'created_at'        => $order->created_at->format('d M Y'),
            ],
        ]);
    }

    /**
     * PUBLIC API: Bayar Pelunasan
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
     * PUBLIC API: Cancel Order
     */
    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
        ]);

        $order = Order::where('order_id', $request->order_id)
            ->where('status_pembayaran', 'belum_bayar') 
            ->first();

        if ($order) {
            $order->delete();
            return response()->json(['message' => 'Order berhasil dibatalkan']);
        }

        return response()->json(['message' => 'Order tidak ditemukan atau sudah dibayar'], 404);
    }


public function uploadHandover(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB (Sesuaikan kebutuhan)
        ]);

        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order tidak ditemukan'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            // Simpan ke folder public/handovers
            // Nama file unik: HANDOVER-{OrderID}-{Time}.ext
            $filename = 'HANDOVER-' . $order->order_id . '-' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('handovers', $filename, 'public');

            // Simpan path ke database
            $order->handover_file = '/storage/' . $path;
            $order->save();

            return response()->json([
                'message' => 'File aset berhasil diupload!',
                'data' => $order
            ]);
        }

        return response()->json(['message' => 'Gagal upload file'], 400);
    }

}