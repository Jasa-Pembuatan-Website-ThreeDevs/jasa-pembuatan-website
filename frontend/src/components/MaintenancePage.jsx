// src/components/MaintenancePage.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const MaintenancePage = () => {
  return (
    <div className="bg-gray-50 h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Dekorasi Background Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Container Utama */}
      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 max-w-lg w-full text-center mx-4">
        
        {/* Animasi Lottie */}
        <div className="flex justify-center -mt-10 mb-4">
          {/* Perhatikan: Di React kita pakai custom element ini harus diabaikan warningnya atau pakai library, 
              tapi cara script CDN di index.html paling simpel buat pemula */}
          <DotLottieReact
      src="https://lottie.host/67dd3251-89d6-418e-b773-35503899cc77/pwoP8Foy5l.lottie"
      loop
      autoplay
    />
        </div>

        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Sistem Sedang <span className="text-blue-600">Upgrade</span>
        </h1>

        <p className="text-slate-500 mb-8 leading-relaxed">
          Tim IT sedang melakukan perawatan rutin untuk meningkatkan performa & keamanan. Website akan segera kembali.
        </p>

        {/* Status Bar */}
        <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-between border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </div>
            <span className="text-sm font-semibold text-slate-600">Status: Maintenance</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">EST: Tidak Tentu</span>
        </div>

        {/* Tombol Refresh */}
        <div className="mt-8">
          <button 
            onClick={() => window.location.reload()} 
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            Coba Refresh Halaman
            <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Three Developer | All rights reserved.
        </div>
      </div>

      {/* Style CSS untuk Animasi Blob (dimasukkan dalam JSX style tag) */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;