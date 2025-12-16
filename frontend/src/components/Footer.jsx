import React from 'react';
// Asumsi Font Awesome diimpor atau ditambahkan ke proyek Anda (misalnya melalui CDN atau paket)

// --- Data Struktur Tautan ---

const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Services", href: "#" },
    { name: "Portfolio", href: "#" },
    { name: "Contact", href: "#" },
];

const ourServices = [
    { name: "Basic", href: "#" },
    { name: "Pro", href: "#" },
    { name: "Advance", href: "#" },
];

const policyLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
];

const contactInfo = [
    {
        icon: "fa-solid fa-location-dot",
        content: (
            <>
                123 Business Street,<br />
                Jakarta 10110, Indonesia
            </>
        ),
        isLink: false
    },
    {
        icon: "fa-solid fa-phone",
        content: "+62 895368 757054",
        href: "tel:+62895368757054",
        isLink: true
    },
    {
        icon: "fa-solid fa-envelope",
        content: "info@threedevs.com",
        href: "mailto:info@threedevs.com",
        isLink: true
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Fungsi untuk kembali ke atas halaman
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Footer Content: 4 Columns */}
                <div className="py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

                        {/* 1. Brand Column */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-xl">
                                    TD
                                </div>
                                <span className="text-2xl font-bold text-gray-900">ThreeDevs</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Your perfect space between work and home. Creating meaningful experiences since 2020.
                            </p>

                            {/* Social Media (Tidak diubah karena sudah ringkas) */}
                            <div className="flex items-center gap-4 pt-4">
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300" aria-label="Twitter">
                                    <i className="fab fa-twitter text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300" aria-label="Instagram">
                                    <i className="fab fa-instagram text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300" aria-label="LinkedIn">
                                    <i className="fab fa-linkedin-in text-lg"></i>
                                </a>
                                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300" aria-label="Facebook">
                                    <i className="fab fa-facebook-f text-lg"></i>
                                </a>
                            </div>
                        </div>

                        {/* 2. Quick Links (Menggunakan .map) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
                            <ul className="space-y-4">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <i className="fa-solid fa-chevron-right text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 3. Services (Menggunakan .map) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Our Services</h3>
                            <ul className="space-y-4">
                                {ourServices.map((service) => (
                                    <li key={service.name}>
                                        <a
                                            href={service.href}
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <i className="fa-solid fa-circle text-[6px] text-indigo-400"></i>
                                            {service.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. Contact Info & Newsletter */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Get in Touch</h3>
                            <ul className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mt-1">
                                            <i className={item.icon + " text-xs"}></i>
                                        </div>
                                        {item.isLink ? (
                                            <a href={item.href} className="text-gray-600 hover:text-indigo-600 transition-colors">
                                                {item.content}
                                            </a>
                                        ) : (
                                            <span className="text-gray-600">
                                                {item.content}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Newsletter Subscription (Tidak diubah karena sudah ringkas) */}
                            <div className="mt-8">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Subscribe to Newsletter</h4>
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
        </footer >
    )
}