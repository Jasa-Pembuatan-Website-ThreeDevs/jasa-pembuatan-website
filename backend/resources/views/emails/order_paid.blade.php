<!DOCTYPE html>
<html>
<head>
    <title>Pembayaran Berhasil</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1A237E;">Terima Kasih, {{ $order->nama_pelanggan }}! 🎉</h2>
        <p>Pembayaran Anda telah kami terima. Tim ThreeDevs akan segera memproses pesanan Anda.</p>

        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Detail Pesanan:</h3>
            <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
            <p><strong>Paket:</strong> {{ $order->paket_layanan }}</p>
            <p><strong>Total Bayar:</strong> Rp {{ number_format($order->total_harga, 0, ',', '.') }}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">LUNAS</span></p>
        </div>

        <p>Anda bisa memantau progres pengerjaan melalui website kami di menu <strong>Track Order</strong>.</p>

        <div style="text-align: center; margin: 30px 0;">
    <a href="http://localhost:5173/invoice/{{ $order->order_id }}"
       style="background-color: #1A237E; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
       Lihat Invoice Full (Web)
    </a>
</div>

<p>Atau akses melalui link berikut: <br>
<a href="http://localhost:5173/invoice/{{ $order->order_id }}">http://localhost:5173/invoice/{{ $order->order_id }}</a>
</p>
        <br>
        <p>Salam Sukses,<br><strong>Tim ThreeDevs</strong></p>
    </div>

</body>
</html>
