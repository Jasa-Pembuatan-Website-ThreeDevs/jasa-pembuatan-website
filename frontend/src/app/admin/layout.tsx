"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Image,
  Receipt,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "@/lib/api";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/expenses", label: "Expenses", icon: Receipt },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Skip layout for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    const token = localStorage.getItem("admin_token");
    const name = localStorage.getItem("admin_name");
    if (!token) {
      router.replace("/admin/login");
    } else {
      setAdminName(name ?? "Admin");
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_name");
      router.replace("/admin/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-white/[0.08] bg-zinc-950">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-white/[0.08]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-zinc-950 font-bold text-sm">
            3D
          </div>
          <span className="font-semibold tracking-tight">ThreeDevs Admin</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex w-64 flex-col h-full bg-zinc-950 border-r border-white/[0.08]">
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/[0.08]">
              <span className="font-semibold tracking-tight">ThreeDevs</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {NAV_ITEMS.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/[0.08] p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.08] px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-zinc-400 hover:bg-white/[0.04]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-zinc-300">{adminName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
