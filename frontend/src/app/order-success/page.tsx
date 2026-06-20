"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clipboard,
  FileText,
  Home,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const invoice = searchParams.get("invoice")?.trim().toUpperCase() || "";
  const phone = searchParams.get("phone")?.trim() || "";

  const trackHref = useMemo(() => {
    const params = new URLSearchParams();
    if (invoice) params.set("invoice", invoice);
    if (phone) params.set("phone", phone);
    const query = params.toString();
    return query ? `/track-order?${query}` : "/track-order";
  }, [invoice, phone]);

  const whatsappHref = useMemo(() => {
    const message = [
      "Halo ThreeDevs, pembayaran saya berhasil.",
      "",
      "Detail pesanan:",
      `- Nomor invoice: ${invoice || "-"}`,
      `- No. WhatsApp: ${phone || "-"}`,
      "",
      "Mohon diproses untuk tahap berikutnya. Terima kasih.",
    ].join("\n");

    return `https://wa.me/62895368757054?text=${encodeURIComponent(message)}`;
  }, [invoice, phone]);

  const copyInvoice = async () => {
    if (!invoice) return;

    try {
      await navigator.clipboard.writeText(invoice);
      Swal.fire({
        icon: "success",
        title: "Invoice disalin",
        text: "Simpan nomor ini untuk melacak progres order Anda.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "info",
        title: "Salin manual",
        text: `Nomor invoice Anda: ${invoice}`,
        confirmButtonColor: "#22d3ee",
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-cyan-400/20 selection:text-cyan-100">
      <Navbar />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-[44rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-0 top-80 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 pb-24 pt-32 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto grid w-full gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center"
        >
          <div>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Order Success
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
              Pembayaran berhasil. Project Anda sudah masuk antrean.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
              Simpan nomor invoice di bawah ini. Nomor tersebut dipakai untuk
              melacak progres pengerjaan dan konfirmasi ke tim ThreeDevs.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={trackHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-6 text-sm font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <Search className="h-4 w-4" />
                Lacak Order
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.07]"
              >
                <MessageCircle className="h-4 w-4" />
                Konfirmasi WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                    Nomor Invoice
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Gunakan untuk tracking order
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
              {invoice ? (
                <p className="break-all font-mono text-3xl font-semibold tracking-tight text-cyan-200 sm:text-4xl">
                  {invoice}
                </p>
              ) : (
                <p className="text-sm leading-6 text-zinc-500">
                  Nomor invoice tidak ditemukan di URL. Anda tetap bisa cek
                  email atau hubungi tim ThreeDevs untuk bantuan.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={copyInvoice}
              disabled={!invoice}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4" />
              Salin Nomor Invoice
            </button>

            <div className="mt-6 grid gap-3 border-t border-white/[0.08] pt-6">
              <InfoRow label="Status pembayaran" value="Berhasil" />
              <InfoRow label="Langkah berikutnya" value="Tim validasi kebutuhan" />
              {phone && <InfoRow label="WhatsApp" value={phone} />}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-zinc-100"
              >
                <Home className="h-4 w-4" />
                Beranda
              </Link>
              <Link
                href={trackHref}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-zinc-100"
              >
                Tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

function OrderSuccessFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 pt-32">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-6 py-4 text-sm text-zinc-500">
          Memuat detail invoice...
        </div>
      </section>
      <Footer />
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-zinc-950/35 px-4 py-3">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-right text-sm font-medium text-zinc-200">
        {value}
      </span>
    </div>
  );
}
