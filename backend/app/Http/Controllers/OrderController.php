protected $fillable = [
    'order_id',
    'nama_pelanggan',
    'email',
    'no_hp',
    'paket_layanan',
    'total_harga',

    // HAPUS 'status', GANTI DENGAN INI:
    'status_pembayaran',
    'status_pengerjaan',
    'sisa_tagihan',

    'snap_token',
];
