"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Filter } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/api";

const formatRupiah = (n: number) => `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

const KATEGORI_OPTIONS = ["server", "domain", "marketing", "gaji", "operasional", "lainnya"];

type Expense = {
  id: number;
  judul: string;
  jumlah: number;
  kategori: string;
  vendor: string;
  no_referensi: string;
  tanggal_pengeluaran: string;
  catatan: string;
};

type ExpenseForm = Omit<Expense, "id">;

const emptyForm: ExpenseForm = {
  judul: "",
  jumlah: 0,
  kategori: "server",
  vendor: "",
  no_referensi: "",
  tanggal_pengeluaran: new Date().toISOString().split("T")[0],
  catatan: "",
};

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState("");
  const [modalData, setModalData] = useState<{ mode: "add" } | { mode: "edit"; data: Expense } | null>(null);

  async function fetchData() {
    try {
      const params = filterKategori ? { kategori: filterKategori } : {};
      const [expRes, sumRes] = await Promise.all([
        api.get("/admin/expenses", { params }),
        api.get("/admin/expense-summary"),
      ]);
      setExpenses(expRes.data.data ?? []);
      setSummary(sumRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [filterKategori]);

  async function handleDelete(exp: Expense) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus Pengeluaran?",
      text: `"${exp.judul}" akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#52525b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;
    try {
      await api.delete(`/admin/expenses/${exp.id}`);
      Swal.fire({ icon: "success", title: "Dihapus!", timer: 1500, showConfirmButton: false });
      fetchData();
    } catch {
      Swal.fire({ icon: "error", title: "Gagal menghapus", confirmButtonColor: "#22d3ee" });
    }
  }

  async function handleSave(form: ExpenseForm, id?: number) {
    try {
      if (id) {
        await api.put(`/admin/expenses/${id}`, form);
      } else {
        await api.post("/admin/expenses", form);
      }
      Swal.fire({ icon: "success", title: "Tersimpan!", timer: 1500, showConfirmButton: false });
      setModalData(null);
      fetchData();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.response?.data?.message, confirmButtonColor: "#22d3ee" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Pengeluaran</h1>
          <p className="mt-1 text-sm text-zinc-500">Catat dan kelola semua pengeluaran operasional.</p>
        </div>
        <button
          onClick={() => setModalData({ mode: "add" })}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition"
        >
          <Plus className="h-4 w-4" /> Tambah Pengeluaran
        </button>
      </div>

      {/* Summary + Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Total Pengeluaran</p>
          <p className="mt-1 text-lg font-semibold text-red-400">{formatRupiah(summary?.total_expense ?? 0)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-cyan-300/50"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.08] bg-white/[0.02]">
            <tr className="text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-6"><div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" /></td></tr>
              ))
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-600">Belum ada data pengeluaran.</td></tr>
            ) : expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-white/[0.02] transition">
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{exp.tanggal_pengeluaran}</td>
                <td className="px-4 py-3 text-zinc-200">{exp.judul}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 capitalize">
                    {exp.kategori}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400">{exp.vendor || "-"}</td>
                <td className="px-4 py-3 font-semibold text-red-400">{formatRupiah(exp.jumlah)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setModalData({ mode: "edit", data: exp })}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-cyan-300 transition"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp)}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalData && (
        <ExpenseModal
          mode={modalData.mode}
          initialData={modalData.mode === "edit" ? modalData.data : undefined}
          onClose={() => setModalData(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ────── Expense Form Modal ────── */
function ExpenseModal({
  mode,
  initialData,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  initialData?: Expense;
  onClose: () => void;
  onSave: (form: ExpenseForm, id?: number) => void;
}) {
  const [form, setForm] = useState<ExpenseForm>(
    initialData
      ? { judul: initialData.judul, jumlah: initialData.jumlah, kategori: initialData.kategori, vendor: initialData.vendor, no_referensi: initialData.no_referensi, tanggal_pengeluaran: initialData.tanggal_pengeluaran, catatan: initialData.catatan ?? "" }
      : emptyForm
  );

  const update = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...form, jumlah: Number(form.jumlah) }, initialData?.id);
        }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-white/[0.08] bg-zinc-950 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {mode === "add" ? "Tambah Pengeluaran" : "Edit Pengeluaran"}
          </h2>
          <button type="button" onClick={onClose}><X className="h-5 w-5 text-zinc-500" /></button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Judul</label>
            <input required value={form.judul} onChange={(e) => update("judul", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Jumlah (Rp)</label>
            <input required type="number" min={1000} value={form.jumlah} onChange={(e) => update("jumlah", +e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Kategori</label>
            <select value={form.kategori} onChange={(e) => update("kategori", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50">
              {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Vendor</label>
            <input value={form.vendor} onChange={(e) => update("vendor", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">No. Referensi</label>
            <input value={form.no_referensi} onChange={(e) => update("no_referensi", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Tanggal</label>
            <input required type="date" value={form.tanggal_pengeluaran} onChange={(e) => update("tanggal_pengeluaran", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-500">Catatan</label>
            <textarea rows={2} value={form.catatan} onChange={(e) => update("catatan", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-cyan-300/50 resize-none" />
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
