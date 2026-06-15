"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroParallax } from "@/components/ui/hero-parallax";

const PORTFOLIO_ITEMS = [
  {
    title: "Nusantara Property",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Warung Digital POS",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "BatikStore Official",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Klinik Sehat Sentosa",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "EduPlatform LMS",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "FashionHub Indonesia",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Kopi Nusantara",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "LogistikApp",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Creative Agency Profile",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Restaurant Reservation",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "SaaS Analytics Dashboard",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Travel Experience Site",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Finance Company Profile",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Event Ticketing Platform",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=78&auto=format&fit=crop",
  },
  {
    title: "Healthcare Booking System",
    link: "/portfolio",
    thumbnail:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&q=78&auto=format&fit=crop",
  },
];

export default function PortfolioParallaxSection() {
  return (
    <section
      id="portfolio"
      className="relative overflow-hidden border-y border-white/[0.06] bg-zinc-950"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-28 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-80 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.032)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative">
        <HeroParallax
          products={PORTFOLIO_ITEMS}
          title="Portfolio yang memberi bisnis terlihat siap dipercaya."
          description="Contoh arah visual untuk landing page, company profile, dashboard, dan e-commerce. Setiap tampilan dirancang responsif, cepat dimuat, dan punya alur konversi yang jelas."
        />
      </div>

      <div className="relative -mt-28 px-6 pb-24 sm:-mt-36 lg:-mt-44">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Butuh gaya visual yang berbeda? Kami bisa adaptasi dari brand,
            target audiens, dan tujuan campaign kamu.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10"
          >
            Lihat Portfolio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
