"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  Code2,
  FileText,
  Layers3,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

type TimelineStatus = "done" | "active" | "pending";

type TimelineItem = {
  title: string;
  description: string;
  status: TimelineStatus;
};

type ProjectOrder = {
  invoice: string;
  client: string;
  packageName: string;
  estimate: string;
  progress: number;
  timeline: TimelineItem[];
};

const DUMMY_ORDER: ProjectOrder = {
  invoice: "#INV-2026-TD01",
  client: "Nadya Prameswari",
  packageName: "Paket Bisnis Website",
  estimate: "28 Juni 2026",
  progress: 60,
  timeline: [
    {
      title: "Pembayaran Diterima",
      description: "Invoice telah dikonfirmasi dan project resmi masuk antrean.",
      status: "done",
    },
    {
      title: "Riset & UI/UX Design",
      description: "Struktur halaman, referensi visual, dan flow pengguna selesai.",
      status: "done",
    },
    {
      title: "Proses Development",
      description: "Frontend sedang dibangun dan diintegrasikan ke sistem utama.",
      status: "active",
    },
    {
      title: "Quality Assurance",
      description: "Pemeriksaan responsif, performa, dan detail interaksi.",
      status: "pending",
    },
    {
      title: "Handover / Selesai",
      description: "Deploy final, akses admin, dan panduan singkat penggunaan.",
      status: "pending",
    },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function TrackOrderPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const normalizedCode = useMemo(
    () => trackingCode.trim().toUpperCase(),
    [trackingCode],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
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
            className="mt-10 flex w-full flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 focus-within:border-cyan-300/50 focus-within:ring-1 focus-within:ring-cyan-300/20 sm:flex-row"
          >
            <input
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value)}
              placeholder="Contoh: INV-2026-TD01"
              className="min-h-12 flex-1 bg-transparent px-4 text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
              aria-label="Nomor invoice atau kode pesanan"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-6 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Cari
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {hasSearched && (
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
                  value={normalizedCode || DUMMY_ORDER.invoice}
                  helper={DUMMY_ORDER.invoice}
                />

                <InfoTile
                  icon={<UserRound className="h-5 w-5" />}
                  label="Nama Klien"
                  value={DUMMY_ORDER.client}
                />

                <InfoTile
                  icon={<Layers3 className="h-5 w-5" />}
                  label="Paket Dipilih"
                  value={DUMMY_ORDER.packageName}
                />

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <CalendarDays className="h-4 w-4 text-violet-300" />
                        Estimasi Selesai
                      </div>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-200">
                        {DUMMY_ORDER.estimate}
                      </p>
                    </div>
                    <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {DUMMY_ORDER.progress}%
                    </div>
                  </div>

                  <div className="mt-8 h-2 overflow-hidden rounded-full bg-zinc-900">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${DUMMY_ORDER.progress}%` }}
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
                      Progres project saat ini sedang berada di tahap
                      development.
                    </p>
                  </div>

                  <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-4 py-2 text-xs font-medium text-zinc-400">
                    <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                    Pembayaran valid
                  </div>
                </div>

                <StatusTimeline items={DUMMY_ORDER.timeline} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}

function InfoTile({
  icon,
  label,
  value,
  helper,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
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
      {helper && (
        <p className="mt-3 text-xs leading-5 text-zinc-600">
          Dummy result: {helper}
        </p>
      )}
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
