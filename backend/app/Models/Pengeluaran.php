<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pengeluaran extends Model
{
    use HasFactory;

    // DAFTARKAN SEMUA KOLOM DISINI
    protected $fillable = [
        'judul',
        'jumlah',
        'kategori',          // Enum (server, domain, gaji, dll)
        'vendor',            // Pengganti foto (Jagoan Hosting, dll)
        'no_referensi',      // Nomor Struk/Invoice
        'tanggal_pengeluaran',
        'catatan',
    ];
}
