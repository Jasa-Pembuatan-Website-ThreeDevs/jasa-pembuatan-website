"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Send,
  MapPin,
  Mail,
  Phone,
  Code2,
  Server,
  ShieldCheck,
  Database,
  Cpu,
  Globe,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

/* ========================================
   DATA — Konten statis, mudah dikelola
======================================== */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team", href: "#team" },
  { label: "FAQ", href: "#faq" },
];

const PLANS = [
  {
    name: "Basic",
    price: "1.5",
    unit: "Juta",
    desc: "Untuk landing page & profil pribadi.",
    features: [
      "1 Halaman Landing Page",
      "Desain Responsif",
      "Revisi 2x",
      "Pengerjaan 3 Hari",
      "Free Domain .com",
    ],
    highlighted: false,
  },
  {
    name: "Bisnis",
    price: "3.5",
    unit: "Juta",
    desc: "Ideal untuk UMKM yang serius online.",
    features: [
      "Hingga 7 Halaman",
      "Desain Custom Responsif",
      "Revisi 5x",
      "Pengerjaan 7 Hari",
      "Free Domain + Hosting 1 Thn",
      "Integrasi WhatsApp & Analytics",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "7",
    unit: "Juta",
    desc: "Solusi lengkap enterprise & e-commerce.",
    features: [
      "Unlimited Halaman",
      "Custom CMS / Dashboard",
      "Revisi Unlimited",
      "Pengerjaan 14 Hari",
      "Free Domain + Hosting 1 Thn",
      "SEO On-Page + Maintenance 3 Bln",
    ],
    highlighted: false,
  },
];

const TEAM = [
  {
    name: "Dannys Martha Favrillia",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The Unstopabble Frontend",
    img: "https://i.pravatar.cc/300?img=12",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Arya Prana Jaya",
    role: "Backend Developer",
    icon: Server,
    badge: "Backend Lead",
    img: "https://i.pravatar.cc/300?img=15",
    span: "col-span-1 row-span-2",
  },
  {
    name: "Dina",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The UI/UX Enthusiast",
    img: "https://i.pravatar.cc/300?img=32",
    span: "col-span-2 row-span-4",
  },
  {
    name: "Idgar",
    role: "QA Engineer",
    icon: ShieldCheck,
    badge: "The Strongest Quality Assurance",
    img: "https://i.pravatar.cc/300?img=44",
    span: "col-span-1 row-span-1",
  },
    {
    name: "Okkyboy",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The Frontend Energy",
    img: "https://i.pravatar.cc/300?img=12",
    span: "col-span-1 row-span-1"
  },
];

const FAQS = [
  {
    q: "Berapa lama proses pembuatan website?",
    a: "Paket Basic 3 hari kerja, Bisnis 7 hari kerja, dan Pro 14 hari kerja. Estimasi bisa lebih cepat tergantung kompleksitas proyek.",
  },
  {
    q: "Apakah bisa request desain custom?",
    a: "Tentu. Tim kami akan berdiskusi langsung untuk merealisasikan visi desain yang Anda inginkan. Semua paket mendukung desain custom.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Pembayaran 50% di awal sebagai DP dan 50% setelah website selesai dan disetujui. Kami menerima transfer bank dan e-wallet.",
  },
  {
    q: "Apakah website sudah SEO-friendly?",
    a: "Semua website sudah dioptimasi SEO on-page — meta tag, structured data, dan performa loading yang cepat.",
  },
  {
    q: "Apakah ada garansi setelah website jadi?",
    a: "Garansi maintenance 1 bulan untuk Basic & Bisnis, 3 bulan untuk Pro. Bug dan error diperbaiki gratis selama masa garansi.",
  },
];

/* ========================================
   ANIMATION VARIANTS — Framer Motion
======================================== */

// Animasi fade-up halus untuk elemen yang muncul saat scroll
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Container yang men-trigger stagger pada anak-anaknya
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ========================================
   KOMPONEN UTAMA
======================================== */

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Toggle FAQ: buka jika tertutup, tutup jika sudah terbuka
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <HeroSection />
      <ShowcaseSection />
      <PricingSection />
      <TeamSection />
      <FaqSection openFaq={openFaq} toggleFaq={toggleFaq} />
      <ContactSection />
      <Footer />
    </div>
  );
}

/* ========================================
   NAVBAR — Ultra minimal, border tipis bawah
======================================== */
function Navbar({ mobileOpen, setMobileOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo — teks bersih tanpa icon berlebihan */}
        <a href="#home" className="text-sm font-semibold tracking-tight text-zinc-100">
          ThreeDevs
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-4 py-1.5 text-[13px] font-medium text-zinc-950 transition-colors hover:bg-white md:flex"
        >
          Mulai Sekarang <ArrowUpRight className="h-3.5 w-3.5" />
        </a>

        {/* Mobile toggle */}
        <button className="text-zinc-400 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-zinc-800/60 bg-zinc-950 md:hidden"
          >
            <div className="flex flex-col gap-3 px-6 py-5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-zinc-400 hover:text-zinc-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-2 w-full rounded-full bg-zinc-100 py-2 text-center text-sm font-medium text-zinc-950"
                onClick={() => setMobileOpen(false)}
              >
                Mulai Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ========================================
   HERO — Full-screen + Spotlight, asimetris 60/40
   Kiri: Headline + CTA | Kanan: Orbiting Circles
======================================== */
function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-14"
    >
      {/* ====== SPOTLIGHT WRAPPER — cahaya off-screen + blur + vignette masking ====== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Posisi cahaya off-screen: pusat terang berada di luar batas layar */}
        <Spotlight
          className="-top-40 -left-20 md:-left-32 md:-top-32 opacity-25"
          fill="white"
        />

        {/* ====== ULTIMATE VIGNETTE MASKING ====== */}
        {/* Radial gradient yang memudar ke zinc-950 (#09090b) di bagian tepi.
             Ini secara paksa memakan ujung-ujung cahaya spotlight yang tajam,
             sehingga cahaya melebur sempurna dengan background gelap. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,1)_80%)] pointer-events-none" />

        {/* Lapisan tambahan — gradient atas-bawah agar cahaya fade vertical juga */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.6) 70%, #09090b 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Layout asimetris: 60% kiri (teks) + 40% kanan (orbit) */}
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-8">
          {/* ====== KIRI: Headline + CTA (60%) ====== */}
          <div className="flex-1 lg:max-w-[60%]">
            {/* Label kecil */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600"
            >
              IT Agency &mdash; Banyuwangi
            </motion.p>

            {/* Headline — putih bersih, tebal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl"
            >
              Wujudkan Website
              <br />
              <span className="text-zinc-500">Impian Anda.</span>
            </motion.h1>

            {/* Sub-headline — abu-abu elegan */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-zinc-500"
            >
              Desain modern, teknologi terkini, dan performa tinggi untuk bisnis
              yang serius tumbuh di dunia digital.
            </motion.p>

            {/* CTA buttons — simpel dan bersih */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-10 flex items-center gap-4"
            >
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
              >
                Lihat Paket <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#showcase"
                className="text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-300"
              >
                Lihat Showcase
              </a>
            </motion.div>
          </div>

          {/* ====== KANAN: Orbiting Circles (40%) ====== */}
          <div className="relative flex flex-1 items-center justify-center lg:max-w-[40%]">
            <OrbitingCircles />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   ORBITING CIRCLES — Animasi satelit berputar
   Menggunakan framer-motion + Tailwind murni
======================================== */

/**
 * Konfigurasi orbit — mudah disesuaikan:
 * - radius: jarak satelit dari pusat (px)
 * - duration: waktu satu putaran penuh (detik). Semakin besar = semakin lambat
 * - delay: jeda awal sebelum animasi dimulai
 * - icons: array icon lucide yang menjadi satelit
 */
const ORBITS = [
  {
    radius: 90,   // Orbit terdalam — radius kecil
    duration: 20, // Putaran 20 detik — cukup cepat
    delay: 0,
    icons: [Code2, Database],
  },
  {
    radius: 155,  // Orbit tengah
    duration: 30, // Putaran 30 detik — sedang
    delay: 0.5,
    icons: [Server, Cpu],
  },
  {
    radius: 220,  // Orbit terluar — radius besar
    duration: 40, // Putaran 40 detik — paling lambat
    delay: 1,
    icons: [Globe, ShieldCheck],
  },
];

function OrbitingCircles() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 480, height: 480 }}>
      {/* ====== Garis orbit — lingkaran tipis transparan ====== */}
      {ORBITS.map((orbit, i) => (
        <div
          key={`ring-${i}`}
          className="absolute rounded-full border border-white/[0.07]"
          style={{
            // Diameter = 2 × radius, posisi center dikoreksi agar titik tengah di pusat parent
            width: orbit.radius * 2,
            height: orbit.radius * 2,
            left: `calc(50% - ${orbit.radius}px)`,
            top: `calc(50% - ${orbit.radius}px)`,
          }}
        />
      ))}

      {/* ====== Logo pusat — inisial 'TD' dengan glow neon halus ====== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="absolute z-20 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm"
        style={{
          // Efek glow neon ungu halus
          boxShadow:
            "0 0 30px rgba(168, 85, 247, 0.15), 0 0 60px rgba(168, 85, 247, 0.08)",
        }}
      >
        <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          TD
        </span>
      </motion.div>

      {/* ====== Satelit — icon yang menempel di garis orbit dan berputar ====== */}
      {ORBITS.map((orbit, orbitIndex) =>
        orbit.icons.map((Icon, iconIndex) => {
          /**
           * MATEMATIKA POSISI SATELIT:
           * - Kita gunakan CSS transform-origin agar div pembungkus berputar
           *   mengelilingi pusat parent (bukan pusat div itu sendiri).
           * - angleOffset: jarak sudut antar satelit dalam satu orbit
           *   Rumus: 360° / jumlah satelit × index
           * - Contoh: 2 satelit → offset = 180° (berseberangan)
           */
          const angleOffset = (360 / orbit.icons.length) * iconIndex;

          return (
            <motion.div
              key={`sat-${orbitIndex}-${iconIndex}`}
              className="absolute z-10"
              style={{
                /**
                 * Container ini berukuran sama dengan orbit ring.
                 * Rotasi akan diterapkan pada pusat container ini,
                 * sehingga child (icon) ikut berputar mengelilingi pusat.
                 */
                width: orbit.radius * 2,
                height: orbit.radius * 2,
                left: `calc(50% - ${orbit.radius}px)`,
                top: `calc(50% - ${orbit.radius}px)`,
                // Rotasi awal agar satelit tidak bertumpuk di posisi yang sama
                transform: `rotate(${angleOffset}deg)`,
              }}
              animate={{ rotate: [angleOffset, angleOffset + 360] }}
              transition={{
                duration: orbit.duration,
                delay: orbit.delay,
                repeat: Infinity,
                ease: "linear", // Linear = kecepatan konstan tanpa akselerasi
              }}
            >
              {/*
                Posisi icon: ditempatkan di "atas" lingkaran (tepi 12-o-clock).
                Karena parent sudah di-rotasi, icon akan tampak menempel di garis orbit.
                Kita translate -50% agar icon benar-benar center di titik tepi.
              */}
              <div
                className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700/40 bg-zinc-900/90 backdrop-blur-sm"
                style={{
                  // Posisi di tepi atas lingkaran (titik 12-o-clock)
                  top: 0,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  // Glow halus pada setiap satelit
                  boxShadow:
                    "0 0 12px rgba(34, 211, 238, 0.12), 0 0 24px rgba(168, 85, 247, 0.08)",
                }}
              >
                <Icon className="h-4 w-4 text-zinc-400" />
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

/* ========================================
   SHOWCASE — MacbookScroll dari Aceternity UI
======================================== */
function ShowcaseSection() {
  return (
    <section id="showcase" className="relative overflow-hidden">
      {/* Judul di atas Macbook */}
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-8 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="text-2xl font-semibold tracking-tight text-zinc-200 sm:text-3xl"
        >
          Dibangun dengan Teknologi Modern.
          <br />
          <span className="text-zinc-500">Performa Tanpa Batas.</span>
        </motion.h2>
      </div>

      {/* Panggil MacbookScroll — efek 3D saat scroll */}
      <MacbookScroll
        title=""
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
        showGradient
        badge={
          <div className="flex items-center gap-2 rounded-md bg-zinc-800/80 px-3 py-1.5 backdrop-blur">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-zinc-400">ThreeDevs — Live</span>
          </div>
        }
      />
    </section>
  );
}


/* ========================================
   PRICING — Clean minimalist 3-column
======================================== */
function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Paket yang transparan.
            <br />
            <span className="text-zinc-500">Tanpa biaya tersembunyi.</span>
          </h2>
        </motion.div>

        {/* 3-column grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative rounded-xl border p-8 transition-colors duration-200 hover:scale-[1.02] ${
                plan.highlighted
                  ? "border-zinc-600 bg-zinc-900/60"
                  : "border-white/[0.06] bg-zinc-900/40"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-zinc-100 px-3 py-0.5 text-[11px] font-semibold text-zinc-900">
                  Paling Populer
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-400">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-600">{plan.unit}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">{plan.desc}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-zinc-400"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                    : "border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                Pilih Paket
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ========================================
   TEAM — Bento Grid asimetris
======================================== */
function TeamSection() {
  return (
    <section id="team" className="border-t border-zinc-800/50 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            Team
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Orang-orang di balik layar.
          </h2>
        </motion.div>

        {/* Bento Grid — asimetris 2 kolom pada tablet, 3 kolom pada desktop */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Member 1 — Frontend */}
          <MemberCard member={TEAM[0]} />

          {/* Member 2 — Backend, row-span-2 (lebih tinggi) */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/40 p-8 sm:row-span-2"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                {TEAM[1].badge && (
                  <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-400">
                    <Server className="h-3 w-3" />
                    {TEAM[1].badge}
                  </span>
                )}
                <h3 className="mt-2 text-lg font-semibold text-zinc-100">
                  {TEAM[1].name}
                </h3>
                <p className="text-sm text-zinc-500">{TEAM[1].role}</p>
              </div>
              <div className="mt-3 flex align-center">
                <img
                  src={TEAM[1].img}
                  alt={TEAM[1].name}
                  className="h-48 w-full rounded-lg object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
            </div>
          </motion.div>

          {/* Member 3 — Frontend */}
          <MemberCard member={TEAM[2]} />

          {/* Member 4 — QA */}
          <MemberCard member={TEAM[3]} />
          {/* Frontend Cadangan */}
          <MemberCard member={TEAM[4]} />
        </motion.div>
      </div>
    </section>
  );
}

/* Kartu anggota standar untuk bento grid */
function MemberCard({ member }) {
  const Icon = member.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/40 p-8"
    >
      <div>
        <div className="flex items-center gap-2 text-zinc-600">
          <Icon className="h-4 w-4" />
          <span className="text-xs text-zinc-600">{member.role}</span>
          <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-2.5 py-0.5 text-[11px] text-zinc-400">{member.badge}</span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-zinc-100">{member.name}</h3>
      </div>
      <div className="mt-4">
        <img
          src={member.img}
          alt={member.name}
          className="h-28 w-full rounded-lg object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
        />
      </div>
    </motion.div>
  );
}

/* ========================================
   FAQ — Accordion minimalis, border-b only
======================================== */
function FaqSection({ openFaq, toggleFaq }) {
  return (
    <section id="faq" className="border-t border-zinc-800/50 py-32 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-16"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Pertanyaan yang sering ditanyakan.
          </h2>
        </motion.div>

        {/* Accordion list — border bawah per item */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          {FAQS.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="border-b border-zinc-800/80">
              <button
                onClick={() => toggleFaq(i)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-zinc-200 pr-8">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-4 w-4 text-zinc-600" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-zinc-500">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


/* ========================================
   CONTACT — Form transparan + info kontak
======================================== */
function ContactSection() {
  return (
    <section id="contact" className="border-t border-zinc-800/50 py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            Contact
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Mulai proyek Anda.
          </h2>
          <p className="mt-4 text-zinc-500">
            Ceritakan ide Anda. Tim kami akan menghubungi dalam 1x24 jam.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 gap-16 lg:grid-cols-5"
        >
          {/* Form — kiri (3 kolom) */}
          <motion.form
            variants={fadeUp}
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6 lg:col-span-3"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Nama</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Email</label>
                <input
                  type="email"
                  placeholder="email@domain.com"
                  className="w-full rounded-lg border border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">Paket</label>
              <select className="w-full rounded-lg border border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-400 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700">
                <option value="">Pilih paket</option>
                <option value="basic">Basic — 1.5 Juta</option>
                <option value="bisnis">Bisnis — 3.5 Juta</option>
                <option value="pro">Pro — 7 Juta</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">Pesan</label>
              <textarea
                rows={5}
                placeholder="Ceritakan tentang proyek Anda..."
                className="w-full resize-none rounded-lg border border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
            >
              <Send className="h-4 w-4" />
              Kirim Pesan
            </button>
          </motion.form>

          {/* Info kontak — kanan (2 kolom) */}
          <motion.div variants={fadeUp} className="space-y-8 lg:col-span-2">
            <ContactItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value="hello@threedevs.id"
            />
            <ContactItem
              icon={<Phone className="h-4 w-4" />}
              label="WhatsApp"
              value="+62 812-3456-7890"
            />
            <ContactItem
              icon={<MapPin className="h-4 w-4" />}
              label="Lokasi"
              value="Jakarta, Indonesia"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* Item kontak — minimalis, icon + teks */
function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-zinc-600">{icon}</div>
      <div>
        <p className="text-xs text-zinc-600">{label}</p>
        <p className="mt-0.5 text-sm text-zinc-300">{value}</p>
      </div>
    </div>
  );
}

/* ========================================
   FOOTER — Bersih dan rapi
======================================== */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/50 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Kiri — copyright */}
        <p className="text-xs text-zinc-600">
          &copy; {year} ThreeDevs. All rights reserved.
        </p>

        {/* Kanan — link */}
        <div className="flex items-center gap-6 text-xs text-zinc-600">
          <a href="#" className="transition-colors hover:text-zinc-400">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-zinc-400">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-zinc-400">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
