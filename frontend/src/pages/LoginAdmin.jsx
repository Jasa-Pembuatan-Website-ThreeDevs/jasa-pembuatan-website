import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showError } from '../utils/swal';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8000/api/admin/login', {
                email,
                password,
            });

            if (res.data && res.data.token) {
                // Simpan token dan user info
                localStorage.setItem('admin_token', res.data.token);
                if (res.data.user && res.data.user.name) {
                    localStorage.setItem('admin_name', res.data.user.name);
                }

                // Redirect ke dashboard
                navigate('/dashboard/admin');
            }
        } catch (err) {
            console.error('Login failed', err);
            showError(err.response?.data?.message || 'Login gagal. Periksa kredensial.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
                
                {/* Header Login */}
                <div className="bg-indigo-600 p-10 text-center relative">
                    {/* Variasi dekorasi dikit biar elegan */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
                    
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                        <i className="fa-solid fa-shield-halved text-indigo-600 text-3xl"></i>
                    </div>
                    <h1 className="text-white text-2xl font-bold tracking-tight">ADMIN LOGIN</h1>
                    <p className="text-indigo-100 text-xs font-medium uppercase tracking-widest mt-1">Management System</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleLogin} className="p-10 space-y-6">
                    
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                        <div className="relative group">
                            <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition"></i>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition text-sm"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                        <div className="relative group">
                            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition"></i>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition text-sm"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                            >
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-widest"
                    >
                        Masuk Sekarang <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>

                </form>

                {/* Footer Login */}
                <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                        &copy; 2025 Admin.Co System &bull; Secure Connection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
