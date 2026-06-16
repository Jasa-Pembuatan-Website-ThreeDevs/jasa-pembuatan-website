"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { RefreshCcw, Wifi, WifiOff, Server, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

/* ========================================
   ANIMATION VARIANTS
======================================== */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const pulseRing: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: [0.8, 1.6, 0.8],
    opacity: [0.4, 0, 0.4],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ========================================
   MAINTENANCE PAGE
======================================== */

export default function MaintenancePage() {
  const [status, setStatus] = useState<"checking" | "offline" | "online">("checking");
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = useCallback(async () => {
    setStatus("checking");
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      await api.get("/status", { signal: controller.signal });
      clearTimeout(timer);
      setStatus("online");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    checkConnection();
    // Auto-retry every 15 seconds
    const interval = setInterval(checkConnection, 15_000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
    checkConnection();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* ── Background grid + glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        {status === "offline" && (
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/[0.04] blur-[120px]" />
        )}
        {status === "online" && (
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* ── Animated icon ── */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <div className="relative">
            {/* Pulse rings */}
            <motion.div
              variants={pulseRing}
              initial="initial"
              animate="animate"
              className={`absolute inset-0 rounded-full border-2 ${
                status === "offline"
                  ? "border-rose-500/30"
                  : status === "online"
                  ? "border-emerald-500/30"
                  : "border-zinc-600/30"
              }`}
            />
            <motion.div
              variants={pulseRing}
              initial="initial"
              animate="animate"
              transition={{ delay: 1 }}
              className={`absolute -inset-2 rounded-full border ${
                status === "offline"
                  ? "border-rose-500/10"
                  : status === "online"
                  ? "border-emerald-500/10"
                  : "border-zinc-700/10"
              }`}
            />

            {/* Icon container */}
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border backdrop-blur-sm transition-colors duration-500 ${
                status === "offline"
                  ? "border-rose-500/20 bg-rose-500/10"
                  : status === "online"
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : "border-zinc-700/40 bg-zinc-800/40"
              }`}
            >
              {status === "offline" ? (
                <WifiOff className="h-8 w-8 text-rose-400" />
              ) : status === "online" ? (
                <Wifi className="h-8 w-8 text-emerald-400" />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCcw className="h-8 w-8 text-zinc-400" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Text content ── */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
          {status === "online" ? (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                Sistem Kembali Online
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Koneksi ke server berhasil dipulihkan. Anda akan diarahkan kembali...
              </p>
            </>
          ) : (
            <>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
                <Server className="h-3 w-3 text-orange-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                  Maintenance
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                Server Sedang Dalam Perbaikan
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Tim kami sedang melakukan pemeliharaan sistem untuk meningkatkan kualitas layanan.
                Mohon bersabar, kami akan segera kembali.
              </p>
            </>
          )}
        </motion.div>

        {/* ── Status info card ── */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mt-8 rounded-xl border border-white/[0.06] bg-zinc-900/50 p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Status</span>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                status === "offline"
                  ? "text-rose-400"
                  : status === "online"
                  ? "text-emerald-400"
                  : "text-zinc-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "offline"
                    ? "bg-rose-400"
                    : status === "online"
                    ? "bg-emerald-400"
                    : "animate-pulse bg-zinc-500"
                }`}
              />
              {status === "offline" ? "Offline" : status === "online" ? "Online" : "Memeriksa..."}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-500">Auto-retry</span>
            <span className="text-zinc-400">setiap 15 detik</span>
          </div>

          {retryCount > 0 && (
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Percobaan ulang</span>
              <span className="text-zinc-400">{retryCount}x</span>
            </div>
          )}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 flex flex-col gap-3"
        >
          <button
            onClick={handleRetry}
            disabled={status === "checking"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${status === "checking" ? "animate-spin" : ""}`} />
            {status === "checking" ? "Memeriksa..." : "Periksa Ulang Koneksi"}
          </button>

          {status === "online" && (
            <a
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-shadow hover:shadow-cyan-500/20"
            >
              Kembali ke Beranda
            </a>
          )}
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex items-center justify-center gap-1.5 text-[11px] text-zinc-700"
        >
          <ShieldCheck className="h-3 w-3" />
          <span>ThreeDevs &mdash; Infrastructure Team</span>
        </motion.div>
      </div>

      {/* ── Auto-redirect when online ── */}
      {status === "online" && <AutoRedirect />}
    </div>
  );
}

/* ========================================
   AUTO REDIRECT — Redirects to home after 3s
======================================== */

function AutoRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
