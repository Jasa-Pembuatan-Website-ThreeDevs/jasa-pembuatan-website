import React, { useState, useEffect } from "react";
import AnalistikChart from "./components/AnalistikChart";
import axios from "./api/axios"; // Pastikan path ini benar
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // --- STATE UI (JANGAN DIUBAH) ---
    const [page, setPage] = useState("dashboard");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();

    const [admin, setAdmin] = useState('Admin');
    const [inisial, setInisial] = useState('A');

    // --- STATE DATA (DARI DATABASE) ---
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        profit: 0
    });
    const [financeRecords, setFinanceRecords] = useState([]); // Gabungan Order + Expense
    const [loading, setLoading] = useState(false);

    // --- STATE FORM INPUT ---
    const [financeType, setFinanceType] = useState('Income'); // 'Income' atau 'Expense'
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState('operasional'); // Default kategori expense

    // --- 1. FETCH DATA SAAT LOAD ---
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const name = localStorage.getItem('admin_name');

        if (!token) {
            navigate('/login/admin');
            return;
        }

        if (name) {
            setAdmin(name);
            setInisial(name.charAt(0).toUpperCase());
        }

        fetchData(token);
    }, []);

    const fetchData = async (token) => {
        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Panggil 4 API sekaligus
            const [incomeRes, expenseRes, ordersList, expensesList] = await Promise.all([
                axios.get("/api/admin/income-summary", { headers }),
                axios.get("/api/admin/expense-summary", { headers }),
                axios.get("/api/admin/orders", { headers }),
                axios.get("/api/admin/expenses", { headers })
            ]);

            // 1. Update Kartu Statistik
            const inc = incomeRes.data.total_income || 0;
            const exp = expenseRes.data.total_expense || 0;
            setStats({
                income: inc,
                expense: exp,
                profit: inc - exp
            });

            // 2. Gabungkan Order dan Expense jadi satu list untuk tabel
            const listOrders = ordersList.data.data.map(item => ({
                id: item.id,
                apiId: item.id, // ID asli database
                type: 'Income', // Tipe buat UI
                date: item.created_at,
                title: item.nama_pelanggan + " (" + item.paket_layanan + ")",
                amount: parseFloat(item.total_harga),
                category: 'Penjualan',
                status: item.status_pembayaran,
                source: 'order' // Penanda buat delete nanti
            }));

            const listExpenses = expensesList.data.data.map(item => ({
                id: item.id,
                apiId: item.id,
                type: 'Expense',
                date: item.tanggal_pengeluaran,
                title: item.judul + " (" + item.vendor + ")",
                amount: parseFloat(item.jumlah),
                category: item.kategori,
                status: 'Paid',
                source: 'expense'
            }));

            // Gabung dan Sortir dari yang terbaru
            const combined = [...listOrders, ...listExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
            setFinanceRecords(combined);

        } catch (error) {
            console.error("Gagal ambil data:", error);
            if(error.response?.status === 401) navigate('/login/admin');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. HANDLER: TAMBAH DATA (CREATE) ---
    const handleAddRecord = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (financeType === 'Income') {
                // INPUT PEMASUKAN (Order Manual)
                // Kita pakai logika: Keterangan = Nama Pelanggan
                await axios.post("/api/admin/orders/manual", {
                    nama_pelanggan: keterangan || "Klien Manual",
                    paket_layanan: "Manual Input",
                    total_harga: nominal,
                    status_pembayaran: "lunas", // Anggap langsung lunas kalau input manual
                    email: "manual@admin.com", // Dummy email
                    no_hp: "-"
                }, { headers });

            } else {
                // INPUT PENGELUARAN
                await axios.post("/api/admin/expenses", {
                    judul: keterangan,
                    jumlah: nominal,
                    kategori: kategori,
                    tanggal_pengeluaran: new Date().toISOString().split('T')[0], // Hari ini
                    vendor: "-"
                }, { headers });
            }

            // Reset Form & Refresh Data
            setNominal('');
            setKeterangan('');
            alert("Data berhasil disimpan!");
            fetchData(token);

        } catch (error) {
            console.error("Gagal simpan:", error);
            alert("Gagal menyimpan data. Cek inputan.");
        }
    };

    // --- 3. HANDLER: HAPUS DATA (DELETE) ---
    const handleDeleteRecord = async (record) => {
        if(!window.confirm(`Yakin hapus data: ${record.title}?`)) return;

        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (record.source === 'order') {
                await axios.delete(`/api/admin/orders/${record.apiId}`, { headers });
            } else {
                await axios.delete(`/api/admin/expenses/${record.apiId}`, { headers });
            }
            fetchData(token); // Refresh
        } catch (error) {
            console.error("Gagal hapus:", error);
            alert("Gagal menghapus data.");
        }
    };

    // --- 4. FORMAT ANGKA RUPIAH ---
    const formatRupiah = (num) => "Rp " + parseInt(num).toLocaleString("id-ID");

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_token');
        try {
            await axios.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` }});
        } catch(e) {}
        localStorage.clear();
        navigate('/login/admin');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* SIDEBAR (DESAIN TETAP) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>
                <div className="flex items-center justify-center h-20 border-b border-slate-700 bg-slate-950">
                    <h1 className="text-2xl font-bold tracking-wider text-indigo-400">ADMIN<span className="text-white">PANEL</span></h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button onClick={() => setPage("dashboard")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${page === "dashboard" ? "bg-indigo-600 shadow-lg shadow-indigo-500/30" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                        <i className="fa-solid fa-chart-line w-6 text-center"></i>
                        <span className="ml-3 font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => setPage("analistik")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${page === "analistik" ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                        <i className="fa-solid fa-chart-pie w-6 text-center"></i>
                        <span className="ml-3 font-medium">Data Analistik</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 transition rounded-lg hover:bg-red-500/10">
                        <i className="fa-solid fa-right-from-bracket w-6 text-center"></i>
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* HEADER */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-slate-500 hover:text-slate-800 transition">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-700">{admin}</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm">
                            {inisial}
                        </div>
                    </div>
                </header>

                {/* CONTENT BODY */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    {page === "dashboard" && (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* KARTU STATISTIK (DATA DINAMIS) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card 1: Pemasukan */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-green-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                <i className="fa-solid fa-wallet"></i>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">Total Pemasukan</p>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.income)}</h3>
                                    </div>
                                </div>

                                {/* Card 2: Pengeluaran */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-red-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                                <i className="fa-solid fa-money-bill-wave"></i>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">Total Pengeluaran</p>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.expense)}</h3>
                                    </div>
                                </div>

                                {/* Card 3: Profit */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-indigo-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                <i className="fa-solid fa-piggy-bank"></i>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">Keuntungan Bersih</p>
                                        </div>
                                        <h3 className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                                            {formatRupiah(stats.profit)}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION INPUT & TABLE */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* FORM CATATAN KEUANGAN (BERFUNGSI) */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                            <i className="fa-solid fa-pen-nib text-indigo-500"></i>
                                            Catatan Keuangan
                                        </h3>
                                        <form onSubmit={handleAddRecord} className="space-y-4">
                                            {/* Toggle Jenis */}
                                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => setFinanceType("Income")}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${financeType === "Income" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    Pemasukan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFinanceType("Expense")}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${financeType === "Expense" ? "bg-white text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                                >
                                                    Pengeluaran
                                                </button>
                                            </div>

                                            {/* Input Nominal */}
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Nominal (Rp)</label>
                                                <input
                                                    type="number"
                                                    value={nominal}
                                                    onChange={(e) => setNominal(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>

                                            {/* Input Keterangan */}
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                                    {financeType === 'Income' ? 'Nama Klien / Sumber' : 'Judul Pengeluaran'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={keterangan}
                                                    onChange={(e) => setKeterangan(e.target.value)}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                                                    placeholder={financeType === 'Income' ? "Contoh: Jasa Web Pak Budi" : "Contoh: Bayar Hosting"}
                                                    required
                                                />
                                            </div>

                                            {/* Dropdown Kategori (Khusus Expense) */}
                                            {financeType === "Expense" && (
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
                                                    <select
                                                        value={kategori}
                                                        onChange={(e) => setKategori(e.target.value)}
                                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                                                    >
                                                        <option value="operasional">Operasional</option>
                                                        <option value="gaji">Gaji Tim</option>
                                                        <option value="marketing">Marketing/Ads</option>
                                                        <option value="server">Server & Domain</option>
                                                        <option value="lainnya">Lainnya</option>
                                                    </select>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className={`w-full py-3 rounded-lg text-white font-bold transition shadow-md hover:shadow-lg ${financeType === "Income" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30" : "bg-red-500 hover:bg-red-600 shadow-red-500/30"}`}
                                            >
                                                {financeType === "Income" ? "+ Simpan Pemasukan" : "- Simpan Pengeluaran"}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* TABEL RIWAYAT (AMBIL DATA API) */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                                            <h3 className="font-bold text-slate-700">Riwayat Transaksi</h3>
                                            <button onClick={() => fetchData(localStorage.getItem('admin_token'))} className="text-xs text-indigo-600 hover:underline">Refresh Data</button>
                                        </div>
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider sticky top-0">
                                                    <tr>
                                                        <th className="px-6 py-4 font-semibold">Tanggal</th>
                                                        <th className="px-6 py-4 font-semibold">Keterangan</th>
                                                        <th className="px-6 py-4 font-semibold">Nominal</th>
                                                        <th className="px-6 py-4 font-semibold">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                                                    {loading ? (
                                                        <tr><td colSpan="4" className="text-center p-8">Memuat data...</td></tr>
                                                    ) : financeRecords.length > 0 ? (
                                                        financeRecords.map((r, i) => (
                                                            <tr key={i} className="hover:bg-slate-50 transition group">
                                                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                                                    {new Date(r.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <p className="font-medium text-slate-700">{r.title}</p>
                                                                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{r.category} • <span className={r.status === 'lunas' || r.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}>{r.status}</span></p>
                                                                </td>
                                                                <td className={`px-6 py-4 font-bold whitespace-nowrap ${r.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                                                                    {r.type === 'Income' ? '+' : '-'} {formatRupiah(r.amount)}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <button 
                                                                        onClick={() => handleDeleteRecord(r)}
                                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                                                                        title="Hapus Data"
                                                                    >
                                                                        <i className="fa-solid fa-trash text-xs"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="p-8 text-center text-slate-400">
                                                                Belum ada data transaksi.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

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