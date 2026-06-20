"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { useApi } from "@/hooks/useApi";
import api from "@/lib/api";

type Portfolio = {
  id: number;
  judul: string;
  kategori: string;
  deskripsi: string;
  gambar: string;
  link_demo?: string;
};

const KATEGORI_OPTIONS = ["Landing Page", "Web App", "E-Commerce"];

export default function AdminPortfolioPage() {
  const { data: rawData, isLoading: loading, mutate } = useApi<any>("/portfolios");
  const items: Portfolio[] = rawData?.data ?? rawData ?? [];
  const [showAdd, setShowAdd] = useState(false);

  async function handleDelete(item: Portfolio) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus Portfolio?",
      text: `"${item.judul}" akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#52525b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      await api.delete(`/admin/portfolios/${item.id}`);
      Swal.fire({ icon: "success", title: "Dihapus!", timer: 1500, showConfirmButton: false });
      mutate();
    } catch {
      Swal.fire({ icon: "error", title: "Gagal menghapus", confirmButtonColor: "#22d3ee" });
    }
  }

  async function handleAdd(formData: FormData) {
    try {
      await api.post("/admin/portfolios", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({ icon: "success", title: "Berhasil ditambahkan!", timer: 1500, showConfirmButton: false });
      setShowAdd(false);
      mutate();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message, confirmButtonColor: "#22d3ee" });
    }
  }

  function getImageUrl(gambar: string) {
    if (!gambar) return "";
    return gambar.startsWith("http") ? gambar : `http://localhost:8000${gambar}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Portfolio</h1>
          <p className="mt-1 text-sm text-zinc-500">Kelola showcase project.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition"
        >
          <Plus className="h-4 w-4" /> Tambah Project
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.02]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] py-16 text-center text-zinc-600">
          Belum ada portfolio. Klik &quot;Tambah Project&quot; untuk memulai.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] transition hover:border-white/[0.14]"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={getImageUrl(item.gambar)}
                  alt={item.judul}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur">
                  {item.kategori}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{item.judul}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500 line-clamp-2">{item.deskripsi}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
    </div>
  );
}

function AddModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (fd: FormData) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_OPTIONS[0]);
  const [deskripsi, setDeskripsi] = useState("");
  const [linkDemo, setLinkDemo] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      Swal.fire({ icon: "warning", title: "Gambar wajib diisi", confirmButtonColor: "#22d3ee" });
      return;
    }
    const fd = new FormData();
    fd.append("judul", judul);
    fd.append("kategori", kategori);
    fd.append("deskripsi", deskripsi);
    fd.append("link_demo", linkDemo);
    fd.append("gambar", file);
    onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-white/[0.08] bg-zinc-950 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Tambah Portfolio</h2>
          <button type="button" onClick={onClose}><X className="h-5 w-5 text-zinc-500" /></button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Judul</label>
            <input required value={judul} onChange={(e) => setJudul(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Kategori</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50">
              {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Deskripsi</label>
            <textarea rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50 resize-none" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Link Demo (opsional)</label>
            <input value={linkDemo} onChange={(e) => setLinkDemo(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Gambar</label>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-2 rounded-lg border border-dashed border-white/10 bg-zinc-900 px-3 py-3 text-sm text-zinc-500 hover:border-cyan-300/30 transition">
              <Upload className="h-4 w-4" />
              {fileName || "Pilih gambar..."}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/[0.04] transition">Batal</button>
          <button type="submit" className="flex-1 rounded-lg bg-cyan-400 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition">Simpan</button>
        </div>
      </form>
    </div>
  );
}
