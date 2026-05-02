import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { API_URL } from '../config';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.token) {
                dispatch(loginSuccess({ token: data.token, user: data.user }));
                navigate('/dashboard');
            } else {
                console.error('No token received from server');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Connection failed. Make sure backend is running on port 5000');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] text-white font-inter min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <main className="w-full max-w-[1200px] grid lg:grid-cols-2 min-h-[800px] bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative z-10">
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#121212] relative overflow-hidden border-r border-white/5">
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px]"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">PayPilot</span>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                                Analyze your wealth with <br />
                                <span className="text-[#34d399]">institutional precision.</span>
                            </h1>
                            <p className="text-lg text-white/50 leading-relaxed">
                                Access high-fidelity financial insights, automated reconciliation, and multi-wallet management.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 md:p-16 bg-[#0a0a0a]">
                    <div className="max-w-[440px] mx-auto w-full space-y-10">
                        <header className="space-y-3">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h2>
                            <p className="text-white/40 leading-relaxed">
                                Enter your credentials to access your dashboard.
                            </p>
                        </header>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block ml-1" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                    <input
                                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all"
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block" htmlFor="password">Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                    <input
                                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all"
                                        id="password"
                                        placeholder="��������"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <p className="text-center text-sm text-white/40">
                            Don't have an account? <Link className="text-[#34d399] font-bold hover:underline" to="/signup">Create an account</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;
