import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Tambahkan ini
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    useSmoothScroll();

    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Logo animation
            if (logoRef.current) {
                gsap.fromTo(logoRef.current,
                    { opacity: 0, scale: 0.8, x: -30 },
                    { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'back.out(2.5)' }
                )

                // Floating animation for logo
                gsap.to(logoRef.current, {
                    y: -3,
                    duration: 3,
                    ease: 'power1.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: Math.random() * 1
                })
            }

            // Navigation animation
            if (navRef.current?.children) {
                gsap.fromTo(navRef.current.children,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
                )
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header ref={containerRef}
            className={`fixed top-0 left-0 w-full z-[50] px-4 sm:px-6 py-3 sm:py-4 transition-all duration-500
        ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm"}`}
        >
            <div className="flex justify-between items-center">
                {/* Logo dengan Link ke Home */}
                <Link to="/" ref={logoRef} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                        <span className="text-white font-bold text-lg">TD</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            ThreeDev
                        </span>
                        <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    </div>
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>

                <nav ref={navRef} className="hidden md:flex items-center">
                    {[
                        { icon: "fa-house", text: "Home", link: "/#" },
                        { icon: "fa-circle-info", text: "About", link: "#about" },
                        { icon: "fa-dollar", text: "Services", link: "#services" },
                        { icon: "fa-briefcase", text: "Portfolio", link: "#portfolio" },
                        { icon: "fa-comment", text: "Testimonials", link: "#testimonials" },
                        { icon: "fa-envelope", text: "Contact", link: "#contact" },
                        
                    ].map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
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

                    {/* CTA Button */}
                    <Link to="/order" className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-1.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                        <div className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center rounded-full bg-white/20">
                            <i className="fa-solid fa-cart-shopping text-xs"></i>
                        </div>
                        <span className="font-semibold text-sm">Pesan Sekarang</span>
                        <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </nav>

                {/* Mobile menu */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="py-4 px-4 space-y-4">
                        {[
                            { icon: "fa-house", text: "Home" },
                            { icon: "fa-circle-info", text: "About" },
                            { icon: "fa-dollar", text: "Services" },
                            { icon: "fa-briefcase", text: "Portfolio" },
                            { icon: "fa-envelope", text: "Contact" }
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={`#${item.text.toLowerCase()}`}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className={`fa-solid ${item.icon} text-indigo-600`}></i>
                                <span className="text-gray-700 font-medium">{item.text}</span>
                            </a>
                        ))}
                        <a
                            href="/order"
                            className="flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:bg-indigo-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="font-semibold">Pesan Sekarang</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
