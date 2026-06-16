"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import api from "@/lib/api";

type Package = {
  id: string;
  name: string;
  label: string;
  price: number;
  originalPrice: number;
  timeline: string;
  features: string[];
  popular?: boolean;
};

const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Paket Basic",
    label: "Basic",
    price: 999000,
    originalPrice: 1800000,
    timeline: "3-5 hari kerja",
    features: [
      "Landing page satu halaman",
      "Domain .my.id / .biz.id",
      "Hosting cloud 1GB",
      "Desain mobile friendly",
      "Tombol WhatsApp dan Google Maps",
      "SSL security",
    ],
  },
  {
    id: "bisnis",
    name: "Paket Bisnis",
    label: "Bisnis",
    price: 2990000,
    originalPrice: 6000000,
    timeline: "7-10 hari kerja",
    popular: true,
    features: [
      "5-7 halaman utama",
      "Domain .COM",
      "Hosting unlimited bandwidth",
      "Email bisnis",
      "Request update bulanan",
      "Prioritas support",
    ],
  },
  {
    id: "toko",
    name: "Paket Toko",
    label: "Toko",
    price: 5990000,
    originalPrice: 12000000,
    timeline: "14-21 hari kerja",
    features: [
      "Upload produk tanpa batas",
      "Server high performance",
      "Keranjang belanja dan checkout",
      "Integrasi ongkir",
      "Laporan penjualan",
      "Bantuan upload produk awal",
    ],
  },
];

const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

const hitungHemat = (asli: number, promo: number) =>
  Math.round(((asli - promo) / asli) * 100);

function loadSnapJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).snap) return resolve();
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-Ga97FJs02n0FVn3N"); // Replace with your Midtrans client key
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans"));
    document.body.appendChild(script);
  });
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function OrderPage() {
  const [selectedPaket, setSelectedPaket] = useState<Package>(PACKAGES[1]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    confirmEmail: "",
    no_hp: "",
    kebutuhan: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event?: React.FormEvent | React.MouseEvent) => {
    event?.preventDefault();

    if (formData.email !== formData.confirmEmail) {
      Swal.fire({ icon: "error", title: "Email tidak cocok", text: "Email dan konfirmasi email tidak sama.", confirmButtonColor: "#22d3ee" });
      return;
    }

    if (!formData.nama || !formData.email || !formData.no_hp) {
      Swal.fire({ icon: "warning", title: "Data belum lengkap", text: "Mohon isi semua field yang wajib.", confirmButtonColor: "#22d3ee" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/orders", {
        nama_pelanggan: formData.nama,
        email: formData.email,
        no_hp: formData.no_hp,
        paket_layanan: selectedPaket.name,
        total_harga: selectedPaket.price,
      });

      const snapToken = res.data.token;
      const orderData = res.data.data;

      // Load Midtrans snap.js dynamically
      await loadSnapJs();

      // Open Midtrans payment popup
      (window as any).snap.pay(snapToken, {
        onSuccess: async (result: any) => {
          Swal.fire({ icon: "success", title: "Pembayaran Berhasil!", text: "Pesanan Anda sedang diproses.", confirmButtonColor: "#22d3ee" });
          window.location.href = "/track-order";
        },
        onPending: () => {
          Swal.fire({ icon: "info", title: "Menunggu Pembayaran", text: `Invoice: ${orderData.order_id}. Selesaikan pembayaran Anda.`, confirmButtonColor: "#22d3ee" });
          window.location.href = "/track-order";
        },
        onError: () => {
          Swal.fire({ icon: "error", title: "Pembayaran Gagal", text: "Silakan coba lagi.", confirmButtonColor: "#22d3ee" });
        },
        onClose: () => {
          // User closed popup without paying
        },
      });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
      Swal.fire({ icon: "error", title: "Gagal Memproses", text: msg, confirmButtonColor: "#22d3ee" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-cyan-400/20 selection:text-cyan-100">
      <Navbar />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-96 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        </div>

        <section className="relative mx-auto max-w-6xl px-6 pb-28 pt-32 lg:pt-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-10 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end"
          >
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Checkout Project
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
                Mulai project website dengan alur yang jelas.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
                Pilih paket, isi data pemesan, lalu tim ThreeDevs akan
                menghubungi Anda untuk validasi kebutuhan dan jadwal pengerjaan.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["1", "Pilih paket"],
                ["2", "Isi data"],
                ["3", "Konfirmasi"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <p className="text-sm font-semibold text-cyan-200">{number}</p>
                  <p className="mt-1 text-xs text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <motion.form
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.section
                variants={fadeUp}
                className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-6"
              >
                <SectionHeader
                  icon={<FileText className="h-4 w-4" />}
                  title="Data Pemesan"
                  description="Gunakan kontak aktif agar proses validasi berjalan cepat."
                />

                <div className="mt-6 grid gap-5">
                  <InputField
                    label="Nama Lengkap"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={(v) => handleChange("nama", v)}
                    required
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Email"
                      type="email"
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={(v) => handleChange("email", v)}
                      required
                    />
                    <InputField
                      label="Konfirmasi Email"
                      type="email"
                      placeholder="Ketik ulang email"
                      value={formData.confirmEmail}
                      onChange={(v) => handleChange("confirmEmail", v)}
                      onPaste={(e) => e.preventDefault()}
                      required
                    />
                  </div>

                  <InputField
                    label="No WhatsApp"
                    type="tel"
                    placeholder="+62 812-xxxx-xxxx"
                    value={formData.no_hp}
                    onChange={(v) => handleChange("no_hp", v)}
                    required
                  />

                  <TextAreaField
                    label="Kebutuhan Singkat"
                    placeholder="Contoh: website company profile 5 halaman untuk bisnis kuliner."
                    value={formData.kebutuhan}
                    onChange={(v) => handleChange("kebutuhan", v)}
                  />
                </div>
              </motion.section>

              <motion.section
                variants={fadeUp}
                className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-6"
              >
                <SectionHeader
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Pilih Paket"
                  description="Paket masih bisa disesuaikan setelah konsultasi kebutuhan."
                />

                <div className="mt-6 grid gap-3">
                  {PACKAGES.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      selected={selectedPaket.id === pkg.id}
                      onSelect={() => setSelectedPaket(pkg)}
                    />
                  ))}
                </div>
              </motion.section>
            </motion.form>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <OrderSummary
                selectedPaket={selectedPaket}
                loading={loading}
                onSubmit={handleSubmit}
              />
            </motion.aside>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-zinc-950/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                Total
              </p>
              <p className="text-lg font-semibold text-cyan-300">
                {formatRupiah(selectedPaket.price)}
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Lanjutkan"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-cyan-300">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  required?: boolean;
};

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  onPaste,
  required,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-500">
        {label}
        {required && <span className="ml-1 text-cyan-300">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={onPaste}
        required={required}
        className="min-h-12 w-full rounded-lg border border-white/10 bg-zinc-950/50 px-4 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/20"
      />
    </div>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-500">
        {label}
      </label>
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/20"
      />
    </div>
  );
}

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: Package;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-lg border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-cyan-300/40 bg-cyan-300/[0.06]"
          : "border-white/[0.08] bg-zinc-950/30 hover:border-white/[0.14] hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex gap-4">
          <div
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              selected ? "border-cyan-300 bg-cyan-300 text-zinc-950" : "border-zinc-700"
            }`}
          >
            <AnimatePresence>
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">{pkg.name}</h3>
              {pkg.popular && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
                  Populer
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Estimasi pengerjaan {pkg.timeline}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-base font-semibold text-cyan-300">
            {formatRupiah(pkg.price)}
          </p>
          <p className="mt-1 text-xs text-zinc-600 line-through">
            {formatRupiah(pkg.originalPrice)}
          </p>
        </div>
      </div>
    </button>
  );
}

function OrderSummary({
  selectedPaket,
  loading,
  onSubmit,
}: {
  selectedPaket: Package;
  loading: boolean;
  onSubmit: (e?: React.FormEvent | React.MouseEvent) => void;
}) {
  const hemat = hitungHemat(selectedPaket.originalPrice, selectedPaket.price);

  return (
    <div className="sticky top-24 rounded-lg border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100">
        <ShieldCheck className="h-4 w-4" />
        Pembayaran aman dan terverifikasi
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
        Ringkasan
      </p>
      <h3 className="mt-3 text-xl font-semibold text-zinc-100">
        {selectedPaket.name}
      </h3>

      <div className="mt-5 space-y-3 border-b border-white/[0.08] pb-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Harga normal</span>
          <span className="text-zinc-600 line-through">
            {formatRupiah(selectedPaket.originalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Diskon promo</span>
          <span className="font-medium text-emerald-300">-{hemat}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Estimasi</span>
          <span className="font-medium text-zinc-300">{selectedPaket.timeline}</span>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {selectedPaket.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-6 text-zinc-400">
            <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-300/80" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-white/[0.08] pt-5">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm text-zinc-500">Total bayar</span>
          <span className="text-2xl font-semibold text-cyan-300">
            {formatRupiah(selectedPaket.price)}
          </span>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Lanjutkan Pembayaran"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <Lock className="h-3.5 w-3.5" />
          Data pemesanan dienkripsi
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <Clock3 className="h-3.5 w-3.5" />
          Tim kami merespons maksimal 1x24 jam
        </div>
      </div>
    </div>
  );
}
