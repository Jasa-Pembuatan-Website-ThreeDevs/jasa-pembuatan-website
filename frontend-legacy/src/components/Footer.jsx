import React, { useRef, useEffect } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { NavHashLink as Link } from "react-router-hash-link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Asumsi Font Awesome diimpor atau ditambahkan ke proyek Anda (misalnya melalui CDN atau paket)

// --- Data Struktur Tautan ---

const quickLinks = [
    { name: "Home", to: "/#home" },
    { name: "About Us", to: "/#about" },
    { name: "Services", to: "/#services" },
    { name: "Portfolio", to: "/#portfolio" },
    { name: "FAQ", to: "/faq" },
    { name: "Terms", to: "/terms" },
    { name: "Privacy", to: "/privacy" },
    { name: "Contact", to: "/#contact" }
];

const ourServices = [
    { name: "Tiny", to: "/#services" },
    { name: "Medium", to: "/#services" },
    { name: "Pro+", to: "/#services" }
];

const policyLinks = [
    { name: "Privacy Policy", to: "/#" },
    { name: "Terms of Service", to: "/#" },
    { name: "Cookie Policy", to: "/#" }
];

const contactInfo = [
    {
        icon: "fa-solid fa-location-dot",
        content: (
            <>
                123 Business Street,
                <br />
                Jakarta 10110, Indonesia
            </>
        ),
        isLink: false
    },
    {
        icon: "fa-solid fa-phone",
        content: "+62 895368 757054",
        to: "tel:+62895368757054",
        isLink: true
    },
    {
        icon: "fa-solid fa-envelope",
        content: "info@threedevs.com",
        to: "mailto:info@threedevs.com",
        isLink: true
    }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    useSmoothScroll();

    const containerRef = useRef(null);
    const brandRef = useRef(null);
    const quickLinksRef = useRef(null);
    const servicesRef = useRef(null);
    const contactRef = useRef(null);
    const newsletterRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Brand section animation
            if (brandRef.current) {
                gsap.fromTo(
                    brandRef.current,
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
                );
            }

            // Quick links animation
            if (quickLinksRef.current?.children) {
                gsap.fromTo(
                    quickLinksRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        delay: 0.2
                    }
                );
            }

            // Services animation
            if (servicesRef.current?.children) {
                gsap.fromTo(
                    servicesRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        delay: 0.3
                    }
                );
            }

            // Contact info animation
            if (contactRef.current?.children) {
                gsap.fromTo(
                    contactRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power2.out",
                        delay: 0.4
                    }
                );
            }

            // Newsletter animation
            if (newsletterRef.current) {
                gsap.fromTo(
                    newsletterRef.current,
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)",
                        delay: 0.5
                    }
                );
            }

            // Bottom bar animation
            if (bottomRef.current) {
                gsap.fromTo(
                    bottomRef.current,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: 0.6
                    }
                );
            }

            // Floating animations for icons (only if elements exist)
            const floatingIcons = document.querySelectorAll(".floating-icon");
            if (floatingIcons.length > 0) {
                gsap.to(floatingIcons, {
                    y: -4,
                    duration: 3,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: Math.random() * 1
                });
            }

            // Scroll-triggered animations
            if (containerRef.current) {
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "top 80%",
                    animation: gsap.fromTo(
                        containerRef.current,
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
                    )
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Fungsi untuk kembali ke atas halaman
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer
            ref={containerRef}
            className="bg-white border-t border-gray-100"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content: 4 Columns */}
                <div className="py-8 sm:py-10 md:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                        {/* 1. Brand Column */}
                        <div ref={brandRef} className="space-y-4 sm:space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-lg sm:text-xl">
                                    TD
                                </div>
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                    ThreeDevs
                                </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                Kami Menyediakan Layanan Pengembangan Website
                                Profesional untuk Meningkatkan Bisnis Anda.
                            </p>

                            {/* Social Media (Tidak diubah karena sudah ringkas) */}
                            <div className="flex items-center gap-4 pt-4">
                                <Link
                                    to="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300"
                                    aria-label="Instagram"
                                >
                                    <i className="fab fa-instagram text-lg"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <i className="fab fa-linkedin-in text-lg"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300"
                                    aria-label="Tiktok"
                                >
                                    <i className="fab fa-tiktok text-lg"></i>
                                </Link>
                            </div>
                        </div>

                        {/* 2. Quick Links (Menggunakan .map) */}
                        <div ref={quickLinksRef}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                                Quick Links
                            </h3>
                            <ul className="space-y-4">
                                {quickLinks.map(link => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.to}
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <i className="fa-solid fa-chevron-right text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 3. Services (Menggunakan .map) */}
                        <div ref={servicesRef}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                                Our Services
                            </h3>
                            <ul className="space-y-4">
                                {ourServices.map(service => (
                                    <li key={service.name}>
                                        <Link
                                            to={service.to}
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <i className="fa-solid fa-circle text-[6px] text-indigo-400"></i>
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. Contact Info & Newsletter */}
                        <div ref={contactRef}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                                Get in Touch
                            </h3>
                            <ul className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mt-1">
                                            <i
                                                className={
                                                    item.icon + " text-xs"
                                                }
                                            ></i>
                                        </div>
                                        {item.isLink ? (
                                            <Link
                                                to={item.to}
                                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                                            >
                                                {item.content}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-600">
                                                {item.content}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Newsletter Subscription (Tidak diubah karena sudah ringkas) */}
                            <div ref={newsletterRef} className="mt-8">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Subscribe to Newsletter
                                </h4>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="flex-1 px-4 py-2.5 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-r-lg transition-colors text-sm font-medium">
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-100">
                    <div className="text-gray-500 text-sm">
                        &copy; {currentYear} ThreeDevs. All rights reserved.
                    </div>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 z-50"
                aria-label="Back to top"
            >
                <i className="fa-solid fa-chevron-up"></i>
            </button>
        </footer>
    );
}
