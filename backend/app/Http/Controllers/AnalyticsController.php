<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
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
        $cacheKey = "threedevs_analytics_sales_{$days}";

        $result = Cache::remember($cacheKey, 600, function () use ($days) {
            $start = now()->subDays($days - 1)->startOfDay();

            $rows = Order::where('status_pembayaran', 'lunas')
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

            $result = [];
            for ($i = 0; $i < $days; $i++) {
                $d = now()->subDays($days - 1 - $i)->toDateString();
                $found = $rows->firstWhere('date', $d);
                $result[] = [
                    'date' => $d,
                    'sales' => $found ? (int) $found['sales'] : 0,
                ];
            }

            return $result;
        });

        return response()->json($result);
    }

    /**
     * Return combined income and expense per day for last N days.
     */
    public function incomeVsExpense(Request $request)
    {
        $days = (int) ($request->get('days', 30));
        $cacheKey = "threedevs_analytics_incexp_{$days}";

        $result = Cache::remember($cacheKey, 600, function () use ($days) {
            $start = now()->subDays($days - 1)->startOfDay();

            $incomeRows = Order::where('status_pembayaran', 'lunas')
                ->where('created_at', '>=', $start)
                ->selectRaw("date(created_at) as date, sum(total_harga) as income")
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(function ($r) { return [$r->date => (int) $r->income]; });

            $expenseRows = Pengeluaran::where('tanggal_pengeluaran', '>=', $start)
                ->selectRaw("date(tanggal_pengeluaran) as date, sum(jumlah) as expense")
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(function ($r) { return [$r->date => (int) $r->expense]; });

            $result = [];
            for ($i = 0; $i < $days; $i++) {
                $d = now()->subDays($days - 1 - $i)->toDateString();
                $label = \Carbon\Carbon::parse($d)->format('d M');

                $result[] = [
                    'date' => $label,
                    'income' => $incomeRows[$d] ?? 0,
                    'expense' => $expenseRows[$d] ?? 0,
                ];
            }

            return $result;
        });

        return response()->json($result);
    }
    
    // Fungsi Top Categories (Opsional, kalau mau dipake)
    public function topCategories()
    {
        $data = Cache::remember('threedevs_analytics_top_categories', 600, function () {
            return Order::where('status_pembayaran', 'lunas')
                ->select('paket_layanan as name', DB::raw('count(*) as value'))
                ->groupBy('paket_layanan')
                ->orderByDesc('value')
                ->limit(5)
                ->get();
        });

        return response()->json($data);
    }
    
    // Fungsi Expense Trend (Opsional)
    public function expenseTrend(Request $request)
    {
        // Logikanya mirip salesTrend tapi untuk Pengeluaran
        return response()->json([]); 
    }
}