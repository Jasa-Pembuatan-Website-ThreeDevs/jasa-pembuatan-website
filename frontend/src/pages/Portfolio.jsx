import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import { Link } from "react-router-dom"; // <--- Import Link buat navigasi

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/portfolios');
        setProjects(res.data);
      } catch (error) {
        console.error("Gagal load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const categories = ["Semua", "Toko Online", "Company Profile", "Landing Page"];
  const filteredProjects = filter === "Semua" 
    ? projects 
    : projects.filter(p => p.kategori === filter);

  return (
    <>
      <Navbar />
      <div id="portfolio" className="bg-gray-50 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Karya Terbaik Kami 🚀</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Lihat bagaimana kami membantu bisnis berkembang melalui website profesional.
            </p>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID PROJECTS */}
          {loading ? (
             <p className="text-center text-gray-500">Memuat portfolio...</p>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
                  
                  {/* Image Wrapper */}
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={`http://localhost:8000${project.gambar}`} 
                      alt={project.judul} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                    
                    {/* Overlay Hover: Tombol Demo */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {project.link_demo && (
                           <a 
                             href={project.link_demo} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-xs hover:bg-gray-100 transition"
                           >
                             Live Demo 🔗
                           </a>
                        )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
                        {project.kategori}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.judul}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {project.deskripsi || "Project website profesional oleh ThreeDevs."}
                      </p>
                    </div>

                    {/* Tombol Lihat Detail (Di Bagian Bawah Card) */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link 
                        to={`/project/${project.id}`} 
                        className="w-full block text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                      >
                        Lihat Detail Project →
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">Belum ada project di kategori ini.</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Portfolio;