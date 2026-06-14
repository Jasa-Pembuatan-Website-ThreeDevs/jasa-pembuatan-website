import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../api/axios'; // Pastikan path axios benar
import { showSuccess, showError, showInfo } from '../utils/swal';

const TrackOrder = () => {
  const [form, setForm] = useState({ order_id: '', no_hp: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // STATE UNTUK ULASAN
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // --- 1. CEK STATUS ---
  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('/api/track-order', form);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order tidak ditemukan / Data salah.');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. BAYAR DP ---
  const handleBayarDP = () => {
    if (window.snap && result.snap_token) {
      window.snap.pay(result.snap_token, {
        onSuccess: function () {
          showSuccess("DP Berhasil! Project akan segera dikerjakan.");
          window.location.reload();
        },
        onPending: function () { showInfo("Menunggu pembayaran..."); },
        onError: function () { showError("Pembayaran Gagal."); }
      });
    }
  };

  // --- 3. PELUNASAN ---
  const handlePelunasan = async () => {
    try {
      const res = await axios.post('/api/pay-remaining', { order_id: result.order_id });
      if (window.snap) {
        window.snap.pay(res.data.token, {
          onSuccess: function () {
            showSuccess("Lunas! Terima kasih.");
            window.location.reload();
          },
          onPending: function () { showInfo("Menunggu pelunasan..."); },
          onError: function () { showError("Pelunasan Gagal."); }
        });
      }
    } catch (err) {
      showError("Gagal memproses pelunasan.");
    }
  };

  // --- 4. KIRIM ULASAN (BARU) ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return showError("Harap pilih bintang 1-5");

    setSubmittingReview(true);
    try {
      await axios.post('/api/testimonials', {
        order_id: result.order_id,
        rating: rating,
        isi_ulasan: reviewText
      });
      showSuccess("Terima kasih atas ulasan Anda! ⭐");
      setRating(0);
      setReviewText('');
      // Opsional: Disable form setelah review sukses
    } catch (error) {
      showError(error.response?.data?.message || "Gagal mengirim ulasan.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="max-w-xl w-full">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Lacak Pesanan</h1>
            <p className="text-gray-500">Masukkan Order ID dan No HP untuk melihat progres.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: PRJ-XXXXXX"
                  value={form.order_id}
                  onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="08..."
                  value={form.no_hp}
                  onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:bg-gray-400"
              >
                {loading ? "Mengecek..." : "Lacak Sekarang 🔍"}
              </button>
            </form>
            {error && <p className="text-red-500 text-center mt-4 text-sm bg-red-50 p-2 rounded border border-red-100">{error}</p>}
          </div>

          {result && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="bg-blue-600 p-6 text-white text-center">
                <p className="text-sm opacity-80 uppercase tracking-wider">Status Saat Ini</p>
                <h2 className="text-2xl font-bold mt-1 capitalize">{result.status_pembayaran.replace('_', ' ')}</h2>
              </div>

              <div className="p-6">

                {/* PROGRESS BAR */}
                <div className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex justify-between items-center">
                    <span>Progres Pengerjaan</span>
                    <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-xs">
                      {result.progress || 0}%
                    </span>
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out flex items-center justify-center relative"
                      style={{ width: `${result.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4 border-b pb-6 mb-6">
                  <div className="flex justify-between"><span className="text-gray-500">Pelanggan</span><span className="font-bold">{result.nama_pelanggan}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Paket</span><span className="font-bold">{result.paket_layanan}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-blue-600">Rp {parseInt(result.total_harga).toLocaleString('id-ID')}</span></div>
                </div>

                {/* TOMBOL BAYAR (Jika Belum Lunas) */}
                {result.status_pembayaran === 'belum_bayar' && (
                  <button onClick={handleBayarDP} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Bayar Sekarang</button>
                )}

                {result.status_pembayaran === 'dp_lunas' && (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                    <p className="text-sm text-orange-800 mb-3">Sisa Tagihan: <b>Rp {parseInt(result.sisa_tagihan).toLocaleString('id-ID')}</b></p>
                    <button onClick={handlePelunasan} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">Lunasi Sekarang 💳</button>
                  </div>
                )}

                {/* FORM REVIEW (Hanya Muncul Jika LUNAS) */}
                {result.status_pembayaran === 'lunas' && (
                  <div className="mt-4">
                    {/* Info Lunas */}
                    <div className="text-center bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                      {/* ... ikon centang ... */}
                      <p className="font-bold text-green-700">Project Selesai & Lunas</p>
                      <p className="text-xs text-green-600 mb-4">Terima kasih atas kepercayaan Anda!</p>

                      {/* 👇 TOMBOL DOWNLOAD ASET 👇 */}
                      {result.handover_file ? (
                        <a
                          href={`http://localhost:8000${result.handover_file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/20"
                        >
                          <i className="fa-solid fa-download"></i>
                          Download Aset Project
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400 italic border-t border-green-200 pt-2">
                          <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                          Menunggu Admin mengupload file aset...
                        </p>
                      )}
                    </div>
                    <div className="text-center bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <p className="font-bold text-green-700">Project Selesai & Lunas</p>
                      <p className="text-xs text-green-600">Terima kasih atas kepercayaan Anda!</p>
                    </div>

                    {/* AREA INPUT ULASAN */}
                    <div className="bg-white border-2 border-indigo-50 p-5 rounded-xl text-center">
                      <h3 className="font-bold text-gray-800 mb-2">Bagaimana pengalaman Anda?</h3>
                      <p className="text-xs text-gray-500 mb-4">Beri ulasan agar kami bisa berkembang lebih baik.</p>

                      <form onSubmit={handleSubmitReview}>
                        {/* BINTANG */}
                        <div className="flex justify-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <i className={`fa-solid fa-star text-2xl ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                            </button>
                          ))}
                        </div>

                        <textarea
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-3"
                          rows="3"
                          placeholder="Tulis ulasan Anda di sini..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        ></textarea>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
                        >
                          {submittingReview ? "Mengirim..." : "Kirim Ulasan ⭐"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

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