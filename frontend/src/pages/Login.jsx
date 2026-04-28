import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { API_URL } from '../config';

function Login() {
    const navigate = useNavigate();
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
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Success - for now just alert and redirect
            // In a real app, you'd save the token
            console.log('Login success:', data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050505] text-white font-inter min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <main className="w-full max-w-[1200px] grid lg:grid-cols-2 min-h-[800px] bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative z-10">

                {/* Left Side: Product Showcase */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#121212] relative overflow-hidden border-r border-white/5">
                    {/* Background decoration */}
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px]"></div>

                    <div className="relative z-10 space-y-12">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">PayPilot</span>
                        </div>

                        {/* Hero Text */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                                Analyze your wealth with <br />
                                <span className="text-[#34d399]">institutional precision.</span>
                            </h1>
                            <p className="text-lg text-white/50 leading-relaxed">
                                Access high-fidelity financial insights, automated reconciliation, and multi-wallet management in one secure interface.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Security</p>
                                    <p className="text-sm font-medium text-white/80">Bank-grade Security</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <Activity className="w-5 h-5 text-indigo-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Updates</p>
                                    <p className="text-sm font-medium text-white/80">Real-time Sync</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Portfolio Card */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-64 bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl relative z-10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Active Portfolio</p>
                                <h4 className="text-2xl font-bold text-white">$142,850.00</h4>
                            </div>
                            <div className="px-2 py-1 bg-green-500/10 rounded-full">
                                <span className="text-[10px] text-green-500 font-bold">+12.5%</span>
                            </div>
                        </div>
                        <div className="h-12 w-full bg-white/5 rounded-lg overflow-hidden flex items-end">
                            <div className="flex items-end justify-between w-full h-full px-1 gap-1">
                                {[30, 45, 35, 50, 40, 60, 55, 70].map((h, i) => (
                                    <div key={i} className="bg-white/10 w-full rounded-t-sm" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Login Form */}
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
                                    <Link to="/forgot-password"><span className="text-xs text-white/30 hover:text-white transition-colors">Forgot password?</span></Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                    <input
                                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-5 h-5 rounded-md bg-white/5 border border-white/10 appearance-none checked:bg-[#4f46e5] checked:border-transparent transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45"
                                />
                                <label htmlFor="remember" className="text-xs text-white/40 select-none cursor-pointer">Remember me for 30 days</label>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>

                        <div className="space-y-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                                    <span className="bg-[#0a0a0a] px-4 text-white/20">or continue with</span>
                                </div>
                            </div>

                            <button className="w-full border border-white/10 hover:border-white/30 bg-white/5 py-4 rounded-xl flex items-center justify-center gap-3 transition-all">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.27 2.69 1.186 6.623l4.08 3.142z" />
                                    <path fill="#FBBC05" d="M1.186 6.623L5.266 9.765A7.077 7.077 0 0 1 5.09 12c0 .77.127 1.514.364 2.204l-4.268 3.284A11.91 11.91 0 0 1 0 12c0-1.92.445-3.73 1.186-5.377z" />
                                    <path fill="#4285F4" d="M12 24c3.245 0 5.973-1.073 7.964-2.909l-3.837-3.142c-1.118.745-2.545 1.182-4.127 1.182-3.19 0-5.891-2.155-6.855-5.064l-4.268 3.284C3.127 21.31 7.218 24 12 24z" />
                                    <path fill="#34A853" d="M23.836 12.3c0-.85-.073-1.664-.21-2.454H12v4.65h6.636c-.286 1.541-1.155 2.845-2.473 3.727l3.837 3.142C22.245 19.345 24 16.073 24 12c0-.1-.005-.2-.014-.3h-.15z" />
                                </svg>
                                <span className="text-sm font-medium text-white/80">Sign in with Google</span>
                            </button>

                            <p className="text-center text-sm text-white/40">
                                Don't have an account? <Link className="text-[#34d399] font-bold hover:underline" to="/signup">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Top Right Activity Card Mockup */}
            <div className="absolute top-12 right-12 hidden 2xl:block opacity-20 hover:opacity-40 transition-opacity">
                <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/5 w-64 space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-white/40" />
                        <span className="text-xs font-bold text-white/40 tracking-widest uppercase">Recent Activity</span>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-3/4 bg-white/5 rounded"></div>
                        <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                        <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
