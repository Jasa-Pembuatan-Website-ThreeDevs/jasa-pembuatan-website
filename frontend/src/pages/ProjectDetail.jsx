import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios'; // Pastikan path axios benar
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import SEO from '../components/SEO';

const ProjectDetail = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Request ke Backend buat ambil data detail
        const res = await axios.get(`/api/portfolios/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Gagal ambil detail project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center">
            <p className="text-xl font-bold text-gray-500">Memuat Detail Project...</p>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-500 mb-6">Project tidak ditemukan.</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Kembali ke Home</Link>
        </div>
    );
  }

  return (
    <>
    <SEO
        title={project.judul} 
        description={`Lihat detail project ${project.judul} kategori ${project.kategori} buatan ThreeDevs.`}
      />
      <Navbar />
      
      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-gray-900 text-white px-6 text-center">
        <span className="text-blue-400 font-bold tracking-wider uppercase">{project.kategori}</span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{project.judul}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">{project.deskripsi}</p>
      </div>

      {/* Gambar Utama */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 mb-20">
        <img 
            src={`http://localhost:8000${project.gambar}`} // Ambil gambar dari API
            alt={project.judul} 
            className="w-full rounded-2xl shadow-2xl border-4 border-white object-cover" 
        />
      </div>

      {/* Detail Content */}
      <div className="max-w-4xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Kolom Kiri: Deskripsi Detail */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tentang Project</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {/* Karena di DB cuma ada 'deskripsi', kita pakai itu dulu. 
                    Nanti kalau mau lebih lengkap, bisa tambah kolom 'challenge' & 'solution' di database. */}
                {project.deskripsi}
            </p>
            <p className="text-gray-600 mt-4">
                Project ini dikerjakan dengan standar profesional tinggi untuk memastikan kepuasan klien dan fungsionalitas sistem yang maksimal.
            </p>
          </div>
          
          <div className="pt-6">
            {project.link_demo ? (
                <a href={project.link_demo} target="_blank" rel="noreferrer" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                Kunjungi Website Live ↗
                </a>
            ) : (
                <button disabled className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-bold cursor-not-allowed">
                    Demo Tidak Tersedia
                </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Info Teknis */}
        <div className="bg-gray-50 p-8 rounded-xl h-fit sticky top-24 border border-gray-100">
          <h4 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Kategori</h4>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {project.kategori}
          </span>

          <h4 className="text-lg font-bold mb-4 border-b pb-2 mt-8 text-gray-800">Teknologi</h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {/* Karena di DB belum ada kolom 'teknologi', kita hardcode dulu atau update DB nanti */}
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">Laravel</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">React JS</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">MySQL</span>
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">Tailwind</span>
          </div>

          <h4 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Tanggal Upload</h4>
          <p className="text-gray-600">{new Date(project.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

      </div>

      <CTASection />
      <Footer />
    </>
  );
};

export default ProjectDetail;