import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { showSuccess } from '../utils/swal';

const OrderSuccess = () => {
  const location = useLocation();
  // Ambil data yang dikirim dari navigate() tadi
  const { order } = location.state || {};

  // Fungsi Kirim WA
  const sendWhatsAppConfirmation = () => {
    const phoneNumber = '62895368757054'; // Ganti dengan nomor Admin
    
    // SAFE GUARD: Cek dulu datanya ada atau nggak biar gak error "NaN" atau "undefined"
    const orderId = order?.order_id || '-';
    const nama = order?.nama_pelanggan || 'Customer';
    // Di sini perbaikannya: Cek 'paket' (dari frontend) ATAU 'paket_layanan' (dari backend)
    const paket = order?.paket || order?.paket_layanan || '-'; 
    const harga = order?.total_harga ? parseInt(order.total_harga).toLocaleString('id-ID') : '0';

    const message = `Halo, saya ingin mengkonfirmasi pembayaran saya. \n\nDetail Pesanan:\n- Order ID: ${orderId}\n- Nama Pelanggan: ${nama}\n- Paket: ${paket}\n- Total: Rp ${harga}\n\nTerima kasih.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showSuccess('WhatsApp Anda akan terbuka untuk mengirim konfirmasi pembayaran');
  }; 

  // Tampilan kalau akses halaman ini tanpa order (langsung ketik URL)
  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <p className="text-gray-500 mb-4">Data order tidak ditemukan.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-green-500 animate-fade-in-up">
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="text-4xl">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah mempercayakan website Anda pada ThreeDevs.</p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
              LUNAS
            </div>
            <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">Order ID Anda</p>
            <h2 className="text-3xl md:text-4xl font-black text-blue-800 tracking-widest select-all font-mono">
              {order.order_id}
            </h2>
            <p className="text-xs text-blue-400 mt-2">Simpan ID ini untuk mengecek status pesanan.</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={sendWhatsAppConfirmation}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Konfirmasi ke WhatsApp
            </button>
            <Link to="/track" className="block w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
              Lacak Pesanan Saya
            </Link>
            <Link to="/" className="block w-full text-gray-500 font-medium py-3 hover:text-gray-900 transition">
              Kembali ke Beranda
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;