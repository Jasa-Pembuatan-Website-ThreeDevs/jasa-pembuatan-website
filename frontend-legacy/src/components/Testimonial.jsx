import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/testimonials');
                setReviews(res.data);
            } catch (error) {
                console.error("Gagal load testimoni", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // Kalau belum ada review, jangan tampilkan apa-apa (atau tampilkan dummy)
    if (!loading && reviews.length === 0) return null;

    return (
        <section id='testimonials' className="py-20 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kata Mereka <span className="text-indigo-600">Tentang Kami</span>
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Kepuasan klien adalah prioritas utama kami. Berikut adalah ulasan asli dari klien yang telah bekerja sama dengan ThreeDevs.
                    </p>
                </div>

                {/* Grid Review */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((rev) => (
                        <div key={rev.id} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative group">
                            
                            {/* Kutipan Icon */}
                            <div className="absolute top-6 right-8 text-6xl text-indigo-100 font-serif opacity-50 group-hover:text-indigo-200 transition">
                                "
                            </div>

                            {/* Bintang */}
                            <div className="flex gap-1 mb-4 text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fa-solid fa-star ${i < rev.rating ? '' : 'text-gray-300'}`}></i>
                                ))}
                            </div>

                            {/* Isi Review */}
                            <p className="text-gray-600 mb-6 italic leading-relaxed relative z-10">
                                "{rev.isi_ulasan}"
                            </p>

                            {/* User Info */}
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {rev.nama_pelanggan.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{rev.nama_pelanggan}</h4>
                                    <p className="text-xs text-indigo-600 font-medium">Verified Client ✅</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;