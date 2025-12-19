<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Income extends Model
{
    use HasFactory;

    // Map to the orders table which represents income/pemasukan
    protected $table = 'orders';

    protected $fillable = [
        'order_id',
        'nama_pelanggan',
        'email',
        'no_hp',
        'paket_layanan',
        'total_harga',
        'status',
        'snap_token',
    ];

    protected $casts = [
        'total_harga' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
