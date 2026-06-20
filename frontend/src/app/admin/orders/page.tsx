"use client";

import { useState } from "react";
import { Download, FileUp, Plus, Pencil, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { useApi } from "@/hooks/useApi";
import api from "@/lib/api";

const formatRupiah = (n: number) => `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

type Order = {
  id: number;
  order_id: string;
  nama_pelanggan: string;
  email: string;
  no_hp: string;
  paket_layanan: string;
  total_harga: number;
  status_pembayaran: string;
  status_pengerjaan: string;
  progress: number;
  sisa_tagihan: number;
  handover_file?: string | null;
  created_at: string;
};

const STATUS_BAYAR = ["belum_bayar", "sudah_dp", "lunas"] as const;
const STATUS_KERJA = ["pending", "proses", "revisi", "selesai"] as const;
const BACKEND_ORIGIN = String(api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");

function buildFileUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}

export default function AdminOrdersPage() {
  const { data: ordersResponse, isLoading: loading, mutate } = useApi<{ data: Order[] }>("/admin/orders");
  const orders = ordersResponse?.data ?? [];
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [showManual, setShowManual] = useState(false);

  async function handleDelete(order: Order) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus Order?",
      text: `Order ${order.order_id} akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#52525b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      await api.delete(`/admin/orders/${order.id}`);
      Swal.fire({ icon: "success", title: "Dihapus!", timer: 1500, showConfirmButton: false });
      mutate();
    } catch {
      Swal.fire({ icon: "error", title: "Gagal menghapus", confirmButtonColor: "#22d3ee" });
    }
  }

  async function handleUpdate(data: any) {
    try {
      await api.put(`/admin/orders/${editOrder!.id}`, data);
      Swal.fire({ icon: "success", title: "Berhasil!", timer: 1500, showConfirmButton: false });
      setEditOrder(null);
      mutate();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal update", text: err.response?.data?.message, confirmButtonColor: "#22d3ee" });
    }
  }

  async function handleManualSubmit(data: any) {
    try {
      await api.post("/admin/orders/manual", data);
      Swal.fire({ icon: "success", title: "Order ditambahkan!", timer: 1500, showConfirmButton: false });
      setShowManual(false);
      mutate();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message, confirmButtonColor: "#22d3ee" });
    }
  }

  async function handleUploadHandover(order: Order) {
    const result = await Swal.fire<File>({
      title: "Upload File Pengesahan",
      text: "Upload PDF/DOC/ZIP/RAR maksimal 10MB untuk arsip project client.",
      input: "file",
      inputAttributes: {
        accept: ".pdf,.doc,.docx,.zip,.rar",
        "aria-label": "Upload file pengesahan project",
      },
      showCancelButton: true,
      confirmButtonText: order.handover_file ? "Ganti File" : "Upload",
      cancelButtonText: "Batal",
      confirmButtonColor: "#22d3ee",
      showLoaderOnConfirm: true,
      preConfirm: async (file) => {
        if (!file) {
          Swal.showValidationMessage("Pilih file terlebih dahulu.");
          return false;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          await api.post(`/admin/orders/${order.id}/handover`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return file;
        } catch (err: any) {
          const message = err.response?.data?.message || "Upload gagal.";
          Swal.showValidationMessage(message);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (!result.isConfirmed) return;

    Swal.fire({ icon: "success", title: "File tersimpan", timer: 1500, showConfirmButton: false });
    mutate();
  }

  function badge(text: string, color: string) {
    return (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${color}`}>
        {text.replace("_", " ")}
      </span>
    );
  }

  function paymentBadge(s: string) {
    const c = s === "lunas" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : s === "sudah_dp" ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
      : "border-zinc-700 bg-zinc-800 text-zinc-500";
    return badge(s, c);
  }

  function pengerjaanBadge(s: string) {
    const c = s === "selesai" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
      : s === "proses" ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
      : "border-zinc-700 bg-zinc-800 text-zinc-500";
    return badge(s, c);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">Kelola semua order dan pemasukan.</p>
        </div>
        <button
          onClick={() => setShowManual(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition"
        >
          <Plus className="h-4 w-4" /> Tambah Manual
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.08] bg-white/[0.02]">
            <tr className="text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Paket</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Pembayaran</th>
              <th className="px-4 py-3">Pengerjaan</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-6"><div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" /></td></tr>
              ))
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc-600">Belum ada order.</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.02] transition">
                <td className="px-4 py-3 font-mono text-xs text-cyan-300">{o.order_id}</td>
                <td className="px-4 py-3 text-zinc-300">{o.nama_pelanggan}</td>
                <td className="px-4 py-3 text-zinc-400">{o.paket_layanan}</td>
                <td className="px-4 py-3 text-zinc-300">{formatRupiah(o.total_harga)}</td>
                <td className="px-4 py-3">{paymentBadge(o.status_pembayaran)}</td>
                <td className="px-4 py-3">{pengerjaanBadge(o.status_pengerjaan)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-zinc-800">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: `${o.progress}%` }} />
                    </div>
                    <span className="text-xs text-zinc-500">{o.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleUploadHandover(o)}
                      className={`rounded-lg p-1.5 transition ${
                        o.handover_file
                          ? "text-emerald-400 hover:bg-emerald-500/10"
                          : "text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-300"
                      }`}
                      title={o.handover_file ? "Ganti file pengesahan" : "Upload file pengesahan"}
                    >
                      <FileUp className="h-3.5 w-3.5" />
                    </button>
                    {o.progress >= 100 && o.handover_file && (
                      <a
                        href={buildFileUrl(o.handover_file)}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="rounded-lg p-1.5 text-cyan-300 transition hover:bg-cyan-500/10"
                        title="Download file pengesahan"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button onClick={() => setEditOrder(o)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-300 transition">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(o)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editOrder && <EditModal order={editOrder} onClose={() => setEditOrder(null)} onSave={handleUpdate} />}

      {/* Manual Order Modal */}
      {showManual && <ManualModal onClose={() => setShowManual(false)} onSubmit={handleManualSubmit} />}
    </div>
  );
}

/* ────── Edit Modal ────── */
function EditModal({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (d: any) => void }) {
  const [status_pembayaran, setSP] = useState(order.status_pembayaran);
  const [status_pengerjaan, setSK] = useState(order.status_pengerjaan);
  const [progress, setProgress] = useState(order.progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-zinc-950 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Edit Order {order.order_id}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-zinc-500" /></button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Status Pembayaran</label>
            <select value={status_pembayaran} onChange={(e) => setSP(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50">
              {STATUS_BAYAR.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Status Pengerjaan</label>
            <select value={status_pengerjaan} onChange={(e) => setSK(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50">
              {STATUS_KERJA.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Progress ({progress}%)</label>
            <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(+e.target.value)}
              className="w-full accent-cyan-400" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/[0.04] transition">Batal</button>
          <button onClick={() => onSave({ status_pembayaran, status_pengerjaan, progress })}
            className="flex-1 rounded-lg bg-cyan-400 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition">Simpan</button>
        </div>
      </div>
    </div>
  );
}

/* ────── Manual Order Modal ────── */
function ManualModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (d: any) => void }) {
  const [form, setForm] = useState({ nama_pelanggan: "", email: "", no_hp: "", paket_layanan: "", total_harga: "", status_pembayaran: "lunas" });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-zinc-950 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Tambah Order Manual</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-zinc-500" /></button>
        </div>

        <div className="space-y-4">
          {(["nama_pelanggan", "email", "no_hp", "paket_layanan"] as const).map((k) => (
            <div key={k} className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500 capitalize">{k.replace("_", " ")}</label>
              <input value={form[k]} onChange={(e) => update(k, e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Total Harga</label>
            <input type="number" value={form.total_harga} onChange={(e) => update("total_harga", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Status Pembayaran</label>
            <select value={form.status_pembayaran} onChange={(e) => update("status_pembayaran", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50">
              {STATUS_BAYAR.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/[0.04] transition">Batal</button>
          <button onClick={() => onSubmit({ ...form, total_harga: Number(form.total_harga) })}
            className="flex-1 rounded-lg bg-cyan-400 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition">Simpan</button>
        </div>
      </div>
    </div>
  );
}
