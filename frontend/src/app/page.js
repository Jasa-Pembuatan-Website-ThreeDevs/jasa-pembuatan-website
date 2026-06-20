import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";
import HomeStaticSections from "@/components/sections/HomeStaticSections";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      <Navbar />
      <main>
        <HeroSection />
        <HomeStaticSections />
      </main>
      <Footer />
    </div>
  );
}
