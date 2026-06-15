import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";
import LazyHomeSections from "@/components/sections/LazyHomeSections";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      <Navbar />
      <main>
        <HeroSection />
        <LazyHomeSections />
      </main>
      <Footer />
    </div>
  );
}
