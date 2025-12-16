
import React from 'react';
import Marque from '../components/marque-home';

export default function Home() {
    return (
        <div className="min-h-screen bg-white pt-16">
            <section id="home" className="container mx-auto px-4 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="flex flex-col items-center mb-10 w-full lg:mb-0">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl lg:max-w-sm lg:text-center font-semibold text-gray-900 leading-tight mb-6">
                            Halo para <span className="text-indigo-600">pengunjung</span>
                        </h1>

                        <div className="text-lg text-gray-700 mb-8 max-w-2xl">
                            <p className="mb-4 text-center text-sm">
                            Transformasikan ide Anda menjadi website profesional yang menarik pengunjung dan meningkatkan penjualan. Desain responsif, SEO-ready, dan dukungan cepat — mulai sekarang, tampilkan bisnis Anda di level selanjutnya.
                            </p>
                            <p className="italic text-center text-sm">
                               -Three Developer-
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-15">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-8 rounded-full transition-colors shadow-md">
                                Get Started
                            </button>
                            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-8 rounded-full transition-colors">
                                Learn More
                            </button>
                        </div>

                        <Marque />

                    </div>
                </div>
            </section>
            
        </div>
    );
};