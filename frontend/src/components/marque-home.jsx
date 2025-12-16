import { useEffect, useRef } from "react";

export default function Marque() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // DUPLIKASI ISI (vanilla style, tapi JSX-safe)
    const children = Array.from(track.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  }, []);

  return (
    <div className="w-full overflow-hidden py-10 bg-white">
      <h2 className="text-center text-indigo-600 text-2xl font-semibold mb-12">
        Teknologi yang <span className="text-black">Kami Gunakan</span>
      </h2>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-16 items-center animate-marquee"
        >
          <i className="fa-brands fa-laravel text-5xl text-red-500"></i>
          <i className="fa-brands fa-node-js text-5xl text-green-600"></i>
          <i className="fa-brands fa-react text-5xl text-sky-500"></i>
          <i className="fa-solid fa-bolt text-5xl text-purple-600"></i>
        </div>
      </div>
    </div>
  );
}
