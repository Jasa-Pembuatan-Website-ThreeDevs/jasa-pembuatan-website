import React, { useRef, useEffect } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: "Paket Tiny",
    badge: "Paling Populer",
    price: "Rp 299",
    desc: "Solusi ideal untuk bisnis kecil dan pemula yang ingin memulai dengan biaya terjangkau.",
    features: [
      "Website Responsif",
      "5 Halaman Website",
      "Hosting 1GB",
      "Support 24/7",
      "SSL Certificate",
      "Revisi Desain 2 Kali",
    ],
    highlight: false,
  },
  {
    name: "Paket Medium",
    badge: "TERLARIS",
    price: "Rp 699",
    desc: "Solusi lengkap untuk bisnis menengah dengan fitur advanced dan performa optimal.",
    features: [
      "Semua fitur Paket Tiny",
      "15 Halaman Website",
      "Hosting 5GB SSD",
      "Email Profesional",
      "Analytics Dashboard",
      "Integrasi E-commerce",
      "Revisi Desain 2 Kali",
    ],
    highlight: true,
  },
  {
    name: "Paket Pro+",
    badge: "",
    price: "Rp 1.499",
    desc: "Solusi premium untuk perusahaan besar dengan kebutuhan kompleks dan skalabilitas tinggi.",
    features: [
      "Semua fitur Paket Pro",
      "Unlimited Halaman",
      "Hosting 20GB SSD",
      "CDN Global",
      "Priority Support",
      "Custom Development",
      "Dedicated Account Manager",
      "Revisi Desain 2 Kali",
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
            // Add hover animations to packages
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

      // Floating animations for badges
      gsap.to('.floating-badge', {
        y: -6,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1
      })

      // Scroll-triggered animations
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
          {/* Professional Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full mb-8 mx-auto floating-badge">
            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Layanan Profesional Berkualitas</span>
            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
          </div>
          
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Jasa <span className="text-indigo-600">Kami</span>
          </h2>
          <p ref={descriptionRef} className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Semua paket dilengkapi dengan fitur premium dan dukungan teknis profesional.
          </p>
        </div>

        <div ref={packagesRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-3xl h-fit md:h-[1000px] lg:h-[700px] p-8 transition-all duration-500 transform hover:-translate-y-3
                ${
                  pkg.highlight
                    ? "border-2 border-indigo-500 shadow-2xl relative bg-white"
                    : "border border-gray-100 shadow-xl hover:shadow-2xl bg-white"
                }`}
            >
              {/* Highlight Glow Effect */}
              {pkg.highlight && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 -z-10"></div>
              )}
              
              {pkg.badge && (
                <div
                  className={`inline-block px-6 py-2 mb-6 text-sm font-bold rounded-full shadow-lg
                    ${
                      pkg.highlight
                        ? "absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-bl-3xl transform hover:scale-105"
                        : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 transform hover:scale-105"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-star text-xs"></i>
                    <span>{pkg.badge}</span>
                    <i className="fa-solid fa-star text-xs"></i>
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
              <p className="text-gray-600 mb-8">{pkg.desc}</p>

              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-bold">{pkg.price}</span>
                <span className="text-gray-500 ml-2">.000 /bulan</span>
              </div>

              <ul className="space-y-4 mb-10">
                {pkg.features.map((f, idx) => (
                  <li key={idx} className="flex items-start text-gray-700 group">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <i className="fa-solid fa-check text-xs"></i>
                    </div>
                    <span className="text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/order"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-3">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>Pilih Paket</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
