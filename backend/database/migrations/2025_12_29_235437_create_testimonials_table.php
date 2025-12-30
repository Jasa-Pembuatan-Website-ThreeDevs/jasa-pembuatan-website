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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('order_id'); // Biar tau ini review dari project mana
            $table->string('nama_pelanggan');
            $table->integer('rating'); // 1 sampai 5
            $table->text('isi_ulasan');
            $table->string('foto_profil')->nullable();       // Opsional, kalau mau ambil dari gravatar/upload
            $table->boolean('is_displayed')->default(false); // Admin harus approve dulu baru muncul di Home
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
