
import React, { useRef, useEffect } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Marque from '../components/marque-home';
import Chatbot from '../components/Chatbot';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    useSmoothScroll();
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero section animations
            gsap.fromTo(heroRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
            );

            // Staggered text animation
            gsap.fromTo(contentRef.current?.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.3 }
            );

            // CTA buttons animation
            gsap.fromTo(ctaRef.current?.children,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, stagger: 0.3, ease: 'back.out(1.7)', delay: 0.8 }
            );

            // Floating animation for badges
            gsap.to('.floating-badge', {
                y: -8,
                duration: 3,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 1
            });

            // Scroll-triggered animations
            ScrollTrigger.create({
                trigger: contentRef.current,
                start: 'top 80%',
                animation: gsap.fromTo(contentRef.current,
                    { opacity: 0, x: -50 },
                    { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
                )
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-white pt-16">
            <section id="home" className="container mx-auto px-4 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="flex flex-col items-center mb-10 w-full lg:mb-0">
                        <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl max-w-2xl lg:max-w-sm text-center font-semibold text-gray-900 leading-tight mb-6 mt-12">
                            Halo para <span className="text-indigo-600">pengunjung</span>
                        </h1>

                        <div ref={contentRef} className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl">
                            <p className="mb-4 text-center text-sm sm:text-base">
                            Transformasikan ide Anda menjadi website profesional yang menarik pengunjung dan meningkatkan penjualan. Desain responsif, SEO-ready, dan dukungan cepat — mulai sekarang, tampilkan bisnis Anda di level selanjutnya.
                            </p>
                            <p className="italic text-center text-sm">
                               -Three Developer-
                            </p>
                        </div>

                        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center mb-10">
                            <a href="#services" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 sm:px-8 rounded-full transition-colors shadow-md hover:scale-105 transform">
                                Get Started
                            </a>
                            <a href="#about" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-6 sm:px-8 rounded-full transition-colors hover:scale-105 transform">
                                Learn More
                            </a>
                        </div>

                        <Marque />

                    </div>
                </div>
            </section>
            
            <Chatbot />
        </div>
    );
};