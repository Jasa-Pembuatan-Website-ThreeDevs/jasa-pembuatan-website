import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqData = [
    {
        question: "Berapa lama waktu pengerjaan website?",
        answer: "Waktu pengerjaan tergantung pada kompleksitas proyek. Untuk website landing page sederhana, estimasi pengerjaan adalah 3-5 hari kerja. Untuk website company profile, estimasi pengerjaan adalah 7-10 hari kerja. Dan untuk website toko online, estimasi pengerjaan adalah 10-14 hari kerja."
    },
    {
        question: "Apakah website yang dibuat responsif?",
        answer: "Ya, semua website yang kami buat sudah responsif dan dapat menyesuaikan dengan berbagai ukuran layar, mulai dari smartphone, tablet, hingga desktop."
    },
    {
        question: "Apakah termasuk hosting dan domain?",
        answer: "Biaya hosting dan domain tidak termasuk dalam paket yang kami tawarkan. Anda perlu membeli hosting dan domain secara terpisah. Namun, kami dapat membantu Anda dalam memilih dan mengatur hosting serta domain yang sesuai."
    },
    {
        question: "Apakah ada garansi atau maintenance setelah website selesai?",
        answer: "Kami memberikan garansi perbaikan bug selama 1 bulan setelah website selesai. Untuk maintenance lebih lanjut, kami menawarkan paket maintenance bulanan dengan berbagai fitur seperti backup data, update keamanan, dan perbaikan bug."
    },
    {
        question: "Bisakah saya mengubah desain website setelah selesai?",
        answer: "Anda dapat melakukan perubahan desain selama proses pengerjaan. Namun, setelah website selesai dan diserahkan kepada Anda, perubahan desain akan dikenakan biaya tambahan tergantung pada kompleksitas perubahan yang diminta."
    },
    {
        question: "Apakah website yang dibuat SEO-friendly?",
        answer: "Ya, semua website yang kami buat sudah dioptimalkan untuk SEO dasar seperti struktur HTML yang baik, kecepatan loading, dan meta tag yang sesuai. Untuk optimasi SEO lebih lanjut, kami juga menawarkan layanan SEO khusus."
    },
    {
        question: "Metode pembayaran seperti apa yang Anda terima?",
        answer: "Kami menerima pembayaran melalui transfer bank dan dompet digital. Untuk proyek besar, kami menawarkan sistem pembayaran bertahap (DP 50% di awal, 30% saat progress 50%, dan 20% setelah selesai)."
    },
    {
        question: "Apakah saya akan mendapatkan pelatihan untuk mengelola website?",
        answer: "Ya, kami menyediakan pelatihan dasar pengelolaan website selama 1-2 jam secara gratis. Anda akan belajar cara mengupdate konten, menambah produk, dan mengelola fitur-fitur dasar website."
    }
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);
    
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const badgeRef = useRef(null);
    const titleRef = useRef(null);
    const faqsRef = useRef(null);
    const ctaRef = useRef(null);

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

            // FAQ items animation
            gsap.fromTo(faqsRef.current?.children,
                { opacity: 0, y: 50, scale: 0.98 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 1, 
                    stagger: 0.2, 
                    ease: 'power3.out', 
                    delay: 0.5,
                    onComplete: () => {
                        // Add hover animations to FAQ items
                        gsap.utils.toArray(faqsRef.current?.children).forEach((item) => {
                            item.addEventListener('mouseenter', () => {
                                gsap.to(item, { y: -5, duration: 0.3, ease: 'power2.out' })
                            })
                            item.addEventListener('mouseleave', () => {
                                gsap.to(item, { y: 0, duration: 0.3, ease: 'power2.out' })
                            })
                        })
                    }
                }
            )

            // CTA section animation
            gsap.fromTo(ctaRef.current,
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 }
            )

            // Floating animations
            gsap.to('.floating-element', {
                y: -6,
                duration: 3,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 1
            })

            // Scroll-triggered animations
            ScrollTrigger.create({
                trigger: faqsRef.current,
                start: 'top 80%',
                animation: gsap.fromTo(faqsRef.current?.children,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
                )
            })

            ScrollTrigger.create({
                trigger: ctaRef.current,
                start: 'top 85%',
                animation: gsap.fromTo(ctaRef.current,
                    { opacity: 0, y: 60 },
                    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
                )
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" ref={containerRef} className="min-h-screen bg-white font-sans overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full translate-y-48 -translate-x-48"></div>

            <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
<div ref={headerRef} className="max-w-4xl mx-auto">
                {/* Professional Badge */}
                <div ref={badgeRef} className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full mb-8 mx-auto floating-element">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold">Butuh Bantuan? Temukan Jawabannya di Sini</span>
                    <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                </div>

                <h1 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6 text-center">
                        Pertanyaan yang <span className="text-indigo-600">Sering Diajukan</span>
                    </h1>

                    <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12 mx-auto"></div>                    <div ref={faqsRef} className="space-y-4">
                        {faqData.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-200">
                                <button
                                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            <i className="fa-solid fa-question text-sm"></i>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {item.question}
                                        </span>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        <i className={`fa-solid ${openIndex === index ? 'fa-minus' : 'fa-plus'} text-sm`}></i>
                                    </div>
                                </button>
                                <div className={`px-6 pb-6 transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="pt-2 pb-4 text-gray-600 leading-relaxed">
                                        {item.answer}
                                    </div>
                                    {openIndex === index && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-gray-500">Jawaban lengkap tersedia</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                                                <span className="text-xs text-gray-500">Butuh bantuan lebih?</span>
                                                <a href="/#contact" className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold">Hubungi Kami</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div ref={ctaRef} className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Masih memiliki pertanyaan?</h3>
                            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                                Jangan ragu untuk menghubungi kami. Tim support kami siap membantu Anda 24/7 dengan respons cepat dan solusi profesional.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="/#contact" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    <span className="flex items-center justify-center gap-3">
                                        <i className="fa-solid fa-headset"></i>
                                        <span>Hubungi Support</span>
                                    </span>
                                </a>
                                <a href="/order" className="flex items-center justify-center gap-3 border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white font-bold py-4 px-8 rounded-full transition-all duration-300">
                                    <i className="fa-solid fa-shopping-cart"></i>
                                    <span>Pesan Sekarang</span>
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-clock text-indigo-500"></i>
                                    <span>Respon cepat 24/7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-comments text-purple-500"></i>
                                    <span>Konsultasi gratis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-shield-alt text-green-500"></i>
                                    <span>Garansi kepuasan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}