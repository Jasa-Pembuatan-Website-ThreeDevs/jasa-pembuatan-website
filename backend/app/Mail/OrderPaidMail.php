<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderPaidMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order; // Variabel penampung data

    
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('✅ Pembayaran Berhasil - ThreeDevs')
                    ->view('emails.order_paid'); // Nanti kita buat view ini
    }
}