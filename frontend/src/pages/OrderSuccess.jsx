import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  // Ambil data yang dikirim dari navigate() tadi
  const { order } = location.state || {}; 

  if (!order) {
    return <div className="text-center py-20">Data order tidak ditemukan.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-green-500">
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-500 mb-8">Terima kasih telah mempercayakan website Anda pada ThreeDevs.</p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
            <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">Order ID Anda</p>
            <h2 className="text-4xl font-black text-blue-800 tracking-widest select-all">
              {order.order_id}
            </h2>
            <p className="text-xs text-blue-400 mt-2">Simpan ID ini untuk mengecek status pesanan.</p>
          </div>

          <div className="space-y-3">
            <Link to="/track" className="block w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800">
              Lacak Pesanan Saya
            </Link>
            <Link to="/" className="block w-full text-gray-500 font-medium py-3 hover:text-gray-900">
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