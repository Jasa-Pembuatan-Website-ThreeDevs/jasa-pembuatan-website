import React, { useState } from "react";
import axios from "axios";

const OrderPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    paket: "Landing Page",
    harga: 1500000,
  });

  const [loading, setLoading] = useState(false);

  const listPaket = [
    { nama: "Landing Page", harga: 1500000 },
    { nama: "Company Profile", harga: 3500000 },
    { nama: "Toko Online", harga: 5000000 },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaketChange = (e) => {
    const selectedPaket = listPaket.find((p) => p.nama === e.target.value);
    setFormData({
      ...formData,
      paket: selectedPaket.nama,
      harga: selectedPaket.harga,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/payment", formData);
      const snapToken = response.data.token;

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => alert("Pembayaran Berhasil!"),
          onPending: () => alert("Menunggu Pembayaran..."),
          onError: () => alert("Pembayaran Gagal."),
          onClose: () => alert("Popup ditutup sebelum pembayaran."),
        });
      }
    } catch (error) {
      console.error(error);
      alert("Gagal memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Pesan Website
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Isi data di bawah untuk melanjutkan ke pembayaran.
        </p>

        <form onSubmit={handleCheckout} className="space-y-5">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Contoh: Budi Santoso"
              onChange={handleChange}
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="budi@email.com"
              onChange={handleChange}
            />
          </div>

          {/* Input No HP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              No. WhatsApp
            </label>
            <input
              type="number"
              name="no_hp"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="08123456789"
              onChange={handleChange}
            />
          </div>

          {/* Pilih Paket */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pilih Paket
            </label>
            <select
              name="paket"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              onChange={handlePaketChange}
              value={formData.paket}
            >
              {listPaket.map((p) => (
                <option key={p.nama} value={p.nama}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Total Harga */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
            <span className="text-blue-700 font-semibold">Total Tagihan</span>
            <span className="text-2xl font-bold text-blue-800">
              Rp {formData.harga.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Tombol Bayar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-lg shadow-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </form>

      
      </div>
    </div>
  );
};

export default OrderPage;
