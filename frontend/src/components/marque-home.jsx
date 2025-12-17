import { useEffect, useRef, useState } from "react";

export default function Marque() {
  const trackRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(20);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // DUPLIKASI ISI (vanilla style, tapi JSX-safe)
    const children = Array.from(track.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });

    // Hitung durasi animasi berdasarkan panjang track
    // Semakin panjang track, semakin lama durasinya
    const trackWidth = track.scrollWidth;
    const containerWidth = track.parentElement.clientWidth;
    const duration = Math.max(60, (trackWidth / containerWidth) * 10);
    setAnimationDuration(duration);

    // Setelah duplikasi selesai, aktifkan animasi
    setIsReady(true);
  }, []);

  return (
    <div className="w-full overflow-hidden py-6 sm:py-10 bg-white">
      <h2 className="text-center text-indigo-600 text-xl sm:text-2xl font-semibold mb-8 sm:mb-12">
        Teknologi yang <span className="text-black">Kami Gunakan</span>
      </h2>

      <div className="marquee-container">
        <div
          ref={trackRef}
          className={`marquee-track ${isReady ? 'animate-marquee' : ''}`}
          style={{
            animationDuration: `${animationDuration}s`
          }}
        >
          {/* First set of logos */}
          <i className="fa-brands fa-laravel text-4xl sm:text-5xl text-red-500"></i>
          <i className="fa-brands fa-node-js text-4xl sm:text-5xl text-green-600"></i>
          <i className="fa-brands fa-react text-4xl sm:text-5xl text-sky-500"></i>
          <i className="fa-solid fa-bolt text-4xl sm:text-5xl text-purple-600"></i>
          
          {/* Second set of logos (duplicate for seamless loop) */}
          <i className="fa-brands fa-laravel text-4xl sm:text-5xl text-red-500"></i>
          <i className="fa-brands fa-node-js text-4xl sm:text-5xl text-green-600"></i>
          <i className="fa-brands fa-react text-4xl sm:text-5xl text-sky-500"></i>
          <i className="fa-solid fa-bolt text-4xl sm:text-5xl text-purple-600"></i>
        </div>
      </div>
    </div>
  );
}
