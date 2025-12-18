import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const TrackOrder = () => {
  const [form, setForm] = useState({ order_id: '', no_hp: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:8000/api/track-order', form);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
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
                  placeholder="Contoh: TRX-12345"
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
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-green-500 animate-fade-in-up">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{result.paket}</h3>
                  <p className="text-sm text-gray-500">Dipesan tanggal: {result.created_at}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.status_pembayaran === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.status_pembayaran === 'paid' ? 'LUNAS' : 'PENDING'}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Halo, {result.nama}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Pesanan kamu sedang dalam proses. Silakan hubungi admin jika butuh update lebih lanjut.
                  </p>
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