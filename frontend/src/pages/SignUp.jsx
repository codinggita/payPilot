import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shield, Zap, RefreshCw, Rocket, Sparkles, Hexagon } from 'lucide-react';
import { API_URL } from '../config';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { useFormik } from 'formik';
import { signupSchema } from '../utils/validationSchemas';


function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
        validationSchema: signupSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: values.fullName,
                        email: values.email,
                        password: values.password
                    }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Registration failed');
                if (data.token) {
                    dispatch(loginSuccess({ token: data.token, user: data.user }));
                }
                navigate('/dashboard');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="bg-[#050505] text-white font-inter min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <main className="w-full max-w-[1200px] grid lg:grid-cols-2 min-h-[800px] bg-[#0d0d0d] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative z-10">
                {/* Left Side */}
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
                            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
                                Precision Finance for Modern Teams.
                            </h1>
                            <p className="text-lg text-white leading-relaxed">
                                Manage subscriptions, reconcile transactions, and scale your capital with institutional-grade tools.
                            </p>
                        </div>
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
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex flex-col justify-center p-8 md:p-16 bg-[#0a0a0a]">
                    <div className="max-w-[440px] mx-auto w-full space-y-10">
                        <header className="space-y-3">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Create Account</h2>
                            <p className="text-white/40 leading-relaxed">
                                Join 2,000+ companies managing their spend with PayPilot.
                            </p>
                        </header>

                        <form className="space-y-6" onSubmit={formik.handleSubmit}>
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
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                    />
                                    {formik.touched.fullName && formik.errors.fullName && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.fullName}</div>
                                    )}
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
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                    )}
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
                                            placeholder=""
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="relative group">
                                        <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                                        <input
                                            className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/20 py-4 pl-12 pr-4 rounded-xl text-white placeholder:text-white/10 outline-none transition-all"
                                            id="confirmPassword"
                                            placeholder=""
                                            type="password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-5 h-5 rounded-md bg-white/5 border border-white/10 appearance-none checked:bg-indigo-600 checked:border-transparent transition-all cursor-pointer"
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
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignUp;
