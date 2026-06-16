"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

const formatRupiah = (n: number) =>
  `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

export default function AdminDashboardPage() {
  const [income, setIncome] = useState<any>(null);
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [incRes, expRes] = await Promise.all([
          api.get("/admin/income-summary"),
          api.get("/admin/expense-summary"),
        ]);
        setIncome(incRes.data);
        setExpense(expRes.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const totalIncome = income?.total_income ?? 0;
  const totalExpense = expense?.total_expense ?? 0;
  const netProfit = totalIncome - totalExpense;
  const pendingPayment = income?.stats?.pending_payment ?? 0;
  const activeProjects = income?.stats?.active_projects ?? 0;

  const statCards = [
    {
      label: "Total Pemasukan",
      value: formatRupiah(totalIncome),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Total Pengeluaran",
      value: formatRupiah(totalExpense),
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
    {
      label: "Profit Bersih",
      value: formatRupiah(netProfit),
      icon: DollarSign,
      color: netProfit >= 0 ? "text-cyan-400" : "text-red-400",
      bg: netProfit >= 0 ? "bg-cyan-400/10" : "bg-red-400/10",
    },
    {
      label: "Belum Bayar",
      value: pendingPayment,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Project Aktif",
      value: activeProjects,
      icon: Briefcase,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.02]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Ringkasan keuangan dan operasional ThreeDevs.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}
              >
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              <p className="text-xs font-medium text-zinc-500">{card.label}</p>
            </div>
            <p className={`mt-4 text-xl font-semibold tracking-tight ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Expense Breakdown */}
      {expense?.detail_per_kategori && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-6">
          <h2 className="text-base font-semibold text-zinc-100">
            Pengeluaran per Kategori
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(expense.detail_per_kategori as Record<string, number>).map(
              ([kategori, total]) => (
                <div
                  key={kategori}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-sm capitalize text-zinc-400">{kategori}</span>
                  <span className="text-sm font-semibold text-zinc-200">
                    {formatRupiah(total)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="flex items-start gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <p className="text-xs leading-5 text-zinc-500">
          Data diperbarui secara real-time dari database. Gunakan menu di sidebar
          untuk mengelola orders, portfolio, dan pengeluaran.
        </p>
      </div>
    </div>
  );
}
