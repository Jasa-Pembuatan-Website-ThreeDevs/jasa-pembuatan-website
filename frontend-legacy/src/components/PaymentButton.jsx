import React from 'react';
import axios from 'axios';
import { showSuccess, showWarning, showError, showInfo } from '../utils/swal';

const PaymentButton = () => {
  
  const handlePay = async () => {
    try {
      // 1. Minta Token ke Backend Kita Sendiri
      const response = await axios.post('http://localhost:8000/api/payment', {
        total_harga: 1500000, // Contoh harga paket
        nama_pelanggan: "Budi Santoso",
        email: "budi@example.com",
        phone: "08123456789"
      });

      const snapToken = response.data.token;

      // 2. Panggil Jendela Pembayaran (SNAP)
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function(result){
            showSuccess("Pembayaran Berhasil!");
            console.log(result);
          },
          onPending: function(result){
            showInfo("Menunggu Pembayaran..."); console.log(result);
          },
          onError: function(result){
            showError("Pembayaran Gagal!"); console.log(result);
          },
          onClose: function(){
            showWarning('Anda menutup popup tanpa menyelesaikan pembayaran');
          }
        });
      }

    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
    }
  };

  return (
    <button 
      onClick={handlePay}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
    >
      Bayar Sekarang
    </button>
  );
};

export default PaymentButton;