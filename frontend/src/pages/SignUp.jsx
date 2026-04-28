import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shield, Zap, RefreshCw, Rocket, Sparkles, Hexagon } from 'lucide-react';
import { API_URL } from '../config';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Success
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
                            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
                                Precision Finance for Modern Teams.
                            </h1>
                            <p className="text-lg text-white leading-relaxed">
                                Manage subscriptions, reconcile transactions, and scale your capital with institutional-grade tools.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Security</p>
                                    <p className="text-sm font-medium text-white/80">Bank-level AES-256 encryption</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Speed</p>
                                    <p className="text-sm font-medium text-white/80">Real-time ledger syncing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Card Showcase */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="relative z-10 mt-12 flex justify-center"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-600/20 rounded-3xl blur-2xl group-hover:bg-indigo-600/30 transition-all"></div>
                            <div className="w-[380px] h-[220px] bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] rounded-3xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 blur-xl"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <svg className="w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M5 8.5C5 7.11929 6.11929 6 7.5 6C8.88071 6 10 7.11929 10 8.5C10 9.88071 8.88071 11 7.5 11C6.11929 11 5 9.88071 5 8.5Z" />
                                        <path d="M14 8.5C14 7.11929 15.1193 6 16.5 6C17.8807 6 19 7.11929 19 8.5C19 9.88071 17.8807 11 16.5 11C15.1193 11 14 9.88071 14 8.5Z" />
                                        <path d="M14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5C19 16.8807 17.8807 18 16.5 18C15.1193 18 14 16.8807 14 15.5Z" />
                                    </svg>
                                    <span className="text-xl font-bold text-white opacity-80">SpendSync</span>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <p className="text-xl font-medium tracking-[0.2em] text-white/90">4582 •••• •••• 9012</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest mb-1">Card Holder</p>
                                            <p className="text-sm font-semibold text-white/80">ENTERPRISE CORE</p>
                                        </div>
                                        <div className="flex">
                                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md -mr-3"></div>
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex flex-col justify-center p-8 md:p-16 bg-[#0a0a0a]">
                    <div className="max-w-[440px] mx-auto w-full space-y-10">
                        <header className="space-y-3">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Create Account</h2>
                            <p className="text-white/40 leading-relaxed">
                                Join 2,000+ companies managing their spend with SpendSync.
                            </p>
                        </header>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block ml-1" htmlFor="fullName">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                    <input 
                                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all" 
                                        id="fullName" 
                                        placeholder="John Doe" 
                                        type="text" 
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block ml-1" htmlFor="password">Password</label>
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative group">
                                        <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                        <input 
                                            className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all" 
                                            id="confirmPassword" 
                                            placeholder="••••••••" 
                                            type="password" 
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    className="w-5 h-5 rounded-md bg-white/5 border border-white/10 appearance-none checked:bg-indigo-600 checked:border-transparent transition-all cursor-pointer relative after:content-[''] after:absolute after:hidden after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45 peer-checked:after:block"
                                    required
                                />
                                <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed">
                                    I agree to the <span className="text-white/80 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white/80 hover:underline cursor-pointer">Privacy Policy</span>.
                                </label>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-white/40">
                            Already have an account? <Link className="text-white font-bold hover:underline" to="/login">Log in</Link>
                        </p>

                        {/* Trusted By Section */}
                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Trusted by industry leaders</p>
                            <div className="flex justify-between items-center px-4 opacity-30 grayscale hover:opacity-60 transition-opacity">
                                <div className="flex items-center gap-2">
                                    <Rocket className="w-4 h-4" />
                                    <span className="text-sm font-bold tracking-tighter">STELLAR</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-bold tracking-tighter">GLOW</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Hexagon className="w-4 h-4" />
                                    <span className="text-sm font-bold tracking-tighter">VERTEX</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Testimonial Floating Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="fixed bottom-8 right-8 hidden lg:block"
            >
                <div className="bg-[#121212]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 max-w-[320px]">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <img 
                            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100" 
                            alt="Sarah Chen" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-white/70 italic leading-snug">"SpendSync saved us 20+ hours of reconciliation every month."</p>
                        <p className="text-[9px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Sarah Chen, CTO @ Vertex</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SignUp;
