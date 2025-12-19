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
     * Response: [{ date: 'YYYY-MM-DD', sales: 12345 }, ...]
     */
    public function salesTrend(Request $request)
    {
        $days = (int) ($request->get('days', 30));

        $start = now()->subDays($days - 1)->startOfDay();

        $rows = Order::where('status', 'paid')
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

        // Ensure we return one entry per day (fill zeros)
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
     * Return top categories (paket_layanan) by sales.
     * Response: [{ name: 'Paket A', value: 12345 }, ...]
     */
    public function topCategories(Request $request)
    {
        $limit = (int) ($request->get('limit', 6));

        $rows = Order::where('status', 'paid')
            ->selectRaw('paket_layanan as name, sum(total_harga) as value')
            ->groupBy('paket_layanan')
            ->orderByDesc('value')
            ->limit($limit)
            ->get()
            ->map(function ($r) {
                return [
                    'name' => $r->name ?? 'Lainnya',
                    'value' => (int) $r->value,
                ];
            });

        return response()->json($rows);
    }

    /**
     * Return expense trend for the last N days (default 30).
     * Response: [{ date: 'YYYY-MM-DD', expenses: 12345 }, ...]
     */
    public function expenseTrend(Request $request)
    {
        $days = (int) ($request->get('days', 30));

        $start = now()->subDays($days - 1)->startOfDay();

        $rows = Pengeluaran::where('tanggal_pengeluaran', '>=', $start)
            ->selectRaw("date(tanggal_pengeluaran) as date, sum(jumlah) as expenses")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($r) {
                return [
                    'date' => $r->date,
                    'expenses' => (int) $r->expenses,
                ];
            });

        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $d = now()->subDays($days - 1 - $i)->toDateString();
            $found = $rows->firstWhere('date', $d);
            $result[] = [
                'date' => $d,
                'expenses' => $found ? (int) $found['expenses'] : 0,
            ];
        }

        return response()->json($result);
    }

    /**
     * Return combined income and expense per day for last N days.
     * Response: [{ date: 'YYYY-MM-DD', income: 123, expense: 45 }, ...]
     */
    public function incomeVsExpense(Request $request)
    {
        $days = (int) ($request->get('days', 30));
        $start = now()->subDays($days - 1)->startOfDay();

        $incomeRows = Order::where('status', 'paid')
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
            $result[] = [
                'date' => $d,
                'income' => $incomeRows[$d] ?? 0,
                'expense' => $expenseRows[$d] ?? 0,
            ];
        }

        return response()->json($result);
    }
}
