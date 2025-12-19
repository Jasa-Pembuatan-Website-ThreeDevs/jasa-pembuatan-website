import React, { useState } from "react";
import AnalistikChart from "./components/AnalistikChart";

const AdminDashboard = () => {
    const [page, setPage] = useState("dashboard");
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const admin = "Dannys";
    const inisial = "D";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <div
                className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-all duration-300 transform
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block
      `}
            >
                <div className="p-6 text-xl font-bold text-indigo-600 border-b border-slate-50">
                    Dannys
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => {
                            setPage("dashboard");
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center p-3 rounded-xl transition ${
                            page === "dashboard"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        <i className="fa-solid fa-house w-6"></i>
                        <span className="font-medium ml-2">Dashboard</span>
                    </button>

                    <button
                        onClick={() => {
                            setPage("order");
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center p-3 rounded-xl transition ${
                            page === "order"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        <i className="fa-solid fa-cart-shopping w-6"></i>
                        <span className="font-medium ml-2">Orderan</span>
                    </button>

                    <button
                        onClick={() => {
                            setPage("uang");
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center p-3 rounded-xl transition ${
                            page === "uang"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        <i className="fa-solid fa-wallet w-6"></i>
                        <span className="font-medium ml-2">Keuangan</span>
                    </button>

                    <button
                        onClick={() => {
                            setPage("analistik");
                            setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center p-3 rounded-xl transition ${
                            page === "analistik"
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-slate-500 hover:bg-slate-100"
                        }`}
                    >
                        <i className="fa-solid fa-chart-line w-6"></i>
                        <span className="font-medium ml-2">Analistik</span>
                    </button>
                </nav>
            </div>

            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                ></div>
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-lg"
                        >
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <h2 className="hidden md:block font-bold text-slate-400 uppercase tracking-widest text-xs">
                            Dashboard System
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm font-bold text-slate-700">
                            {admin}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
                            {inisial}
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-10">
                    {page === "dashboard" && (
                        <div className="animate-in fade-in duration-500 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Halo, {admin}! 👋
                                    </h1>
                                    <p className="text-slate-500 text-sm">
                                        Berikut adalah ringkasan bisnismu hari
                                        ini.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition">
                                        <i className="fa-solid fa-calendar-day mr-2 text-indigo-600"></i>{" "}
                                        19 Des 2025
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                            <i className="fa-solid fa-bag-shopping"></i>
                                        </div>
                                        <span className="text-green-500 text-xs font-bold">
                                            +12%
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">
                                        Total Order
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        1,284
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <i className="fa-solid fa-money-bill-trend-up"></i>
                                        </div>
                                        <span className="text-green-500 text-xs font-bold">
                                            +5%
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">
                                        Omzet Hari Ini
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        Rp 4.2jt
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                                            <i className="fa-solid fa-users"></i>
                                        </div>
                                        <span className="text-slate-400 text-xs font-bold">
                                            Stable
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">
                                        Pelanggan Baru
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        48
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                                            <i className="fa-solid fa-box-archive"></i>
                                        </div>
                                        <span className="text-rose-500 text-xs font-bold">
                                            -2%
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">
                                        Stok Menipis
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        12 Item
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800 italic">
                                            Transaksi Terakhir
                                        </h3>
                                        <button
                                            onClick={() => setPage("order")}
                                            className="text-indigo-600 text-xs font-bold hover:underline"
                                        >
                                            Lihat Semua
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(item => (
                                            <div
                                                key={item}
                                                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <i className="fa-solid fa-user text-xs"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">
                                                            Customer #{item}20
                                                            {item}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            2 menit yang lalu
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    Rp 250.000
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-600 p-8 rounded-2xl shadow-lg shadow-indigo-200 text-white flex flex-col justify-center relative overflow-hidden">
                                    <i className="fa-solid fa-rocket absolute -right-4 -bottom-4 text-9xl text-indigo-500 opacity-50"></i>
                                    <h3 className="text-xl font-bold mb-2 relative z-10">
                                        Siap untuk Scale Up?
                                    </h3>
                                    <p className="text-indigo-100 text-sm mb-6 relative z-10">
                                        Data analistik menunjukkan peningkatan
                                        penjualan sebesar 20% pada kategori
                                        Elektronik bulan ini.
                                    </p>
                                    <button
                                        onClick={() => setPage("analistik")}
                                        className="bg-white text-indigo-600 w-fit px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition relative z-10"
                                    >
                                        Cek Analistik Lengkap
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {page === "order" && (
                        <div className="animate-in fade-in duration-300">
                            <h1 className="text-2xl font-bold mb-6">
                                Daftar Order
                            </h1>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">ID Order</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4 text-right">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <tr className="hover:bg-slate-50 transition">
                                            <td className="p-4 font-bold text-indigo-600">
                                                #9921
                                            </td>
                                            <td className="p-4 font-medium">
                                                Andi Wijaya
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    Success
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {page === "uang" && (
                        <div className="animate-in fade-in duration-300 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="text-2xl font-bold">
                                    Catatan Keuangan
                                </h1>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition">
                                    <i className="fa-solid fa-file-export mr-2"></i>{" "}
                                    Export Laporan
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">
                                    Tambah Data Baru
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">
                                            TIPE
                                        </label>
                                        <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition">
                                            <option>Income</option>
                                            <option>Expenses</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">
                                            NOMINAL
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Rp 0"
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">
                                            KETERANGAN
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Bayar Listrik"
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button className="w-full bg-indigo-600 text-white h-[46px] rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                            <i className="fa-solid fa-plus mr-2"></i>{" "}
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-8 border-indigo-600">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                                        Total Income
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        Rp 12.500.000
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-8 border-indigo-600">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                                        Total Expenses
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        Rp 4.200.000
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                                        <tr>
                                            <th className="p-4">Keterangan</th>
                                            <th className="p-4">Tipe</th>
                                            <th className="p-4">Nominal</th>
                                            <th className="p-4 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <tr className="hover:bg-slate-50 transition group">
                                            <td className="p-4 text-sm font-semibold text-slate-700">
                                                Penjualan Produk A
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                                    Income
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-indigo-600">
                                                Rp 500.000
                                            </td>
                                            <td className="p-4 flex justify-center gap-3">
                                                <button className="text-slate-300 hover:text-indigo-600 transition">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button className="text-slate-300 hover:text-red-500 transition">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition group">
                                            <td className="p-4 text-sm font-semibold text-slate-700">
                                                Beli Token Listrik
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                                                    Expenses
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-bold text-red-600">
                                                Rp 100.000
                                            </td>
                                            <td className="p-4 flex justify-center gap-3">
                                                <button className="text-slate-300 hover:text-indigo-600 transition">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button className="text-slate-300 hover:text-red-500 transition">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {page === "analistik" && <AnalistikChart />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
