import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 px-6">
      {/* Container dengan Gradient Background */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
        
        {/* Dekorasi Bulatan (Biar gak flat) */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
          Punya Ide Liar? Yuk Wujudkan!
        </h2>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
          Jangan biarkan idemu menguap begitu saja. Mari diskusi santai dan ubah ide itu menjadi website yang menghasilkan cuan.
        </p>

        {/* Tombol yang Menonjol */}
        <div className="relative z-10 flex flex-col md:flex-row justify-center gap-4">
          <Link 
            to="/order" 
            className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Mulai Proyek Sekarang
          </Link>
          <a 
            href="https://wa.me/62895368757054" // Ganti nomor WA kalian
            target="_blank"
            className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-blue-700 transition-all duration-300"
          >
            Konsultasi Gratis
          </a>
        </div>

      </div>
    </section>
  );
};

export default CTASection;