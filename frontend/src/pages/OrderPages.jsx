import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "../api/axios"; // Pastikan path axios benar
import { useNavigate } from "react-router-dom";
import { showInfo, showError, showWarning } from "../utils/swal";

const OrderPages = () => {
  const navigate = useNavigate();

  // --- DATA PAKET DENGAN HARGA CORET (ALA HOSTINGER) ---
  const packages = [
    {
      id: "basic",
      name: "Paket Basic",
      price: 999000, // Naik dikit biar kesan premium, tapi masih under 1jt
      originalPrice: 1800000, // HARGA CORET (PURA-PURA MAHAL)
      features: [
        "Landing Page (Single Page)",
        "Gratis Domain .my.id / .biz.id",
        "Hosting Cloud 1GB (Cukup 500 Foto)",
        "Desain Responsif (Mobile Friendly)",
        "Tombol Chat WhatsApp",
        "SSL Security (Gembok Hijau)",
        "Gratis Setup Google Maps (Bonus)",
      ],
    },
    {
      id: "bisnis",
      name: "Paket Bisnis",
      price: 299000,
      originalPrice: 600000,
      features: [
        "5-7 Halaman (Home, About, Layanan, dll)",
        "Gratis Domain .COM (Premium)",
        "Hosting Unlimited Bandwidth",
        "Akun Email Bisnis (info@nama.com)",
        "Gratis Request Update/Revisi Bulanan",
        "Prioritas Support VIP",
      ]
    },
    {
      id: "toko",
      name: "Paket Toko",
      price: 599000,
      originalPrice: 1200000,
      features: [
        "Unlimited Upload Produk",
        "Server High Performance (VPS)",
        "Fitur Keranjang Belanja & Checkout",
        "Integrasi Ongkir (JNE, J&T, SiCepat)",
        "Laporan Penunjung Bulanan",
        "Bantuan Upload Produk Awal",
      ]
    },
  ];

  const [selectedPaket, setSelectedPaket] = useState(packages[0]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    confirmEmail: "",
    catatan: "",
  });
  const [loading, setLoading] = useState(false);

  // Hitung Diskon (Untuk Tampilan Badge "Hemat 60%")
  const hitungHemat = (asli, promo) => {
    return Math.round(((asli - promo) / asli) * 100);
  };

  // Submit Order
  const handleOrder = async (e) => {
    e.preventDefault();

    // --- 1. VALIDASI DI AWAL (PENTING!) ---
    // Cek dulu sebelum loading atau request ke backend
    if (formData.email !== formData.confirmEmail) {
      showError("Email dan Konfirmasi Email tidak sama!");
      return; // Stop di sini, jangan lanjut
    }
    // -------------------------------------

    setLoading(true);

    try {
      // Request Token ke Backend
      const response = await axios.post("/api/payment", {
        nama: formData.nama,
        email: formData.email,
        no_hp: formData.no_hp,
        paket: selectedPaket.name,
        harga: selectedPaket.price
      });

      const snapToken = response.data.token;

      // Tampilkan Popup Midtrans
      if (window.snap) {
        window.snap.pay(snapToken, {
          // === PERBAIKAN DI SINI ===
          onSuccess: function (result) {
            // Gabungkan data dari Midtrans + Data Form Inputan User
            const combinedData = {
              ...result,                       // Ambil Order ID & Status dari Midtrans
              nama_pelanggan: formData.nama,   // Ambil Nama dari Input Form
              paket: selectedPaket.name,       // Ambil Paket yang dipilih
              total_harga: selectedPaket.price // Ambil Harga yang dipilih
            };

            // Kirim paket data lengkap ini ke halaman success
            navigate('/order-success', { state: { order: combinedData } });
          },
          // =========================

          onPending: function (result) {
            showInfo("Menunggu Pembayaran...");
          },
          onError: function (result) {
            showError("Pembayaran Gagal!");
          },
          onClose: async function () {
            showWarning("Pembayaran belum diselesaikan.");
          }
        });
      }

    } catch (error) {
      console.error("Error saat membuat order:", error);
      // Tampilkan error dari backend jika ada
      const errMsg = error.response?.data?.message || "Terjadi kesalahan saat memproses order.";
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Formulir Pemesanan</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* === KIRI: FORM DATA DIRI === */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-700">1. Data Pemesan</h2>
                <form onSubmit={handleOrder} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Masukkan Nama Lengkap"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Masukkan Email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Email</label>
                      <input
                        type="email"
                        required
                        onPaste={(e) => e.preventDefault()} // Biar gak bisa copas (maksa ketik ulang)
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.confirmEmail}
                        onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
                        placeholder="Ketik ulang email..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label>
                    <input
                      type="tel"
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                      placeholder="Masukkan No WhatsApp"
                    />
                  </div>

                  <div className="pt-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">2. Pilih Paket Promo</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPaket(pkg)}
                          className={`cursor-pointer border-2 rounded-xl p-4 flex justify-between items-center transition-all ${selectedPaket.id === pkg.id
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaket.id === pkg.id ? 'border-blue-600' : 'border-gray-400'}`}>
                              {selectedPaket.id === pkg.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                            </div>
                            <div>
                              <span className="font-bold text-gray-800 block">{pkg.name}</span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                                Hemat {hitungHemat(pkg.originalPrice, pkg.price)}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs text-gray-400 line-through">Rp {pkg.originalPrice.toLocaleString('id-ID')}</span>
                            <span className="block font-bold text-blue-700">Rp {pkg.price.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* === KANAN: ORDER SUMMARY (ALA HOSTINGER) === */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">

                <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-4 text-center">
                  <p className="text-red-600 font-bold text-sm">🔥 Penawaran Terbatas!</p>
                  <p className="text-xs text-red-500">Harga akan naik kembali besok.</p>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Ringkasan Pesanan</h3>

                <div className="mb-4">
                  <span className="text-gray-500 text-sm">Paket Dipilih:</span>
                  <div className="font-bold text-xl text-gray-800">{selectedPaket.name}</div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Harga Normal</span>
                    <span className="line-through decoration-red-500">Rp {selectedPaket.originalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                    <span>Diskon Kamu ({hitungHemat(selectedPaket.originalPrice, selectedPaket.price)}%)</span>
                    <span>- Rp {(selectedPaket.originalPrice - selectedPaket.price).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <ul className="mb-6 space-y-2 bg-gray-50 p-4 rounded-lg">
                  {selectedPaket.features.map((f, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Bayar</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">Rp {selectedPaket.price.toLocaleString('id-ID')}</div>
                      <div className="text-xs text-gray-400 line-through">Rp {selectedPaket.originalPrice.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                  {loading ? "Memproses..." : "Ambil Promo Sekarang ⚡"}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                  🔒 Pembayaran Aman & Terverifikasi
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPages;