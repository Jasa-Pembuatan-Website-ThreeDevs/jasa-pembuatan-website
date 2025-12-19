import React, { useState, useEffect } from "react";
import AnalistikChart from "./components/AnalistikChart";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [page, setPage] = useState("dashboard");
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navigate = useNavigate();

    const [admin, setAdmin] = useState('Admin');
    const [inisial, setInisial] = useState('A');

    const [incomeSummary, setIncomeSummary] = useState(null);
    const [orders, setOrders] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [expenseSummary, setExpenseSummary] = useState(null);
    const [financeRecords, setFinanceRecords] = useState([]); // combined incomes + expenses for table

    // Form state for Catatan Keuangan
    const [financeType, setFinanceType] = useState('Income');
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState('operasional');

    // Load dashboard data
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const name = localStorage.getItem('admin_name');

        if (!token) {
            // Not logged in
            navigate('/login/admin');
            return;
        }

        if (name) {
            setAdmin(name);
            setInisial(name.charAt(0).toUpperCase());
        }

        const getApi = () => axios.create({ baseURL: 'http://localhost:8000/api', headers: { Authorization: `Bearer ${token}` } });

        const fetchSummary = async () => {
            try {
                const res = await getApi().get('/admin/income-summary');
                setIncomeSummary(res.data || null);
            } catch (err) {
                console.error('Failed to fetch income summary', err);
            }
        };

        const fetchOrders = async () => {
            try {
                const res = await getApi().get('/admin/orders');
                setOrders(res.data.data || res.data || []);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            }
        };

        const fetchExpenses = async () => {
            try {
                const res = await getApi().get('/admin/expenses');
                setExpenses(res.data.data || res.data || []);
            } catch (err) {
                console.error('Failed to fetch expenses', err);
            }
        };

        const fetchExpenseSummary = async () => {
            try {
                const res = await getApi().get('/admin/expense-summary');
                setExpenseSummary(res.data || null);
            } catch (err) {
                console.error('Failed to fetch expense summary', err);
            }
        };

        // Combined fetch for table: incomes and expenses
        const fetchFinanceRecords = async () => {
            try {
                const [incRes, expRes] = await Promise.all([
                    getApi().get('/admin/income').catch(e => ({ data: [] })),
                    getApi().get('/admin/expenses').catch(e => ({ data: [] })),
                ]);

                const incomes = incRes.data.data || incRes.data || [];
                const exps = expRes.data.data || expRes.data || [];

                // Normalize records with a common shape
                const normIncomes = incomes.map(i => ({
                    id: i.id,
                    type: 'Income',
                    description: i.paket_layanan || i.nama_pelanggan || '-',
                    nominal: i.total_harga || i.total || i.amount || 0,
                    tanggal: i.created_at || i.tanggal || null,
                    raw: i,
                }));

                const normExpenses = exps.map(e => ({
                    id: e.id,
                    type: 'Expenses',
                    description: e.judul || e.keterangan || '-',
                    nominal: e.jumlah || 0,
                    tanggal: e.tanggal_pengeluaran || e.created_at || null,
                    raw: e,
                }));

                const all = normIncomes.concat(normExpenses).sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
                setFinanceRecords(all);
            } catch (err) {
                console.error('Failed to fetch finance records', err);
            }
        };

        fetchSummary();
        fetchOrders();
        fetchExpenses();
        fetchExpenseSummary();
        fetchFinanceRecords();
    }, [navigate]);

    // Handler for submitting the finance form
    const handleFinanceSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/login/admin');
            return;
        }

        const api = axios.create({ baseURL: 'http://localhost:8000/api', headers: { Authorization: `Bearer ${token}` } });

        try {
            if (financeType === 'Income') {
                // create a manual order (treated as income)
                const payload = {
                    nama_pelanggan: keterangan || 'Manual Income',
                    paket_layanan: keterangan || 'Manual',
                    total_harga: Number(nominal) || 0,
                    status: 'paid',
                };

                await api.post('/admin/orders', payload);
            } else {
                // create expense
                const payload = {
                    judul: keterangan || 'Pengeluaran Manual',
                    jumlah: Number(nominal) || 0,
                    kategori: kategori || 'operasional',
                    vendor: '-',
                    no_referensi: '-',
                    tanggal_pengeluaran: new Date().toISOString().split('T')[0],
                };

                await api.post('/admin/expenses', payload);
            }

            // clear form
            setNominal('');
            setKeterangan('');

            // refresh data
            try { const r = await api.get('/admin/income-summary'); setIncomeSummary(r.data || null); } catch(_){}
            try { const r = await api.get('/admin/expense-summary'); setExpenseSummary(r.data || null); } catch(_){}
            try { const r = await api.get('/admin/orders'); setOrders(r.data.data || r.data || []); } catch(_){}
            try { const r = await api.get('/admin/expenses'); setExpenses(r.data.data || r.data || []); } catch(_){}

            // refresh combined list
            try {
                const [incRes, expRes] = await Promise.all([
                    api.get('/admin/income').catch(e => ({ data: [] })),
                    api.get('/admin/expenses').catch(e => ({ data: [] })),
                ]);
                const incomes = incRes.data.data || incRes.data || [];
                const exps = expRes.data.data || expRes.data || [];
                const normIncomes = incomes.map(i => ({ id: i.id, type: 'Income', description: i.paket_layanan || i.nama_pelanggan || '-', nominal: i.total_harga || 0, tanggal: i.created_at || null, raw: i }));
                const normExpenses = exps.map(e => ({ id: e.id, type: 'Expenses', description: e.judul || '-', nominal: e.jumlah || 0, tanggal: e.tanggal_pengeluaran || null, raw: e }));
                const all = normIncomes.concat(normExpenses).sort((a,b)=> new Date(b.tanggal||0)-new Date(a.tanggal||0));
                setFinanceRecords(all);
            } catch (_) {}

        } catch (err) {
            console.error('Failed to save finance record', err);
            alert('Gagal menyimpan data. Cek konsol untuk detail.');
        }
    };

    // delete handler for a finance record
    const handleDeleteRecord = async (record) => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;
        const api = axios.create({ baseURL: 'http://localhost:8000/api', headers: { Authorization: `Bearer ${token}` } });
        try {
            if (record.type === 'Expenses') {
                await api.delete(`/admin/expenses/${record.id}`);
            } else {
                await api.delete(`/admin/orders/${record.id}`);
            }
            // remove locally
            setFinanceRecords(prev => prev.filter(r => !(r.id === record.id && r.type === record.type)));
        } catch (err) {
            console.error('Failed to delete record', err);
            alert('Gagal menghapus data.');
        }
    };

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
                    ThreeDevs
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
                            <button
                                title="Logout"
                                onClick={async () => {
                                    const token = localStorage.getItem('admin_token');
                                    try {
                                        await axios.post('http://localhost:8000/api/admin/logout', {}, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                    } catch (e) {
                                        // ignore errors, we'll clear local state anyway
                                    }
                                    localStorage.removeItem('admin_token');
                                    localStorage.removeItem('admin_name');
                                    navigate('/login/admin');
                                }}
                                className="ml-3 text-sm bg-rose-50 text-rose-600 px-3 py-1 rounded-lg hover:bg-rose-100 transition"
                            >
                                Logout
                            </button>
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
                                        {orders ? orders.length : '—'}
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
                                        {incomeSummary ? `Rp ${Number(incomeSummary.total_income || 0).toLocaleString('id-ID')}` : '—'}
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
                                        {orders ?  (orders.filter(o => new Date(o.created_at) >= new Date(Date.now() - 1000*60*60*24)).length) : '—'}
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
                                        {orders && orders.length > 0 ? (
                                            orders
                                                .slice()
                                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                .slice(0, 3)
                                                .map((o) => (
                                                    <div
                                                        key={o.id}
                                                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                                <i className="fa-solid fa-user text-xs"></i>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">
                                                                    {o.customer_name || o.name || `Customer #${o.id}`}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    {new Date(o.created_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-800">
                                                            {o.total ? `Rp ${Number(o.total).toLocaleString('id-ID')}` : (o.amount ? `Rp ${Number(o.amount).toLocaleString('id-ID')}` : '—')}
                                                        </p>
                                                    </div>
                                                ))
                                        ) : (
                                            <p className="text-sm text-slate-400">Belum ada transaksi</p>
                                        )}
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
                                            <th className="p-4">Order Id</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4 text-right">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {orders && orders.length > 0 ? (
                                            orders.map(o => (
                                                <tr key={o.id} className="hover:bg-slate-50 transition">
                                                    <td className="p-4 font-bold text-indigo-600">#{o.id}</td>
                                                    <td className="text-xs text-slate-500">{o.order_id}</td>
                                                    <td className="p-4 font-medium">
                                                        <div className="text-sm font-bold">{o.customer_name || o.name || `Customer #${o.id}`}</div>
                                                        <div className="text-xs text-slate-500">{o.email || '-'}</div>
                                                        <div className="text-xs text-slate-500">{o.paket_layanan || '-'}</div>
                                                        <div className="text-xs text-slate-500">{o.no_hp || '-'}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {o.status || '-'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="p-4 text-sm text-slate-400">Belum ada order</td>
                                            </tr>
                                        )}
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
                                <form onSubmit={handleFinanceSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">TIPE</label>
                                        <select value={financeType} onChange={(e)=>setFinanceType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition">
                                            <option>Income</option>
                                            <option>Expenses</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">NOMINAL</label>
                                        <input value={nominal} onChange={(e)=>setNominal(e.target.value)} type="number" placeholder="Rp 0" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold ml-1 text-slate-500">KETERANGAN</label>
                                        <input value={keterangan} onChange={(e)=>setKeterangan(e.target.value)} type="text" placeholder="Contoh: Bayar Listrik" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition" />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="w-full">
                                            <label className="text-[10px] font-bold ml-1 text-slate-500">KATEGORI (untuk Expenses)</label>
                                            <select value={kategori} onChange={(e)=>setKategori(e.target.value)} className="w-full mt-1 bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm transition">
                                                <option value="operasional">operasional</option>
                                                <option value="server">server</option>
                                                <option value="domain">domain</option>
                                                <option value="marketing">marketing</option>
                                                <option value="gaji">gaji</option>
                                                <option value="lainnya">lainnya</option>
                                            </select>
                                            <button type="submit" className="mt-3 w-full bg-indigo-600 text-white h-[46px] rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                                <i className="fa-solid fa-plus mr-2"></i> Simpan
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-8 border-indigo-600">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                                        Total Income
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {incomeSummary ? `Rp ${Number(incomeSummary.total_income || 0).toLocaleString('id-ID')}` : 'Rp 0'}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-8 border-indigo-600">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                                        Total Expenses
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {expenseSummary ? `Rp ${Number(expenseSummary.total_expenses || 0).toLocaleString('id-ID')}` : 'Rp 0'}
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
                                            <th className="p-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {financeRecords && financeRecords.length > 0 ? (
                                            financeRecords.map(r => (
                                                <tr key={`${r.type}-${r.id}`} className="hover:bg-slate-50 transition group">
                                                    <td className="p-4 text-sm font-semibold text-slate-700">{r.description}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${r.type === 'Income' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}>
                                                            {r.type}
                                                        </span>
                                                    </td>
                                                    <td className={`p-4 text-sm font-bold ${r.type === 'Income' ? 'text-indigo-600' : 'text-red-600'}`}>Rp {Number(r.nominal || 0).toLocaleString('id-ID')}</td>
                                                    <td className="p-4 flex justify-center gap-3">
                                                        <button onClick={()=>{ /* TODO: implement edit later */ }} className="text-slate-300 hover:text-indigo-600 transition">
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button onClick={()=>handleDeleteRecord(r)} className="text-slate-300 hover:text-red-500 transition">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-sm text-slate-400">Belum ada catatan keuangan</td>
                                            </tr>
                                        )}
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
