"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Transition, type Variants } from "framer-motion";
import { ArrowUpRight, ExternalLink, Layers3, Sparkles } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const KATEGORI = ["Semua", "Landing Page", "Web App", "E-Commerce"] as const;
type Kategori = (typeof KATEGORI)[number];

interface ProyekPortfolio {
  id: number;
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  gambar: string;
  tinggi: string;
}

const PROYEK: ProyekPortfolio[] = [
  {
    id: 1,
    judul: "Nusantara Property",
    kategori: "Landing Page",
    deskripsi:
      "Landing page premium untuk agen properti dengan desain modern dan integrasi WhatsApp.",
    gambar:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    tinggi: "h-64",
  },
  {
    id: 2,
    judul: "Warung Digital POS",
    kategori: "Web App",
    deskripsi:
      "Sistem kasir berbasis web dengan dashboard analitik dan manajemen stok real-time.",
    gambar:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tinggi: "h-80",
  },
  {
    id: 3,
    judul: "BatikStore Official",
    kategori: "E-Commerce",
    deskripsi:
      "Toko online batik dengan payment gateway Midtrans dan sistem pengiriman otomatis.",
    gambar:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tinggi: "h-72",
  },
  {
    id: 4,
    judul: "Klinik Sehat Sentosa",
    kategori: "Landing Page",
    deskripsi:
      "Website profil klinik dengan fitur booking online dan informasi dokter lengkap.",
    gambar:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tinggi: "h-80",
  },
  {
    id: 5,
    judul: "EduPlatform LMS",
    kategori: "Web App",
    deskripsi:
      "Platform pembelajaran online dengan video streaming, kuis interaktif, dan sertifikat digital.",
    gambar:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    tinggi: "h-64",
  },
  {
    id: 6,
    judul: "FashionHub Indonesia",
    kategori: "E-Commerce",
    deskripsi:
      "Marketplace fashion dengan fitur wishlist, review produk, dan integrasi multi-kurir.",
    gambar:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    tinggi: "h-72",
  },
  {
    id: 7,
    judul: "Kopi Nusantara",
    kategori: "Landing Page",
    deskripsi:
      "Landing page brand kopi lokal dengan storytelling visual dan animasi scroll halus.",
    gambar:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    tinggi: "h-72",
  },
  {
    id: 8,
    judul: "LogistikApp",
    kategori: "Web App",
    deskripsi:
      "Aplikasi tracking pengiriman dengan peta real-time dan notifikasi otomatis.",
    gambar:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    tinggi: "h-64",
  },
];

const animasiMasuk: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 18 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -8 },
};

const transisiKartu: Transition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1],
};

const animasiGrid = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function HalamanPortfolio() {
  const [filterAktif, setFilterAktif] = useState<Kategori>("Semua");

  const proyekTerfilter =
    filterAktif === "Semua"
      ? PROYEK
      : PROYEK.filter((p) => p.kategori === filterAktif);

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-cyan-400/20 selection:text-cyan-100">
      <Navbar />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -right-24 top-[36rem] h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>

        <section className="relative px-6 pb-14 pt-32 lg:pt-36">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                <Layers3 className="h-3.5 w-3.5 text-cyan-300" />
                Portfolio
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
                Karya digital yang dibangun untuk performa dan kredibilitas.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
                Beberapa contoh arah visual, sistem, dan pengalaman pengguna
                yang kami bangun untuk berbagai kebutuhan bisnis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                ["8", "Project"],
                ["3", "Kategori"],
                ["100%", "Responsive"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <p className="text-xl font-semibold text-zinc-100">{value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative px-6 pb-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="flex flex-wrap gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] p-2"
            >
              {KATEGORI.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setFilterAktif(kat)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    filterAktif === kat
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="relative px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={filterAktif}
                variants={animasiGrid}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="columns-1 gap-5 sm:columns-2"
              >
                {proyekTerfilter.map((proyek) => (
                  <KartuPortfolio key={proyek.id} proyek={proyek} />
                ))}
              </motion.div>
            </AnimatePresence>

            {proyekTerfilter.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center text-sm text-zinc-600"
              >
                Belum ada proyek untuk kategori ini.
              </motion.p>
            )}
          </div>
        </section>

        <section className="relative border-t border-white/[0.06] px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border border-white/[0.08] bg-white/[0.025] p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
                <Sparkles className="h-3.5 w-3.5" />
                Next Project
              </p>
              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                Tertarik membuat website dengan standar yang sama?
              </h2>
            </div>
            <Link
              href="/order"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10"
            >
              Mulai Project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function KartuPortfolio({ proyek }: { proyek: ProyekPortfolio }) {
  return (
    <motion.article
      variants={animasiMasuk}
      transition={transisiKartu}
      className="group mb-5 break-inside-avoid"
    >
      <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-2xl hover:shadow-black/25">
        <div className={`relative overflow-hidden ${proyek.tinggi}`}>
          <Image
            src={proyek.gambar}
            alt={proyek.judul}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/82 via-zinc-950/12 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-zinc-950/70 px-3 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur">
            {proyek.kategori}
          </span>
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-950/60 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
            <ExternalLink className="h-4 w-4 text-zinc-200" />
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-zinc-100">
            {proyek.judul}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {proyek.deskripsi}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
