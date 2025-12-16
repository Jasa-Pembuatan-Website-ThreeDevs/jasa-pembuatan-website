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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
        $table->string('order_id')->unique(); 
        $table->string('nama_pelanggan');
        $table->string('email');
        $table->string('no_hp');
        $table->string('paket_layanan'); 
        $table->decimal('total_harga', 15, 2); 
        $table->string('status')->default('pending'); 
        $table->string('snap_token')->nullable(); 
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
