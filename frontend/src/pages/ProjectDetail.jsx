import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import img from '../assets/SSB.png';

// Data dummy (ideally dari API/File terpisah)
const projects = {
  1: {
    title: "Sekolah Sepak Bola",
    category: "Website Development",
    img: "https://via.placeholder.com/1200x600", // Ganti gambar asli
    desc: "Membangun platform sekolah sepak bola digital dengan fitur lengkap.",
    challenge: "Klien butuh sistem yang memungkinkan pendaftaran online, manajemen siswa, dan pembayaran terintegrasi. Tantangannya adalah menciptakan UI/UX yang menarik bagi anak muda sekaligus mudah digunakan oleh orang tua.",
    solution: "Kami menggunakan Laravel untuk backend yang kuat menangani ribuan produk, dan React untuk frontend yang cepat. Integrasi API  Antara Laravel dan React memastikan pengalaman pengguna yang mulus.",
    tech: ["Laravel", "React", "MySQL", "Tailwind CSS"],
    link: "#"
  },
  // Tambah project lain...
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects[id] || projects[1]; // Fallback ke id 1 kalau gak ketemu

  return (
    <>
      <Navbar />
      
      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-gray-900 text-white px-6 text-center">
        <span className="text-blue-400 font-bold tracking-wider uppercase">{project.category}</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{project.title}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">{project.desc}</p>
      </div>

      {/* Gambar Utama */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 mb-20">
        <img src={img} alt={project.title} className="w-full rounded-2xl shadow-2xl border-4 border-white" />
      </div>

      {/* Detail Case Study */}
      <div className="max-w-4xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Kolom Kiri: Teks Cerita */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tantangan</h3>
            <p className="text-gray-600 leading-relaxed">{project.challenge}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Solusi Kami</h3>
            <p className="text-gray-600 leading-relaxed">{project.solution}</p>
          </div>
          
          <div className="pt-6">
            <a href={project.link} target="_blank" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Kunjungi Website Live ↗
            </a>
          </div>
        </div>

        {/* Kolom Kanan: Info Teknis */}
        <div className="bg-gray-50 p-8 rounded-xl h-fit sticky top-24">
          <h4 className="text-lg font-bold mb-4 border-b pb-2">Teknologi</h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map(t => (
              <span key={t} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
                {t}
              </span>
            ))}
          </div>

          <h4 className="text-lg font-bold mb-4 border-b pb-2">Klien</h4>
          <p className="text-gray-600 mb-6">SSB SMKS Muhammadiyah 1 Genteng</p>

          <h4 className="text-lg font-bold mb-4 border-b pb-2">Tahun</h4>
          <p className="text-gray-600">2025</p>
        </div>

      </div>

      <CTASection />
      <Footer />
    </>
  );
};

export default ProjectDetail;