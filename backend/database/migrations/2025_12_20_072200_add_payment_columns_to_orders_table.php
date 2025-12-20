<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
               // Hapus kolom status lama kalau mau, atau update fungsinya
        // Kita butuh status yang lebih detail:
        $table->dropColumn('status'); 
        
        $table->enum('status_pembayaran', ['belum_bayar', 'sudah_dp', 'lunas'])->default('belum_bayar');
        $table->enum('status_pengerjaan', ['pending', 'proses', 'selesai', 'serah_terima'])->default('pending');
        
        // Simpan sisa tagihan biar gak perlu hitung ulang
        $table->decimal('sisa_tagihan', 15, 2)->default(0);
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            
        });
    }
};
