import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Syarat & Ketentuan</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Pengerjaan Proyek</h2>
            <p>Pengerjaan website akan dimulai setelah Pihak Kedua (Klien) melakukan pembayaran DP minimal 50% dari total harga yang disepakati.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Revisi</h2>
            <p>Klien berhak mendapatkan revisi minor sebanyak maksimal 2 (dua) kali. Revisi major (perubahan total layout/fitur) akan dikenakan biaya tambahan.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Pembayaran</h2>
            <p>Pelunasan wajib dilakukan setelah website selesai didemokan dan sebelum akses penuh (cPanel/Admin) diserahkan kepada klien.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Pembatalan</h2>
            <p>Jika terjadi pembatalan sepihak dari Klien saat proyek sedang berjalan, maka uang DP tidak dapat dikembalikan.</p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;