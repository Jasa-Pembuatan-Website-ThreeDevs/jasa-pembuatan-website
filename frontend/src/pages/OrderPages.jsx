import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OrderPage = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const trustRef = useRef(null);
  const formRef = useRef(null);
  const priceRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
      }

      // Badge animation
      if (badgeRef.current) {
        gsap.fromTo(badgeRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.2 }
        )
      }

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
        )
      }

      // Description animation
      if (descriptionRef.current) {
        gsap.fromTo(descriptionRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.4 }
        )
      }

      // Trust indicators animation
      if (trustRef.current?.children) {
        gsap.fromTo(trustRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.5 }
        )
      }

      // Form animation
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.7 }
        )
      }

      // Price animation
      if (priceRef.current) {
        gsap.fromTo(priceRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.9 }
        )
      }

      // Button animation
      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1 }
        )
      }

      // Floating animations (only if elements exist)
      const floatingElements = document.querySelectorAll('.floating-element');
      if (floatingElements.length > 0) {
        gsap.to(floatingElements, {
          y: -6,
          duration: 3,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 1
        })
      }

      // Scroll-triggered animations
      if (formRef.current) {
        ScrollTrigger.create({
          trigger: formRef.current,
          start: 'top 80%',
          animation: gsap.fromTo(formRef.current,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
          )
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

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

  // Beautiful Navbar Component matching existing design
  const Navbar = () => (
    <header className="fixed top-0 left-0 w-full z-[50] px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 bg-white shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-gray-800">
          ThreeDev
        </div>

        <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
          {[
            { icon: "fa-house", text: "Home", href: "/" },
            { icon: "fa-circle-info", text: "About", href: "/#about" },
            { icon: "fa-dollar", text: "Services", href: "/#services" },
            { icon: "fa-briefcase", text: "Portfolio", href: "/#portfolio" },
            { icon: "fa-envelope", text: "Contact", href: "/#contact" },
            { icon: "fa-shopping-cart", text: "Order", href: "#" }
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="group relative px-4 py-1 mx-1 rounded-full transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <i className={`fa-solid ${item.icon} text-xs text-gray-500 group-hover:text-indigo-600 transition-colors`}></i>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  {item.text}
                </span>
              </div>
              <div className="absolute inset-0 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
          ))}
        </nav>
      </div>
    </header>
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
        // Jika snap tidak tersedia, coba load script Midtrans
        console.log("Snap tidak tersedia, mencoba load script Midtrans...");
        
        // Load Midtrans Snap.js script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
        script.onload = () => {
          if (window.snap) {
            console.log("Midtrans Snap.js loaded successfully");
            window.snap.pay(snapToken, {
              onSuccess: function (result) {
                alert("Pembayaran Berhasil! Tim kami akan segera menghubungi Anda.");
                console.log(result);
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
          } else {
            alert("Gagal memuat sistem pembayaran. Silakan coba lagi nanti.");
          }
        };
        script.onerror = () => {
          alert("Gagal memuat script pembayaran. Silakan coba lagi nanti.");
        };
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Error details:", error.response?.data);
      
      // Tampilkan pesan error yang lebih spesifik
      if (error.response?.data?.message) {
        alert("Error: " + error.response.data.message);
      } else if (error.response?.status === 500) {
        alert("Server error. Silakan coba lagi nanti atau hubungi admin.");
      } else {
        // Jika backend tidak tersedia, gunakan mock payment
        console.log("Backend tidak tersedia, menggunakan mock payment...");
        handleMockPayment();
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock payment function for testing
  const handleMockPayment = () => {
    const mockOrderId = 'MOCK-' + Math.random().toString(36).substr(2, 9);
    
    // Simulate payment popup
    const mockPaymentResult = confirm(
      `Mock Payment System\n\n` +
      `Order ID: ${mockOrderId}\n` +
      `Paket: ${formData.paket}\n` +
      `Harga: Rp ${Number(formData.harga).toLocaleString('id-ID')}\n\n` +
      `Apakah pembayaran berhasil?`
    );

    if (mockPaymentResult) {
      alert(`Pembayaran Berhasil!\n\n` +
            `Order ID: ${mockOrderId}\n` +
            `Paket: ${formData.paket}\n` +
            `Harga: Rp ${Number(formData.harga).toLocaleString('id-ID')}\n\n` +
            `Tim kami akan segera menghubungi Anda.`);
    } else {
      alert("Pembayaran dibatalkan.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-50"></div>
          <div className="absolute top-40 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-50"></div>
          
          <div ref={containerRef} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-10">
            <div ref={headerRef} className="text-center mb-8">
              {/* Professional Badge */}
              <div ref={badgeRef} className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full mb-6 mx-auto floating-element">
                <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold">Proses Pemesanan Cepat & Aman</span>
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
              </div>
              
              <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Form Order Website
              </h2>
              <p ref={descriptionRef} className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Isi data Anda dan pilih paket yang sesuai. Tim kami akan segera menghubungi Anda untuk konfirmasi lebih lanjut.
              </p>
              
              {/* Trust Indicators */}
              <div ref={trustRef} className="flex items-center justify-center gap-8 mt-8">
                <div className="flex items-center gap-2 text-green-600">
                  <i className="fa-solid fa-shield-check"></i>
                  <span className="text-xs">Aman & Terpercaya</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <i className="fa-solid fa-bolt"></i>
                  <span className="text-xs">Proses Cepat</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <i className="fa-solid fa-comments"></i>
                  <span className="text-xs">Dukungan 24/7</span>
                </div>
              </div>
            </div>

          <form ref={formRef} onSubmit={handleCheckout} className="space-y-6">
            
            {/* Input Nama */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-user text-gray-400"></i>
                </div>
                <input
                  type="text"
                  name="nama"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300"
                  placeholder="Masukkan nama lengkap Anda"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300"
                  placeholder="contoh@email.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input No HP */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">No. WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-brands fa-whatsapp text-gray-400"></i>
                </div>
                <input
                  type="tel"
                  name="no_hp"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300"
                  placeholder="+62 812 3456 7890"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Pilih Paket */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Paket</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-box text-xs"></i>
                  </div>
                </div>
                <select
                  name="paket"
                  className="w-full pl-14 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-300 appearance-none bg-white"
                  onChange={handlePaketChange}
                >
                  {listPaket.map((p) => (
                    <option key={p.nama} value={p.nama}>
                      {p.nama} - Rp {p.harga.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-tags text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Tampilan Total Harga */}
            <div ref={priceRef} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-receipt text-white text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 font-semibold">Total Tagihan</span>
                    <p className="text-xs text-gray-500">Termasuk semua fitur paket</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <i className="fa-solid fa-check text-green-600 mr-1"></i>
                        Harga Final
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <i className="fa-solid fa-shield-alt text-blue-600 mr-1"></i>
                        Tanpa Biaya Tersembunyi
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-coins text-sm"></i>
                    </div>
                    <div>
                      <span className="text-3xl font-extrabold text-gray-900">
                        Rp {Number(formData.harga).toLocaleString("id-ID")}
                      </span>
                      <p className="text-xs text-gray-500">Harga final</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Bayar */}
            <div ref={buttonRef} className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl"}`}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${loading ? 'bg-gray-300' : 'bg-white/20'}`}>
                    <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-credit-card"}`}></i>
                  </div>
                  <span className="text-xl font-bold">{loading ? "Memproses..." : "Bayar Sekarang"}</span>
                  {!loading && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                  )}
                </div>
                {!loading && (
                  <div className="text-xs opacity-90 mt-2 flex items-center justify-center gap-4">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-shield-check text-green-300"></i>
                      <span>Proses pembayaran aman</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-bolt text-blue-300"></i>
                      <span>Proses cepat</span>
                    </span>
                  </div>
                )}
              </button>
              
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                  <i className="fa-solid fa-shield-check text-green-500"></i>
                  <span>Aman & Terpercaya</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                  <i className="fa-solid fa-lock text-blue-500"></i>
                  <span>Enkripsi SSL</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-full">
                  <i className="fa-solid fa-credit-card text-purple-500"></i>
                  <span>Multi Payment</span>
                </div>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;