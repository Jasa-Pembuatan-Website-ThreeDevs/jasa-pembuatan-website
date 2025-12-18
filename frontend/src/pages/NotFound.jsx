import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-16">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-32 translate-x-32 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full translate-y-48 -translate-x-48 opacity-70"></div>
      
      <div className="max-w-4xl w-full text-center relative z-10">
        
        {/* Error Icon - menggunakan emoji/HTML */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-40 h-40 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center shadow-xl">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-6xl text-indigo-600">⚠️</span>
                {/* atau gunakan SVG sederhana */}
                {/* <div className="text-6xl text-indigo-600">!</div> */}
              </div>
            </div>
            
            {/* Animated circles */}
            <div className="absolute -top-4 -left-4 w-48 h-48 border-2 border-indigo-200 rounded-full animate-pulse"></div>
            <div className="absolute -top-8 -left-8 w-56 h-56 border-2 border-blue-100 rounded-full opacity-70"></div>
          </div>
        </div>
        
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-900 mb-2 tracking-tighter">
          4<span className="text-indigo-600">0</span>4
        </h1>
        
        {/* Error Message */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Halaman Tidak Ditemukan
        </h2>
        
        <div className="w-24 h-1.5 bg-indigo-500 rounded-full mx-auto mb-8"></div>
        
        {/* Description */}
        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
            Sepertinya halaman yang Anda cari telah dipindahkan, dihapus, atau tidak pernah ada. 
            Jangan khawatir, tim <span className="text-indigo-600 font-semibold">Three Developer</span> siap membantu Anda menemukan jalan kembali.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 inline-block max-w-md">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
              <p className="text-blue-700 font-medium">Tips: Periksa kembali URL yang Anda masukkan</p>
            </div>
            <p className="text-sm text-gray-500">
              Atau jelajahi halaman lain yang mungkin Anda cari
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {/* Ikon rumah sederhana dengan SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>
          
          <Link
            to="/order"
            className="group flex items-center gap-3 border-2 border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-700 font-semibold py-3 px-8 rounded-full transition-all duration-300"
          >
            <span>Pesan Website</span>
            {/* Panah sederhana dengan SVG */}
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
        
        {/* Additional helpful links */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-500 mb-4">Atau coba jelajahi halaman lainnya:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              Tentang Kami
            </Link>
            <Link to="/#services" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              Layanan
            </Link>
            <Link to="/#portfolio" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              Portfolio
            </Link>
            <Link to="/#contact" className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
              Kontak
            </Link>
          </div>
        </div>
        
        {/* Developer signature */}
        <div className="mt-12 pt-6">
          <p className="italic text-gray-500 text-sm">
            - Three Developer -
          </p>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute bottom-10 right-10 w-10 h-10 bg-indigo-100 rounded-full opacity-50"></div>
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-indigo-200 rounded-full opacity-60"></div>
    </div>
  );
};

export default NotFound;