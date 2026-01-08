import React, { useRef, useEffect } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. DATA PAKET DIUPDATE (HARGA PASAR OPTIMAL)
const packages = [
  {
    name: "Paket Basic",
    badge: "STARTER KIT",
    paymentType: "BAYAR SEKALI SAJA",
    price: "Rp 999.000", // Naik dikit biar kesan premium, tapi masih under 1jt
    originalPrice: "Rp 1.800.000",
    unit: "Sekali Bayar",
    desc: "Website profil ringkas. Bayar sekali, jadi hak milik selamanya. Cocok untuk branding awal.",
    features: [
      "Landing Page (Single Page)",
      "Gratis Domain .my.id / .biz.id",
      "Hosting Cloud 1GB (Cukup 500 Foto)",
      "Desain Responsif (Mobile Friendly)",
      "Tombol Chat WhatsApp",
      "SSL Security (Gembok Hijau)",
      "Gratis Setup Google Maps (Bonus)",
    ],
    highlight: false,
  },
  {
    name: "Paket Bisnis",
    badge: "BEST SELLER",
    paymentType: "BERLANGGANAN (TERIMA BERES)",
    price: "Rp 299.000", // Naik ke 299rb biar aman buat cover domain .com & tenaga revisi
    originalPrice: "Rp 600.000",
    unit: "/bulan",
    desc: "Solusi bebas ribet. Kami yang update foto, ganti teks, & pastikan web selalu online 24 jam.",
    features: [
      "Semua fitur Paket Basic",
      "5-7 Halaman (Home, About, Layanan, dll)",
      "Gratis Domain .COM (Premium)",
      "Hosting Unlimited Bandwidth",
      "Akun Email Bisnis (info@nama.com)",
      "Gratis Request Update/Revisi Bulanan",
      "Prioritas Support VIP",
    ],
    highlight: true,
  },
  {
    name: "Paket Toko",
    badge: "E-COMMERCE",
    paymentType: "BERLANGGANAN (SULTAN)",
    price: "Rp 599.000", // E-commerce butuh resource server gede, 599rb harga wajar.
    originalPrice: "Rp 1.200.000",
    unit: "/bulan",
    desc: "Toko online canggih dengan fitur keranjang belanja, hitung ongkir otomatis, & payment gateway.",
    features: [
      "Semua fitur Paket Bisnis",
      "Unlimited Upload Produk",
      "Server High Performance (VPS)",
      "Fitur Keranjang Belanja & Checkout",
      "Integrasi Ongkir (JNE, J&T, SiCepat)",
      "Laporan Penunjung Bulanan",
      "Bantuan Upload Produk Awal",
    ],
    highlight: false,
  },
];

export default function Services() {
  useSmoothScroll();
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const packagesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      // Badge animation
      gsap.fromTo(badgeRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.2 }
      )

      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      )

      // Description animation
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.4 }
      )

      // Packages animation
      gsap.fromTo(packagesRef.current?.children,
        { opacity: 0, y: 50, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1, 
          stagger: 0.3, 
          ease: 'power3.out', 
          delay: 0.6,
          onComplete: () => {
            gsap.utils.toArray(packagesRef.current?.children).forEach((card) => {
              card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' })
              })
              card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' })
              })
            })
          }
        }
      )

      gsap.to('.floating-badge', {
        y: -6,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1
      })

      ScrollTrigger.create({
        trigger: packagesRef.current,
        start: 'top 80%',
        animation: gsap.fromTo(packagesRef.current?.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power3.out' }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={containerRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-12 sm:mb-16">
          <div ref={badgeRef} className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full mb-8 mx-auto floating-badge">
            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Solusi Digital UMKM Indonesia</span>
            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
          </div>
          
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Pilihan Paket <span className="text-indigo-600">Hemat</span>
          </h2>
          <p ref={descriptionRef} className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Investasi terbaik untuk bisnis Anda. Harga transparan, tanpa biaya tersembunyi.
          </p>
        </div>

        <div ref={packagesRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-3xl h-fit p-8 transition-all duration-500 transform hover:-translate-y-3 flex flex-col relative
                ${
                  pkg.highlight
                    ? "border-2 border-indigo-500 shadow-2xl bg-white scale-105 z-10"
                    : "border border-gray-100 shadow-xl hover:shadow-2xl bg-white"
                }`}
            >
              {pkg.highlight && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 -z-10"></div>
              )}
              
              {pkg.badge && (
                <div
                  className={`inline-block px-4 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm w-fit
                    ${
                      pkg.highlight
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                >
                  {pkg.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2 text-gray-800">{pkg.name}</h3>
              
              <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 border-b border-dashed border-gray-200 pb-4">
                {pkg.paymentType}
              </div>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed min-h-[60px]">
                {pkg.desc}
              </p>

              <div className="mb-8">
                <span className="text-gray-400 text-sm line-through block mb-1">
                    {pkg.originalPrice}
                </span>
                <div className="flex items-baseline flex-wrap">
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">
                    {pkg.price}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm font-medium">
                    {pkg.unit}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((f, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 group">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300
                      ${pkg.highlight ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      <i className="fa-solid fa-check text-xs"></i>
                    </div>
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/order"
                className={`block w-full text-center font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl
                  ${pkg.highlight 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' 
                    : 'bg-white border-2 border-indigo-100 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-whatsapp"></i>
                  <span>Pilih Paket Ini</span>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}