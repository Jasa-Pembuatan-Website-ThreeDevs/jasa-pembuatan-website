<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Pengeluaran;

class AnalyticsController extends Controller
{
    /**
     * Return sales trend for the last N days (default 30).
     */
    public function salesTrend(Request $request)
    {
        $days = (int) ($request->get('days', 30));
        $start = now()->subDays($days - 1)->startOfDay();

        // PERBAIKAN DI SINI: Ganti 'status' -> 'status_pembayaran'
        $rows = Order::where('status_pembayaran', 'lunas') // Atau bisa pakai whereIn(['lunas', 'sudah_dp'])
            ->where('created_at', '>=', $start)
            ->selectRaw("date(created_at) as date, sum(total_harga) as sales")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($r) {
                return [
                    'date' => $r->date,
                    'sales' => (int) $r->sales,
                ];
            });

        // Isi tanggal kosong dengan 0
        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $d = now()->subDays($days - 1 - $i)->toDateString();
            $found = $rows->firstWhere('date', $d);
            $result[] = [
                'date' => $d,
                'sales' => $found ? (int) $found['sales'] : 0,
            ];
        }

        return response()->json($result);
    }

    /**
     * Return combined income and expense per day for last N days.
     */
    public function incomeVsExpense(Request $request)
    {
        $days = (int) ($request->get('days', 30));
        $start = now()->subDays($days - 1)->startOfDay();

        // 1. AMBIL DATA ORDER (PEMASUKAN)
        // PERBAIKAN: Sesuaikan kolom status_pembayaran
        $incomeRows = Order::where('status_pembayaran', 'lunas') 
            ->where('created_at', '>=', $start)
            ->selectRaw("date(created_at) as date, sum(total_harga) as income")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($r) { return [$r->date => (int) $r->income]; });

        // 2. AMBIL DATA PENGELUARAN
        // Pastikan model Pengeluaran punya kolom 'tanggal_pengeluaran' & 'jumlah'
        $expenseRows = Pengeluaran::where('tanggal_pengeluaran', '>=', $start)
            ->selectRaw("date(tanggal_pengeluaran) as date, sum(jumlah) as expense")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($r) { return [$r->date => (int) $r->expense]; });

        // 3. GABUNGKAN DATA
        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $d = now()->subDays($days - 1 - $i)->toDateString();
            
            // Format tanggal biar cantik di grafik (Contoh: 20 Dec)
            // Kalau mau tetap YYYY-MM-DD, hapus baris format('d M') ini
            $label = \Carbon\Carbon::parse($d)->format('d M'); 

            $result[] = [
                'date' => $label, // Ini label X-Axis
                'income' => $incomeRows[$d] ?? 0,
                'expense' => $expenseRows[$d] ?? 0,
            ];
        }

        return response()->json($result);
    }
    
    // Fungsi Top Categories (Opsional, kalau mau dipake)
    public function topCategories()
    {
         // Ambil Top 5 Paket Layanan yang paling laku
         $data = Order::where('status_pembayaran', 'lunas')
             ->select('paket_layanan as name', DB::raw('count(*) as value'))
             ->groupBy('paket_layanan')
             ->orderByDesc('value')
             ->limit(5)
             ->get();

         return response()->json($data);
    }
    
    // Fungsi Expense Trend (Opsional)
    public function expenseTrend(Request $request)
    {
        // Logikanya mirip salesTrend tapi untuk Pengeluaran
        return response()->json([]); 
    }
}