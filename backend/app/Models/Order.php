<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
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
}
