import React, { useEffect, useState } from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    useSmoothScroll();

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[50] px-6 py-4 transition-all duration-300
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
        >
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold tracking-wide text-gray-800">
                    ThreeDev
                </div>

                <nav className="hidden md:flex items-center space-x-6">

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
                    <a
                        href="/order"
                        className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20">
                            <i className="fa-solid fa-cart-shopping text-xs"></i>
                        </div>
                        <span className="font-semibold text-sm">Pesan Sekarang</span>
                        <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </nav>

                <button className="md:hidden text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
