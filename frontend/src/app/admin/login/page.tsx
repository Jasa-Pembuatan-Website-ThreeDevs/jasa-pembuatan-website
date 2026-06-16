"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/admin/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("admin_token", token);
      if (user?.name) localStorage.setItem("admin_name", user.name);

      router.push("/admin");
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Login gagal. Periksa kredensial.";

      if (status === 429) {
        Swal.fire({
          icon: "warning",
          title: "Terlalu Banyak Percobaan",
          text: msg,
          confirmButtonColor: "#22d3ee",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: msg,
          confirmButtonColor: "#22d3ee",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      {/* Glow effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-zinc-950 font-bold text-xl shadow-lg shadow-cyan-400/20">
            3D
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Admin Login
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            ThreeDevs Management System
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl space-y-6"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@threedevs.id"
              className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3.5 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/20"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-3.5 pr-12 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-cyan-300/50 focus:ring-1 focus:ring-cyan-300/20"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-700">
            <Shield className="h-3 w-3" />
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
