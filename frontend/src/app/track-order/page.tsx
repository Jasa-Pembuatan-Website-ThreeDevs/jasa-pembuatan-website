"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Code2,
  Download,
  FileText,
  Layers3,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import api from "@/lib/api";

type TimelineStatus = "done" | "active" | "pending";

type TimelineItem = {
  title: string;
  description: string;
  status: TimelineStatus;
};


type OrderData = {
  order_id: string;
  nama_pelanggan: string;
  paket_layanan: string;
  total_harga: number;
  status_pembayaran: string;
  status_pengerjaan: string;
  progress: number;
  sisa_tagihan: number;
  handover_file?: string | null;
  created_at: string;
};

const BACKEND_ORIGIN = String(api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");

function buildFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

function buildTimeline(order: OrderData): TimelineItem[] {
  const p = order.progress ?? 0;
  const paid = order.status_pembayaran === "lunas" || order.status_pembayaran === "sudah_dp";
  return [
    {
      title: "Pembayaran Diterima",
      description: "Invoice telah dikonfirmasi dan project resmi masuk antrean.",
      status: paid ? "done" : "pending",
    },
    {
      title: "Riset & UI/UX Design",
      description: "Struktur halaman, referensi visual, dan flow pengguna selesai.",
      status: p >= 25 ? "done" : p >= 10 ? "active" : "pending",
    },
    {
      title: "Proses Development",
      description: "Frontend sedang dibangun dan diintegrasikan ke sistem utama.",
      status: p >= 75 ? "done" : p >= 40 ? "active" : "pending",
    },
    {
      title: "Quality Assurance",
      description: "Pemeriksaan responsif, performa, dan detail interaksi.",
      status: p >= 90 ? "done" : p >= 80 ? "active" : "pending",
    },
    {
      title: "Handover / Selesai",
      description: "Deploy final, akses admin, dan panduan singkat penggunaan.",
      status: p >= 100 ? "done" : p >= 95 ? "active" : "pending",
    },
  ];
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderFallback />}>
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(
    () => searchParams.get("invoice")?.trim() || "",
  );
  const [phone, setPhone] = useState(
    () => searchParams.get("phone")?.trim() || "",
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  const normalizedCode = useMemo(
    () => trackingCode.trim().toUpperCase(),
    [trackingCode],
  );

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trackingCode.trim() || !phone.trim()) {
      Swal.fire({ icon: "warning", title: "Data belum lengkap", text: "Masukkan nomor invoice dan nomor WhatsApp.", confirmButtonColor: "#22d3ee" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/track-order", {
        order_id: trackingCode.trim(),
        no_hp: phone.trim(),
      });
      setOrderData(res.data.data);
      setHasSearched(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Order tidak ditemukan.";
      Swal.fire({ icon: "error", title: "Tidak Ditemukan", text: msg, confirmButtonColor: "#22d3ee" });
      setOrderData(null);
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-cyan-400/20 selection:text-cyan-100">
      <Navbar />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-72 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-32 lg:pt-36">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-10 w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 shadow-2xl shadow-black/20">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Project Tracker
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
            Pantau progres website tanpa menunggu update manual.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
            Masukkan nomor invoice atau kode pesanan untuk melihat tahap
            pengerjaan, estimasi selesai, dan status pembayaran.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 flex w-full flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 focus-within:border-cyan-300/50 focus-within:ring-1 focus-within:ring-cyan-300/20"
          >
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                placeholder="Contoh: PRJ-A1B2C3"
                className="min-h-12 flex-1 bg-transparent px-4 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
                aria-label="Nomor invoice atau kode pesanan"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="No. WhatsApp (08xx...)"
                className="min-h-12 flex-1 bg-transparent px-4 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 sm:max-w-[14rem]"
                aria-label="Nomor WhatsApp"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-6 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {loading ? "Mencari..." : "Cari"}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {hasSearched && orderData && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-16 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch"
            >
              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <InfoTile
                  className="sm:col-span-2"
                  icon={<FileText className="h-5 w-5" />}
                  label="Nomor Invoice"
                  value={orderData.order_id}
                />

                <InfoTile
                  icon={<UserRound className="h-5 w-5" />}
                  label="Nama Klien"
                  value={orderData.nama_pelanggan}
                />

                <InfoTile
                  icon={<Layers3 className="h-5 w-5" />}
                  label="Paket Dipilih"
                  value={orderData.paket_layanan}
                />

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <CalendarDays className="h-4 w-4 text-violet-300" />
                        Status Pembayaran
                      </div>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-200 capitalize">
                        {orderData.status_pembayaran.replace("_", " ")}
                      </p>
                    </div>
                    <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {orderData.progress}%
                    </div>
                  </div>

                  <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-900">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${orderData.progress}%` }}
                      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-cyan-300">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                      Status Timeline
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Progres project saat ini sedang berada di tahap{" "}
                      {orderData.status_pengerjaan}.
                    </p>
                  </div>

                  <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-4 py-2 text-xs font-medium text-zinc-400">
                    <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                    {orderData.status_pembayaran === "lunas" ? "Lunas" : orderData.status_pembayaran === "sudah_dp" ? "DP Dibayar" : "Belum Bayar"}
                  </div>
                </div>

                <StatusTimeline items={buildTimeline(orderData)} />

                {orderData.progress >= 100 && orderData.handover_file && (
                  <div className="mt-10 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-emerald-200">
                          Project selesai
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                          File pengesahan atau handover project sudah tersedia.
                        </p>
                      </div>
                      <a
                        href={buildFileUrl(orderData.handover_file)}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"
                      >
                        <Download className="h-4 w-4" />
                        Download File
                      </a>
                    </div>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}

function TrackOrderFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pt-32">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-6 py-4 text-sm text-zinc-500">
          Memuat tracking order...
        </div>
      </section>
      <Footer />
    </main>
  );
}

function InfoTile({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-cyan-300">
        {icon}
      </div>
      <p className="mt-6 text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-300">
        {value}
      </p>
    </div>
  );
}

function StatusTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-4 space-y-9 border-l border-zinc-800">
      {items.map((item, index) => (
        <li key={item.title} className="relative pl-8">
          <TimelineDot status={item.status} />

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
            className="group"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3
                className={
                  item.status === "pending"
                    ? "text-base font-medium text-zinc-500"
                    : "text-base font-semibold text-zinc-200"
                }
              >
                {item.title}
              </h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </motion.div>
        </li>
      ))}
    </ol>
  );
}

function TimelineDot({ status }: { status: TimelineStatus }) {
  if (status === "done") {
    return (
      <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-600 bg-zinc-700 text-zinc-200 shadow-lg shadow-black/30">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center">
        <span className="absolute h-6 w-6 animate-ping rounded-full bg-cyan-400/40" />
        <span className="relative h-5 w-5 rounded-full border border-cyan-200 bg-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.75)]" />
      </span>
    );
  }

  return (
    <span className="absolute -left-[13px] top-0 h-6 w-6 rounded-full border border-zinc-600 bg-zinc-950" />
  );
}

function StatusBadge({ status }: { status: TimelineStatus }) {
  const label = {
    done: "Selesai",
    active: "Aktif",
    pending: "Pending",
  }[status];

  const className = {
    done: "border-zinc-700 bg-zinc-800/70 text-zinc-300",
    active: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
    pending: "border-zinc-800 bg-transparent text-zinc-600",
  }[status];

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${className}`}
    >
      {label}
    </span>
  );
}
