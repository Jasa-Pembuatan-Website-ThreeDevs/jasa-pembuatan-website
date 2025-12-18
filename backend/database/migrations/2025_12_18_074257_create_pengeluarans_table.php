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
        Schema::create('pengeluarans', function (Blueprint $table) {
            $table->id();
        $table->string('judul'); // Contoh: "Bayar Server Bulanan"
        $table->decimal('jumlah', 15, 2); 
        
        $table->enum('kategori', [
            'server', 'domain', 'marketing', 'gaji', 'operasional', 'lainnya'
        ])->default('lainnya'); 

        // Daripada foto, simpan nomor struk/invoice-nya
        $table->string('no_referensi')->nullable(); // Contoh: INV/2025/001
        
        // Simpan nama toko/penerima uang
        $table->string('vendor')->nullable(); // Contoh: Jagoan Hosting / Tokopedia

        $table->date('tanggal_pengeluaran'); 
        $table->text('catatan')->nullable(); 
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluarans');
    }
};
