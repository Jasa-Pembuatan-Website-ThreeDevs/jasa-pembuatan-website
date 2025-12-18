<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    /**
     * 1. READ: Tampilkan semua pengeluaran
     * Fitur: Bisa filter berdasarkan kategori atau bulan.
     * Contoh API: /api/expenses?kategori=server
     */
    public function index(Request $request)
    {
        $query = Pengeluaran::query();

        // Filter Kategori (Opsional)
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Urutkan dari tanggal terbaru
        $expenses = $query->orderBy('tanggal_pengeluaran', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $expenses
        ]);
    }

    /**
     * 2. CREATE: Catat Pengeluaran Baru
     */
    public function store(Request $request)
    {
        // Validasi input biar data gak ngawur
        $request->validate([
            'judul' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:1000', // Minimal 1000 rupiah
            // Pastikan kategori sesuai ENUM di database
            'kategori' => 'required|in:server,domain,marketing,gaji,operasional,lainnya',
            'vendor' => 'nullable|string',
            'no_referensi' => 'nullable|string',
            'tanggal_pengeluaran' => 'required|date',
        ]);

        $expense = Pengeluaran::create([
            'judul' => $request->judul,
            'jumlah' => $request->jumlah,
            'kategori' => $request->kategori,
            'vendor' => $request->vendor ?? '-',
            'no_referensi' => $request->no_referensi ?? '-',
            'tanggal_pengeluaran' => $request->tanggal_pengeluaran,
            'catatan' => $request->catatan,
        ]);

        return response()->json([
            'message' => 'Pengeluaran berhasil dicatat!',
            'data' => $expense
        ]);
    }

    /**
     * 3. SHOW: Lihat detail 1 pengeluaran
     */
    public function show($id)
    {
        $expense = Pengeluaran::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['data' => $expense]);
    }

    /**
     * 4. UPDATE: Edit Pengeluaran (Kalau salah ketik nominal/judul)
     */
    public function update(Request $request, $id)
    {
        $expense = Pengeluaran::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        // Validasi ulang
        $request->validate([
            'judul' => 'string',
            'jumlah' => 'numeric',
            'kategori' => 'in:server,domain,marketing,gaji,operasional,lainnya',
        ]);

        $expense->update($request->all());

        return response()->json([
            'message' => 'Data pengeluaran berhasil diperbarui',
            'data' => $expense
        ]);
    }

    /**
     * 5. DELETE: Hapus Pengeluaran
     */
    public function destroy($id)
    {
        $expense = Pengeluaran::find($id);

        if (!$expense) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $expense->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }

    /**
     * BONUS: API RINGKASAN PENGELUARAN
     * Dipanggil untuk Widget Dashboard "Total Pengeluaran"
     */
    public function expenseSummary()
    {
        // Hitung total semua pengeluaran
        $totalPengeluaran = Pengeluaran::sum('jumlah');
        
        // Hitung total per kategori (Buat Pie Chart kalau mau)
        $perKategori = Pengeluaran::selectRaw('kategori, sum(jumlah) as total')
            ->groupBy('kategori')
            ->pluck('total', 'kategori');

        return response()->json([
            'total_expense' => $totalPengeluaran,
            'detail_per_kategori' => $perKategori
        ]);
    }
}