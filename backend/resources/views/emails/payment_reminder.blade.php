<!DOCTYPE html>
<html>
<head>
    <title>Tagihan Pembayaran</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #eeeeee; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #d9534f; margin: 0; font-size: 24px; }
        .content { color: #555555; line-height: 1.6; }
        .box-warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .btn { display: inline-block; background-color: #d9534f; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999999; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Tagihan Segera Jatuh Tempo</h1>
        </div>
        
        <div class="content">
            <p>Halo, <strong>{{ $order->name }}</strong>!</p>
            
            <p>Kami ingin mengingatkan bahwa masa aktif layanan website Anda untuk paket <strong>{{ $order->package_name }}</strong> akan segera berakhir.</p>

            <div class="box-warning">
                <strong>Tanggal Jatuh Tempo:</strong><br>
                {{ \Carbon\Carbon::parse($order->next_due_date)->translatedFormat('d F Y') }}
            </div>

            <p>Mohon segera lakukan pembayaran perpanjangan agar website Anda tetap online dan tidak ter-suspend oleh sistem.</p>

            <p style="text-align: center;">
                <a href="{{ config('app.url') }}/track-order?order_id={{ $order->order_id }}" class="btn">
                    Bayar Perpanjangan Sekarang
                </a>
            </p>

            <p>Jika Anda sudah melakukan pembayaran, mohon abaikan email ini.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} ThreeDevs Digital Agency. All rights reserved.<br>
            Jl. Contoh No. 123, Banyuwangi, Jawa Timur
        </div>
    </div>
</body>
</html>
