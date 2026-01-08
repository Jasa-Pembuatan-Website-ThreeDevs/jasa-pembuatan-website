<?php

// ... imports ...
use App\Models\Order;
use App\Mail\PaymentReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendPaymentReminders extends Command
{
    protected $signature = 'payment:remind'; // Nama perintah terminal
    protected $description = 'Kirim email ke user yang jatuh tempo 3 hari lagi';

    public function handle()
    {
        // 1. Cari Order Langganan yang jatuh tempo 3 hari lagi (H-3)
        $dueDate = Carbon::now()->addDays(3)->format('Y-m-d');
        
        $orders = Order::where('is_recurring', true)
                       ->whereDate('next_due_date', $dueDate)
                       ->where('status', 'paid') // Pastikan status sebelumnya aktif
                       ->with('user') // Eager load user
                       ->get();

        foreach ($orders as $order) {
            // 2. Kirim Email
            Mail::to($order->user->email)->send(new PaymentReminderMail($order));
            
            $this->info("Email dikirim ke: " . $order->user->email);
        }

        $this->info('Selesai cek tagihan.');
    }
}