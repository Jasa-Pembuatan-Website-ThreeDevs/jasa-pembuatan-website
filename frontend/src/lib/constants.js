import {
  Code2,
  Database,
  Server,
  Cpu,
  Globe,
  ShieldCheck,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Team", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
];

export const PLANS = [
  {
    name: "Basic",
    price: "1",
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
    price: "2.99",
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
    price: "5.99",
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

export const TEAM = [
  {
    name: "Dannys Martha Favrillia",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The Unstoppable Frontend",
    img: "/dannys.jpeg",
  },
  {
    name: "Arya Prana Jaya",
    role: "Backend Developer",
    icon: Server,
    badge: "Backend Lead",
    img: "/arya.jpeg",
  },
  {
    name: "Dina",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The UI/UX Enthusiast",
    img: "/loren.jpeg",
  },
  {
    name: "Idgar",
    role: "QA Engineer",
    icon: ShieldCheck,
    badge: "The Strongest Quality Assurance",
    img: "https://i.pravatar.cc/300?img=56",
  },
  {
    name: "Okkyboy",
    role: "Frontend Developer",
    icon: Code2,
    badge: "The Frontend Energy",
    img: "/akbar.jpeg",
  },
];

export const FAQS = [
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

export const ORBITS = [
  {
    radius: 90,
    duration: 20,
    delay: 0,
    icons: [Code2, Database],
  },
  {
    radius: 155,
    duration: 30,
    delay: 0.5,
    icons: [Server, Cpu],
  },
  {
    radius: 220,
    duration: 40,
    delay: 1,
    icons: [Globe, ShieldCheck],
  },
];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
