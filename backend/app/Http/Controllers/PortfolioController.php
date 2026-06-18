<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class PortfolioController extends Controller
{
    // 1. GET ALL PORTFOLIO
    public function index()
    {
        $portfolios = Cache::remember('threedevs_portfolios', 3600, function () {
            return Portfolio::latest()->get();
        });

        return response()->json([
            'status' => 'success',
            'data' => $portfolios
        ]);
    }

    // 2. CREATE NEW (Upload Gambar)
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required',
            'kategori' => 'required',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // Handle Upload File
        if ($request->hasFile('gambar')) {
            $image = $request->file('gambar');
            // Simpan ke folder "public/portfolios"
            $path = $image->storeAs('portfolios', time() . '.' . $image->getClientOriginalExtension(), 'public');
            
            // Simpan path lengkap agar bisa diakses frontend
            // Contoh output: /storage/portfolios/123456.jpg
            $url = '/storage/' . $path; 

            $portfolio = Portfolio::create([
                'judul' => $request->judul,
                'kategori' => $request->kategori,
                'gambar' => $url, // Simpan URL-nya
                'deskripsi' => $request->deskripsi,
                'link_demo' => $request->link_demo,
            ]);

            Cache::forget('threedevs_portfolios');

            return response()->json(['message' => 'Portfolio berhasil ditambahkan', 'data' => $portfolio]);
        }

        return response()->json(['message' => 'Gagal upload gambar'], 400);
    }

    // 3. DELETE
    public function destroy($id)
    {
        $portfolio = Portfolio::find($id);
        if ($portfolio) {
            // Hapus file gambar lama biar server gak penuh
            // Path di database: /storage/portfolios/xxx.jpg -> Kita butuh: portfolios/xxx.jpg
            $relativePath = str_replace('/storage/', '', $portfolio->gambar);
            Storage::disk('public')->delete($relativePath);

            $portfolio->delete();
            Cache::forget('threedevs_portfolios');

            return response()->json(['message' => 'Portfolio dihapus']);
        }
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }

    public function show($id)
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($portfolio);
    }
}

