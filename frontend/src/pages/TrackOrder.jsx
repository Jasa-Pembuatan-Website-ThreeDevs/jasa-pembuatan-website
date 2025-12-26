import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { showSuccess, showWarning, showError, showInfo } from '../utils/swal';

const TrackOrder = () => {
  const [form, setForm] = useState({ order_id: '', no_hp: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- COMMAND: Fungsi Cek Status ke API ---
  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:8000/api/track-order', form);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order tidak ditemukan / Data salah.');
    } finally {
      setLoading(false);
    }
  };

  // --- COMMAND: Fungsi Bayar DP (50%) ---
  // Token DP biasanya sudah ada saat order pertama kali dibuat (tersimpan di database)
  const handleBayarDP = () => {
    if (window.snap && result.snap_token) {
      window.snap.pay(result.snap_token, {
        onSuccess: function (result) {
          showSuccess("DP Berhasil Dibayar! Tim kami akan segera mengerjakan.");
          window.location.reload(); // Refresh halaman biar status update
        },
        onPending: function (result) { showInfo("Menunggu pembayaran DP..."); },
        onError: function (result) { showError("Pembayaran DP Gagal!"); }
      });
    } else {
      showWarning("Token pembayaran tidak ditemukan. Hubungi Admin.");
    }
  };

  // --- COMMAND: Fungsi Bayar Pelunasan (Sisa Tagihan) ---
  // Kita harus minta token BARU ke backend, karena ID transaksinya beda (LUNAS-...)
  const handlePelunasan = async () => {
    try {
      // Panggil API khusus pelunasan yang tadi kita buat di OrderController
      const res = await axios.post('http://localhost:8000/api/pay-remaining', { 
        order_id: result.order_id 
      });

      const tokenPelunasan = res.data.token;

      if (window.snap) {
        window.snap.pay(tokenPelunasan, {
          onSuccess: function (result) {
            showSuccess("Pelunasan Berhasil! Akses website akan dikirim ke Email.");
            window.location.reload();
          },
          onPending: function (result) { showInfo("Menunggu pelunasan..."); },
          onError: function (result) { showError("Pelunasan Gagal!"); }
        });
      }
    } catch (err) {
      console.error(err);
      showError("Gagal memproses pelunasan. Coba lagi nanti.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Cek Status Pesanan</h1>
              <p className="text-gray-500 text-sm">Masukkan ID Order & No WA Anda</p>
            </div>

            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: PRJ-17345" // Sesuaikan contoh ID Proyekmu
                  value={form.order_id}
                  onChange={(e) => setForm({...form, order_id: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0812..."
                  value={form.no_hp}
                  onChange={(e) => setForm({...form, no_hp: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Mengecek...' : 'Lacak Sekarang'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Result Card (Muncul kalau ada data) */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500 animate-fade-in-up">
              
              {/* --- COMMAND: Header Status --- */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{result.paket}</h3>
                  <p className="text-sm text-gray-500">Tgl Order: {result.created_at}</p>
                </div>
                {/* Badge Status Dinamis */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.status_pembayaran === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.status_pembayaran === 'lunas' ? 'LUNAS' : result.status_pembayaran.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-800">Halo, {result.nama}</p>
                  
                  {/* --- COMMAND: LOGIKA TAMPILAN KONDISIONAL --- */}
                  
                  {/* KONDISI 1: Belum Bayar DP Sama Sekali */}
                  {result.status_pembayaran === 'belum_bayar' && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 mb-3">
                        Pesanan belum diproses. Silakan bayar DP sebesar 50% terlebih dahulu.
                      </p>
                      <button 
                        onClick={handleBayarDP}
                        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
                      >
                        Bayar DP Sekarang
                      </button>
                    </div>
                  )}

                  {/* KONDISI 2: Sudah DP, Tapi Website Masih Dikerjakan (Belum Selesai) */}
                  {result.status_pembayaran === 'sudah_dp' && result.status_pengerjaan !== 'selesai' && (
                    <div className="mt-2">
                      <p className="text-sm text-blue-600">
                        Pembayaran DP diterima. Tim kami sedang mengerjakan website Anda. Mohon ditunggu ya! ???
                      </p>
                      <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 inline-block rounded">
                        Status Pengerjaan: {result.status_pengerjaan.toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* KONDISI 3: Website Sudah Jadi (Siap Dilunasi) */}
                  {result.status_pembayaran === 'sudah_dp' && result.status_pengerjaan === 'selesai' && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 font-bold mb-3">
                        Hore! Website Anda sudah selesai dikerjakan ?
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Silakan lunasi sisa tagihan untuk mendapatkan akses penuh ke website Anda.
                      </p>
                      <div className="bg-gray-100 p-2 rounded mb-3 flex justify-between">
                         <span>Sisa Tagihan:</span>
                         <span className="font-bold">Rp {parseInt(result.sisa_tagihan).toLocaleString('id-ID')}</span>
                      </div>
                      <button 
                        onClick={handlePelunasan}
                        className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
                      >
                        Lunasi Sekarang
                      </button>
                    </div>
                  )}

                  {/* KONDISI 4: Sudah Lunas (Serah Terima) */}
                  {result.status_pembayaran === 'lunas' && (
                    <div className="mt-2">
                      <p className="text-sm text-green-700">
                        Terima kasih! Pembayaran lunas. Data akses website telah dikirim ke Email/WhatsApp Anda.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default TrackOrder;