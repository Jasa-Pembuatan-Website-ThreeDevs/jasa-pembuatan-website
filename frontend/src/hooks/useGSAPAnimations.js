import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Basic fade-in animation for all elements
    const animateElements = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el, index) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: options.duration || 0.8,
            delay: (options.delay || 0) + (index * 0.1),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              containerAnimation: ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5
              })
            }
          }
        );
      });
    };

    // Staggered reveal animation
    const staggerReveal = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      gsap.fromTo(elements,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: options.duration || 1,
          stagger: options.stagger || 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elements[0] || container,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    };

    // Scale reveal animation
    const scaleReveal = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el, index) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: options.duration || 0.8,
            delay: (options.delay || 0) + (index * 0.15),
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    };

    // Slide up animation
    const slideUp = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el, index) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: options.duration || 1,
            delay: (options.delay || 0) + (index * 0.2),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    };

    // Rotate reveal animation
    const rotateReveal = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el, index) => {
        gsap.fromTo(el,
          { opacity: 0, rotation: -10, scale: 0.9 },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: options.duration || 0.9,
            delay: (options.delay || 0) + (index * 0.1),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    };

    // Parallax effect
    const addParallax = (selector, speed = -0.5) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach(el => {
        gsap.to(el, {
          y: () => el.offsetHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    };

    // Floating animation for badges and icons
    const floatingAnimation = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach(el => {
        gsap.to(el, {
          y: options.y || -5,
          duration: options.duration || 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 1
        });
      });
    };

    // Text typing effect
    const typingEffect = (selector, options = {}) => {
      const elements = container.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        
        gsap.to(el, {
          text: text,
          duration: options.duration || 3,
          ease: 'power1.out',
          delay: options.delay || 0
        });
      });
    };

    // Apply animations to different sections
    animateElements('h1, h2, h3', { duration: 0.9 });
    animateElements('p', { duration: 0.8, delay: 0.2 });
    staggerReveal('.card, .project-card, .service-card', { stagger: 0.3 });
    scaleReveal('.badge, .feature-item', { duration: 0.7 });
    slideUp('.cta-button, .btn', { duration: 0.8 });
    rotateReveal('.icon, .logo', { duration: 0.8 });
    
    // Floating animations
    floatingAnimation('.animate-float', { y: -8, duration: 3 });
    floatingAnimation('.badge', { y: -3, duration: 2.5 });
    
    // Parallax effects
    addParallax('.parallax', -0.3);
    
    // Typing effects for hero sections
    typingEffect('.typing-text', { duration: 2.5, delay: 0.5 });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(container);
    };
  }, []);

  return containerRef;
};