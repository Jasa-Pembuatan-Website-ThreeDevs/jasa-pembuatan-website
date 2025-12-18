import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img  from '../assets/SSB.png';

gsap.registerPlugin(ScrollTrigger);

const portfolioProjects = [
  {
    id: 1,
    title: "Sekolah Sepak Bola",
    category: "Website Development",
    description: "Platform Sekolah Sepak Bola Digital dengan fitur lengkap Dan Fungsional, dilengkapi dashboard admin, sistem pembayaran.",
    // image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    technologies: ["React", "NPM", "Sqlite", "Laravel", "Tailwind CSS"],
    demoUrl: "#",
    detailsUrl: "/project-detail",
    featured: true
  },

];

export default function Portfolio() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const projectsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
      }

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
        )
      }

      // Description animation
      if (descriptionRef.current) {
        gsap.fromTo(descriptionRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.3 }
        )
      }

      // Projects animation
      if (projectsRef.current?.children) {
        gsap.fromTo(projectsRef.current.children,
          { opacity: 0, y: 60, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.2, 
            stagger: 0.3, 
            ease: 'power3.out', 
            delay: 0.5,
            onComplete: () => {
              // Add hover animations to projects
              gsap.utils.toArray(projectsRef.current.children).forEach((card) => {
                card.addEventListener('mouseenter', () => {
                  gsap.to(card, { y: -15, duration: 0.3, ease: 'power2.out' })
                  gsap.to(card.querySelector('img'), { scale: 1.05, duration: 0.3, ease: 'power2.out' })
                })
                card.addEventListener('mouseleave', () => {
                  gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' })
                  gsap.to(card.querySelector('img'), { scale: 1, duration: 0.3, ease: 'power2.out' })
                })
              })
            }
          }
        )

        // Parallax effect for images
        gsap.utils.toArray(projectsRef.current.children).forEach((card) => {
          const img = card.querySelector('img');
          if (img) {
            gsap.to(img, {
              y: -15,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            })
          }
        })

        // Scroll-triggered animations
        ScrollTrigger.create({
          trigger: projectsRef.current,
          start: 'top 80%',
          animation: gsap.fromTo(projectsRef.current.children,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: 'power3.out' }
          )
        })
      }

      // Floating animations for badges (only if elements exist)
      const floatingBadges = document.querySelectorAll('.floating-badge');
      if (floatingBadges.length > 0) {
        gsap.to(floatingBadges, {
          y: -8,
          duration: 3.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 1
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="portfolio" ref={containerRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Portfolio <span className="text-indigo-600">Kami</span>
          </h2>
          <p ref={descriptionRef} className="text-gray-600 max-w-2xl mx-auto text-lg">
            Jelajahi proyek-proyek terbaik yang telah kami selesaikan untuk klien dari berbagai industri.
          </p>
          
          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Semua
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
              Website
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
              Mobile App
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
              Web App
            </button>
            <button className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
              IoT
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={img} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                  {project.category}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies Used */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Teknologi yang digunakan:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <a 
                    href={project.demoUrl}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center group"
                  >
                    Lihat Demo
                    <svg 
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                  <a 
                    href={project.detailsUrl}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    Lihat Detail
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
            Lihat Lebih Banyak Proyek
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}