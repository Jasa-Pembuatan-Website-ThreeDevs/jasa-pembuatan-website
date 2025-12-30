<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\Order;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // 1. PUBLIC: Tampilkan Review di Home (Cuma yang di-approve admin)
    public function index()
    {
        $reviews = Testimonial::where('is_displayed', true)->latest()->get();
        return response()->json($reviews);
    }

    // 2. USER: Kirim Review Baru
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'rating'   => 'required|integer|min:1|max:5',
            'isi_ulasan' => 'required|string|max:500',
        ]);

        // Cek apakah Order ID valid?
        $order = Order::where('order_id', $request->order_id)->first();
        if (!$order) {
            return response()->json(['message' => 'Order ID tidak ditemukan'], 404);
        }

        // Cek apakah user ini udah pernah review sebelumnya? (Biar gak spam)
        $existing = Testimonial::where('order_id', $request->order_id)->first();
        if ($existing) {
            return response()->json(['message' => 'Anda sudah memberikan ulasan untuk order ini.'], 400);
        }

        $review = Testimonial::create([
            'order_id'       => $order->order_id,
            'nama_pelanggan' => $order->nama_pelanggan,
            'rating'         => $request->rating,
            'isi_ulasan'     => $request->isi_ulasan,
            'is_displayed'   => true, // Ubah jadi false kalau mau moderasi admin dulu
        ]);

        return response()->json(['message' => 'Terima kasih atas ulasannya! ⭐', 'data' => $review]);
    }
}