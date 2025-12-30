import React, { useState, useEffect } from "react";
import AnalistikChart from "./components/AnalistikChart";
import axios from "./api/axios";
import { useNavigate } from 'react-router-dom';
import AdminPortfolioCRUD from './components/AdminPortfolioCrud.jsx';
import { showSuccess, showError, showConfirm } from './utils/swal';
import Swal from 'sweetalert2'; // Import Swal untuk Input Range

const AdminDashboard = () => {
    // --- STATE UI ---
    const [page, setPage] = useState("dashboard");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();

    const [admin, setAdmin] = useState('Admin');
    const [inisial, setInisial] = useState('A');

    // --- STATE DATA ---
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        profit: 0
    });
    const [financeRecords, setFinanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- STATE FORM INPUT ---
    const [financeType, setFinanceType] = useState('Income');
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [kategori, setKategori] = useState('operasional');

    // --- DATA KLIEN MANUAL ---
    const [manualClient, setManualClient] = useState({ email: '-', hp: '-' });

    // --- HELPER: GENERATE LINK WA ---
    const getWhatsAppLink = (noHp, nama, orderId) => {
        if (!noHp || noHp === '-') return "#";
        let formattedHp = noHp.toString();
        if (formattedHp.startsWith('0')) formattedHp = '62' + formattedHp.slice(1);
        const message = `Halo Kak ${nama}, saya Admin ThreeDevs. Terima kasih sudah order dengan ID: ${orderId}. Saya ingin konfirmasi mengenai project websitenya.`;
        return `https://wa.me/${formattedHp}?text=${encodeURIComponent(message)}`;
    };

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

            const [incomeRes, expenseRes, ordersList, expensesList] = await Promise.all([
                axios.get("/api/admin/income-summary", { headers }),
                axios.get("/api/admin/expense-summary", { headers }),
                axios.get("/api/admin/orders", { headers }),
                axios.get("/api/admin/expenses", { headers })
            ]);

            const inc = incomeRes.data.total_income || 0;
            const exp = expenseRes.data.total_expense || 0;
            setStats({ income: inc, expense: exp, profit: inc - exp });

            const listOrders = ordersList.data.data.map(item => ({
                id: item.id,
                apiId: item.id,
                type: 'Income',
                date: item.created_at,
                title: item.nama_pelanggan,
                desc: item.paket_layanan,
                order_id: item.order_id,
                phone: item.no_hp,
                email: item.email,
                progress: item.progress || 0, // <--- AMBIL DATA PROGRESS
                amount: parseFloat(item.total_harga),
                category: 'Penjualan',
                handover_file: item.handover_file,
                status: item.status_pembayaran,
                source: 'order'
            }));

            const listExpenses = expensesList.data.data.map(item => ({
                id: item.id,
                apiId: item.id,
                type: 'Expense',
                date: item.tanggal_pengeluaran,
                title: item.judul,
                desc: item.vendor || '-',
                amount: parseFloat(item.jumlah),
                category: item.kategori,
                status: 'Paid',
                source: 'expense'
            }));

            const combined = [...listOrders, ...listExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
            setFinanceRecords(combined);

        } catch (error) {
            console.error("Gagal ambil data:", error);
            if (error.response?.status === 401) navigate('/login/admin');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. HANDLER: TAMBAH DATA ---
    const handleAddRecord = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (financeType === 'Income') {
                await axios.post("/api/admin/orders/manual", {
                    nama_pelanggan: keterangan || "Klien Manual",
                    paket_layanan: "Manual Input",
                    total_harga: nominal,
                    status_pembayaran: "lunas",
                    email: manualClient.email !== '-' ? manualClient.email : "manual@admin.com",
                    no_hp: manualClient.hp !== '-' ? manualClient.hp : "-"
                }, { headers });
            } else {
                await axios.post("/api/admin/expenses", {
                    judul: keterangan,
                    jumlah: nominal,
                    kategori: kategori,
                    tanggal_pengeluaran: new Date().toISOString().split('T')[0],
                    vendor: "-"
                }, { headers });
            }
            setNominal(''); setKeterangan(''); setManualClient({ email: '-', hp: '-' });
            showSuccess("Data berhasil disimpan!");
            fetchData(token);
        } catch (error) {
            console.error("Gagal simpan:", error);
            showError("Gagal menyimpan data.");
        }
    };

    // --- 3. HANDLER: UPDATE PROGRESS (BARU) ---
    const handleUpdateProgress = async (order) => {
        const { value: progress } = await Swal.fire({
            title: 'Update Progress Project',
            input: 'range',
            inputLabel: `Set progress untuk ${order.title}`,
            inputAttributes: {
                min: 0,
                max: 100,
                step: 10
            },
            inputValue: order.progress || 0,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            inputValidator: (value) => {
                if (!value) return 'Progress tidak boleh kosong!'
            }
        });

        if (progress) {
            const token = localStorage.getItem('admin_token');
            try {
                await axios.put(`/api/admin/orders/${order.apiId}`, {
                    progress: progress
                }, { headers: { Authorization: `Bearer ${token}` } });

                showSuccess(`Progress berhasil diupdate ke ${progress}%`);
                fetchData(token);
            } catch (error) {
                console.error(error);
                showError("Gagal update progress.");
            }
        }
    };

    // --- 4. HANDLER: HAPUS DATA ---
    const handleDeleteRecord = async (record) => {
        const result = await showConfirm(`Yakin hapus data: ${record.title}?`);
        if (!result.isConfirmed) return;

        const token = localStorage.getItem('admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (record.source === 'order') {
                await axios.delete(`/api/admin/orders/${record.apiId}`, { headers });
            } else {
                await axios.delete(`/api/admin/expenses/${record.apiId}`, { headers });
            }
            fetchData(token);
        } catch (error) {
            console.error("Gagal hapus:", error);
            showError("Gagal menghapus data.");
        }
    };

    const formatRupiah = (num) => "Rp " + parseInt(num).toLocaleString("id-ID");

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_token');
        try { await axios.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } }); } catch (e) { }
        localStorage.clear();
        navigate('/login/admin');
    };

    // --- HANDLER: UPLOAD HANDOVER ---
    const handleUploadHandover = async (order) => {
        const { value: file } = await Swal.fire({
            title: 'Upload Aset Project',
            input: 'file',
            inputAttributes: {
                'accept': '.zip,.rar,.pdf,.doc,.docx',
                'aria-label': 'Upload file aset project'
            },
            html: `
                <p class="text-sm text-gray-500 mb-4">Upload file ZIP/PDF berisi source code atau akses login untuk klien.</p>
                ${order.handover_file ? `<p class="text-xs text-green-600">✅ File sudah ada (Upload ulang untuk menimpa)</p>` : ''}
            `,
            showCancelButton: true,
            confirmButtonText: 'Upload',
            showLoaderOnConfirm: true,
            preConfirm: async (file) => {
                if (!file) {
                    Swal.showValidationMessage('Pilih file dulu dong!');
                    return;
                }
                // Proses Upload via Axios
                const formData = new FormData();
                formData.append('file', file);

                const token = localStorage.getItem('admin_token');
                try {
                    await axios.post(`/api/admin/orders/${order.apiId}/handover`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (file) {
            showSuccess("File aset berhasil dikirim ke klien!");
            fetchData(localStorage.getItem('admin_token'));
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>
                <div className="flex items-center justify-center h-20 border-b border-slate-700 bg-slate-950">
                    <h1 className="text-2xl font-bold tracking-wider text-indigo-400">ADMIN<span className="text-white">PANEL</span></h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button onClick={() => setPage("dashboard")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${page === "dashboard" ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                        <i className="fa-solid fa-chart-line w-6 text-center"></i>
                        <span className="ml-3 font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => setPage("analistik")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${page === "analistik" ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                        <i className="fa-solid fa-chart-pie w-6 text-center"></i>
                        <span className="ml-3 font-medium">Data Analistik</span>
                    </button>
                    <button onClick={() => setPage("portfolio")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${page === "portfolio" ? "bg-indigo-600 shadow-lg" : "hover:bg-slate-800 text-slate-400 hover:text-white"}`}>
                        <i className="fa-solid fa-images w-6 text-center"></i>
                        <span className="ml-3 font-medium">Portfolio CMS</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 transition rounded-lg hover:bg-red-500/10">
                        <i className="fa-solid fa-right-from-bracket w-6 text-center"></i><span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-center md:justify-between px-8 shadow-sm">
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden text-slate-500 hover:text-slate-800 transition absolute left-4"><i className="fa-solid fa-bars text-xl"></i></button>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-700">{admin}</p><p className="text-xs text-slate-500">Super Admin</p></div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm">{inisial}</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
                    {page === "dashboard" && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* STATS CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-green-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-green-100 text-green-600 rounded-lg"><i className="fa-solid fa-wallet"></i></div><p className="text-slate-500 text-sm font-medium">Total Pemasukan</p></div>
                                        <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.income)}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-red-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-red-100 text-red-600 rounded-lg"><i className="fa-solid fa-money-bill-wave"></i></div><p className="text-slate-500 text-sm font-medium">Total Pengeluaran</p></div>
                                        <h3 className="text-2xl font-bold text-slate-800">{formatRupiah(stats.expense)}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-indigo-100"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><i className="fa-solid fa-piggy-bank"></i></div><p className="text-slate-500 text-sm font-medium">Keuntungan Bersih</p></div>
                                        <h3 className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>{formatRupiah(stats.profit)}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* INPUT & TABLE */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i className="fa-solid fa-pen-nib text-indigo-500"></i> Input Transaksi</h3>
                                        <form onSubmit={handleAddRecord} className="space-y-4">
                                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                                <button type="button" onClick={() => setFinanceType("Income")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${financeType === "Income" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pemasukan</button>
                                                <button type="button" onClick={() => setFinanceType("Expense")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${financeType === "Expense" ? "bg-white text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pengeluaran</button>
                                            </div>
                                            <div><label className="block text-xs font-medium text-slate-500 mb-1">Nominal (Rp)</label><input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" required /></div>
                                            <div><label className="block text-xs font-medium text-slate-500 mb-1">{financeType === 'Income' ? 'Nama Klien' : 'Judul Pengeluaran'}</label><input type="text" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={financeType === 'Income' ? "Nama Pelanggan" : "Bayar Server, Listrik, dll"} required /></div>
                                            {financeType === "Income" && (<div className="grid grid-cols-2 gap-2"><div><label className="block text-xs font-medium text-slate-500 mb-1">No WA</label><input type="text" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" placeholder="08..." onChange={(e) => setManualClient({ ...manualClient, hp: e.target.value })} /></div><div><label className="block text-xs font-medium text-slate-500 mb-1">Email</label><input type="text" className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm" placeholder="@..." onChange={(e) => setManualClient({ ...manualClient, email: e.target.value })} /></div></div>)}
                                            {financeType === "Expense" && (<div><label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label><select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="operasional">Operasional</option><option value="gaji">Gaji Tim</option><option value="marketing">Marketing/Ads</option><option value="server">Server & Domain</option><option value="lainnya">Lainnya</option></select></div>)}
                                            <button type="submit" className={`w-full py-3 rounded-lg text-white font-bold transition shadow-md hover:shadow-lg ${financeType === "Income" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30" : "bg-red-500 hover:bg-red-600 shadow-red-500/30"}`}>{financeType === "Income" ? "+ Simpan Pemasukan" : "- Simpan Pengeluaran"}</button>
                                        </form>
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white"><h3 className="font-bold text-slate-700">Riwayat & Order Masuk</h3><button onClick={() => fetchData(localStorage.getItem('admin_token'))} className="text-xs text-indigo-600 hover:underline">Refresh</button></div>
                                        <div className="overflow-x-auto flex-1">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider sticky top-0"><tr><th className="px-4 py-4 font-semibold">Tgl & ID</th><th className="px-4 py-4 font-semibold">Detail Transaksi</th><th className="px-4 py-4 font-semibold">Nominal</th><th className="px-4 py-4 font-semibold text-center">Aksi</th></tr></thead>
                                                <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
                                                    {loading ? (<tr><td colSpan="4" className="text-center p-8">Memuat data...</td></tr>) : financeRecords.length > 0 ? (
                                                        financeRecords.map((r, i) => (
                                                            <tr key={i} className="hover:bg-slate-50 transition group">
                                                                <td className="px-4 py-4 whitespace-nowrap align-top"><div className="text-slate-500 font-medium">{new Date(r.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}</div>{r.source === 'order' && (<div className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-1 inline-block border border-slate-200">#{r.order_id || 'MANUAL'}</div>)}</td>
                                                                <td className="px-4 py-4 align-top"><p className="font-bold text-slate-700">{r.title}</p><p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>{r.source === 'order' && (<div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-500">{r.phone && r.phone !== '-' && <span className="flex items-center gap-1"><i className="fa-brands fa-whatsapp text-green-500"></i> {r.phone}</span>}{r.email && r.email !== '-' && <span className="flex items-center gap-1"><i className="fa-regular fa-envelope text-indigo-400"></i> {r.email}</span>}</div>)}</td>
                                                                <td className="px-4 py-4 align-top"><div className={`font-bold whitespace-nowrap ${r.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>{r.type === 'Income' ? '+' : '-'} {formatRupiah(r.amount)}</div><div className="mt-1"><span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${r.status === 'lunas' || r.status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-500 border border-orange-100'}`}>{r.status}</span></div></td>
                                                                <td className="px-4 py-4 align-top text-center">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        {r.source === 'order' && (
                                                                            <button
                                                                                onClick={() => handleUpdateProgress(r)}
                                                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white transition"
                                                                                title={`Update Progress (Saat ini: ${r.progress}%)`}
                                                                            >
                                                                                <i className="fa-solid fa-chart-line text-xs"></i>
                                                                            </button>
                                                                        )}
                                                                        {r.source === 'order' && r.phone && r.phone !== '-' && (<a href={getWhatsAppLink(r.phone, r.title, r.order_id)} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 text-green-600 border border-green-200 hover:bg-green-500 hover:text-white transition" title="Chat WhatsApp"><i className="fa-brands fa-whatsapp text-sm"></i></a>)}
                                                                        {r.source === 'order' && (<a href={`/invoice/${r.order_id}`} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition" title="Lihat Invoice"><i className="fa-solid fa-file-invoice text-sm"></i></a>)}
                                                                        <button onClick={() => handleDeleteRecord(r)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition" title="Hapus Data"><i className="fa-solid fa-trash text-xs"></i></button>
                                                                        <button
                                                                            onClick={() => handleUploadHandover(r)}
                                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${r.handover_file
                                                                                    ? "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-500 hover:text-white"
                                                                                    : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-500 hover:text-white"
                                                                                }`}
                                                                            title={r.handover_file ? "File Sudah Ada (Klik untuk ganti)" : "Upload Aset Project"}
                                                                        >
                                                                            <i className="fa-solid fa-file-arrow-up text-xs"></i>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (<tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada data transaksi.</td></tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {page === "analistik" && <AnalistikChart />}
                    {page === "portfolio" && <AdminPortfolioCRUD />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;