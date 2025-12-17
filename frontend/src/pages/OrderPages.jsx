import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderPage = () => {
  // State untuk form
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    paket: "Paket Tiny", // Default value
    harga: 299000, // Harga default
  });

  // State untuk loading
  const [loading, setLoading] = useState(false);

  // Daftar Paket (Bisa juga ambil dari API)
  const listPaket = [
    { nama: "Paket Tiny", harga: 299000 },
    { nama: "Paket Medium", harga: 699000 },
    { nama: "Paket Pro+", harga: 1499000 },
  ];

  // Handle ganti input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle ganti paket (otomatis update harga)
  const handlePaketChange = (e) => {
    const selectedPaket = listPaket.find((p) => p.nama === e.target.value);
    setFormData({
      ...formData,
      paket: selectedPaket.nama,
      harga: selectedPaket.harga,
    });
  };

  // Navbar Component
  const Navbar = () => (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">ThreeDevs</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
              Beranda
            </Link>
            <Link to="/order" className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
              Order Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );

  // === FUNGSI UTAMA BAYAR ===
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Kirim data ke Laravel
      // Pastikan URL API sesuai dengan backend kalian
      const response = await axios.post("http://localhost:8000/api/payment", {
        ...formData,
        harga: Number(formData.harga) // Pastikan harga dikirim sebagai number
      });
      
      console.log("API Response:", response.data);
      
      const snapToken = response.data.token;

      // 2. Munculkan Popup Midtrans
      if (window.snap) {
        // Check if this is a mock token (using the is_mock flag from backend)
        if (response.data.is_mock) {
          // This is a mock token, show a message instead of trying to use it
          alert("Payment system is in test mode. Order created successfully! Order ID: " + response.data.redirect_url.split('/').pop());
          console.log("Mock payment token (not real):", snapToken);
        } else {
          // This should be a real Midtrans token
          window.snap.pay(snapToken, {
            onSuccess: function (result) {
              alert("Pembayaran Berhasil! Tim kami akan segera menghubungi Anda.");
              console.log(result);
              // Disini bisa redirect ke halaman "Success Page"
              // window.location.href = "/sukses";
            },
            onPending: function (result) {
              alert("Menunggu Pembayaran...");
              console.log(result);
            },
            onError: function (result) {
              alert("Pembayaran Gagal/Dibatalkan.");
              console.log(result);
            },
            onClose: function () {
              alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
            },
          });
        }
      } else {
        // Jika snap tidak tersedia (untuk testing)
        alert("Snap tidak tersedia. Token: " + snapToken);
        console.log("Mock payment token:", snapToken);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memproses order. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-10 px-4">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Form Order Website
          </h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Budi Santoso"
                onChange={handleChange}
              />
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="budi@email.com"
                onChange={handleChange}
              />
            </div>

            {/* Input No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700">No. WhatsApp</label>
              <input
                type="number"
                name="no_hp"
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="08123456789"
                onChange={handleChange}
              />
            </div>

            {/* Pilih Paket */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pilih Paket</label>
              <select
                name="paket"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                onChange={handlePaketChange}
              >
                {listPaket.map((p) => (
                  <option key={p.nama} value={p.nama}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tampilan Total Harga */}
            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
              <span className="text-blue-700 font-medium">Total Tagihan:</span>
              <span className="text-xl font-bold text-blue-800">
                Rp {Number(formData.harga).toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol Bayar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-200 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"}`}
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;