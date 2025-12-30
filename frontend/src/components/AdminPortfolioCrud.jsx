import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { showSuccess, showError, showConfirm } from "../utils/swal";

const AdminPortfolioCRUD = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Form
    const [formData, setFormData] = useState({
        judul: "",
        kategori: "Toko Online",
        link_demo: "",
        deskripsi: "",
        gambar: null
    });
    const [previewImg, setPreviewImg] = useState(null);

    // 1. FETCH DATA
    const fetchPortfolios = async () => {
        try {
            const res = await axios.get('/api/portfolios');
            setPortfolios(res.data);
        } catch (error) {
            console.error("Gagal load portfolio", error);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    // 2. HANDLE FILE UPLOAD
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, gambar: file });
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    // 3. SUBMIT DATA
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Pakai FormData karena ada file upload
        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('kategori', formData.kategori);
        data.append('link_demo', formData.link_demo);
        data.append('deskripsi', formData.deskripsi);
        data.append('gambar', formData.gambar);

        try {
            const token = localStorage.getItem('admin_token');
            await axios.post('/api/admin/portfolios', data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }
            });

            showSuccess("Portfolio Berhasil Ditambahkan!");
            // Reset Form
            setFormData({ judul: "", kategori: "Toko Online", link_demo: "", deskripsi: "", gambar: null });
            setPreviewImg(null);
            fetchPortfolios(); // Refresh Tabel

        } catch (error) {
            console.error(error);
            showError("Gagal upload. Pastikan file gambar < 2MB.");
        } finally {
            setLoading(false);
        }
    };

    // 4. DELETE DATA
    const handleDelete = async (id) => {
        const confirm = await showConfirm("Yakin hapus project ini?");
        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`/api/admin/portfolios/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSuccess("Data terhapus.");
            fetchPortfolios();
        } catch (error) {
            showError("Gagal menghapus data.");
        }
    };

    return (
        <div className="space-y-8">
            {/* --- FORM INPUT --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-image text-indigo-500"></i> Upload Portfolio Baru
                </h3>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Judul Project</label>
                            <input 
                                type="text" 
                                required
                                value={formData.judul}
                                onChange={e => setFormData({...formData, judul: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Contoh: Website Company Profile"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Deskripsi Project</label>
                            <textarea 
                                type="text" 
                                required
                                value={formData.deskripsi}
                                onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Deskripsi singkat project"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
                            <select 
                                value={formData.kategori}
                                onChange={e => setFormData({...formData, kategori: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option>Toko Online</option>
                                <option>Company Profile</option>
                                <option>Landing Page</option>
                                <option>Sistem Informasi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Link Demo (Opsional)</label>
                            <input 
                                type="text" 
                                value={formData.link_demo}
                                onChange={e => setFormData({...formData, link_demo: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Upload Gambar (Max 2MB)</label>
                            <input 
                                type="file" 
                                required
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                        {previewImg && (
                            <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                        >
                            {loading ? "Mengupload..." : "Upload Project 🚀"}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- TABLE LIST --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-700">Daftar Project</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3">Gambar</th>
                                <th className="px-6 py-3">Judul & Kategori</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {portfolios.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3">
                                        <img 
                                            src={`http://localhost:8000${item.gambar}`} 
                                            alt={item.judul} 
                                            className="w-16 h-12 object-cover rounded-lg border"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="font-bold text-slate-800">{item.judul}</p>
                                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{item.kategori}</span>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-400 hover:text-red-600 transition"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPortfolioCRUD;