<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderPaidMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order; 

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Pembayaran Berhasil - ThreeDevs',
        );
    }

    // --- PERBAIKAN DI SINI ---
    public function content(): Content
    {
        return new Content(
            view: 'emails.order_paid',
            // Kita tambahkan 'with' untuk memaksa data masuk ke View
            with: [
                'order' => $this->order,
            ],
        );
    }
    // -------------------------

    public function attachments(): array
    {
        return [];
    }
}