<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_id',
        'nama_pelanggan',
        'email',
        'no_hp',
        'paket_layanan',
        'total_harga',
        'status_pengerjaan',
        'status_pembayaran',
        'sisa_tagihan',
        'snap_token',
        'progress',
    ];
}
