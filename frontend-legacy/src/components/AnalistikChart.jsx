// components/AnalistikChart.jsx
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'];

const AnalistikChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    // use shared api instance; ensure Authorization header present
    const inst = api;
    inst.defaults.baseURL = 'http://localhost:8000/api';
    inst.defaults.headers = inst.defaults.headers || {};
    inst.defaults.headers.Authorization = `Bearer ${token}`;

    const fetchSales = async () => {
      try {
        const res = await inst.get('/admin/analytics/income-vs-expense?days=30');
        if (!mounted) return;
        const mapped = (res.data || []).map(r => ({ ...r, bulan: r.date, penjualan: r.income, pengeluaran: r.expense }));
        setSalesData(mapped);
      } catch (e) {
        console.error('Failed to fetch income-vs-expense analytics', e);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await inst.get('/admin/analytics/top-categories');
        if (!mounted) return;
        setCategoryData(res.data || []);
      } catch (e) {
        console.error('Failed to fetch category analytics', e);
      }
    };

    Promise.all([fetchSales(), fetchCategories()]).then(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Analistik Bisnis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Utama - Penjualan */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-6">Tren Penjualan & Pengeluaran</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="penjualan" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} fillOpacity={0.12} fill="#fecaca" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Lingkaran - Kategori Barang */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="font-bold text-slate-700 mb-6 text-left">Kategori Terlaris</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             {categoryData.map((item, i) => (
               <div key={i} className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div> {item.name}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalistikChart;
