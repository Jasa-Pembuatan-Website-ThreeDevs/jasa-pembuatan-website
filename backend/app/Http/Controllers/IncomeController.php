<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Income;

class IncomeController extends Controller
{
    /**
     * Return all income (orders) for admin listing
     */
    public function index(Request $request)
    {
        $query = Income::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Simple summary: total income and counts
     */
    public function summary()
    {
        $total = Income::where('status', 'paid')->sum('total_harga');
        $countPaid = Income::where('status', 'paid')->count();
        $countPending = Income::where('status', 'pending')->count();

        return response()->json([
            'total_income' => $total,
            'stats' => [
                'paid' => $countPaid,
                'pending' => $countPending,
            ]
        ]);
    }
}
