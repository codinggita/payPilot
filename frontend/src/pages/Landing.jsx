import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

function Landing() {
    return (
        <div className="min-h-screen bg-surface font-work-sans">
            {/* Top Navigation */}
            <nav className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant">
                <div className="max-w-7xl mx-auto px-6 md:px-container-padding h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <span className="text-2xl font-h1 tracking-tighter text-on-surface">PayPilot</span>
                        <div className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Platform</a>
                            <a className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#">Solutions</a>
                            <a className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors" href="#">Pricing</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="hidden sm:block text-sm font-semibold text-on-surface hover:text-primary transition-colors">Log In</button>
                        <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-40 pb-32 overflow-hidden hero-gradient">
                    <div className="max-w-7xl mx-auto px-6 md:px-container-padding relative z-10 text-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-label-caps mb-10"
                        >
                            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                            AI-Powered Financial Intelligence
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-h1 font-h1 text-on-surface leading-[1.05] tracking-tight mb-8"
                        >
                            Automate Your Spend,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Pilot Your Growth</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            PayPilot is the enterprise-grade reconciliation layer. We unify subscriptions, multi-program rewards, and vendor payments into one intelligent dashboard.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] transition-all active:scale-95">
                                Start Your Pilot
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 glass-card text-on-surface font-bold rounded-2xl hover:bg-white/5 transition-all active:scale-95">
                                Watch Demo
                            </button>
                        </motion.div>
                    </div>

                    {/* Bento Preview */}
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6"
                    >
                        <div className="md:col-span-8 glass-card rounded-3xl p-8 border-primary/20 bg-primary/5">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <p className="text-label-caps text-on-surface-variant mb-1">CASH FLOW VELOCITY</p>
                                    <h3 className="text-h3 font-h3 text-on-surface">$142,500.00</h3>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    +12.4%
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-3">
                                {[40, 55, 45, 75, 60, 85, 95].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: 1.2 + (i * 0.1) }}
                                        className={`w-full rounded-t-xl ${i === 6 ? 'bg-primary shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-primary/20'} hover:bg-primary/40 transition-colors cursor-pointer group relative`}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${(h * 1.5).toFixed(1)}k
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-6">
                            <div className="glass-card rounded-3xl p-6 flex-1 hover:border-primary/40 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">military_tech</span>
                                </div>
                                <p className="text-label-caps text-on-surface-variant mb-1">REWARDS OPTIMIZED</p>
                                <h4 className="text-2xl font-h3 text-on-surface mb-2">45,200 pts</h4>
                                <p className="text-sm text-on-surface-variant leading-relaxed">Detected across 4 corporate treasury wallets.</p>
                            </div>
                            <div className="glass-card rounded-3xl p-6 flex-1 hover:border-primary/40 transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">sync_alt</span>
                                </div>
                                <p className="text-label-caps text-on-surface-variant mb-1">SYNC ACCURACY</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <h4 className="text-2xl font-h3 text-on-surface">99.98%</h4>
                                </div>
                                <p className="text-sm text-on-surface-variant">1.2k+ transactions matched today.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="py-32 px-6 md:px-container-padding">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-h2 font-h1 text-on-surface mb-4">Built for Financial Precision</h2>
                            <p className="text-on-surface-variant max-w-2xl mx-auto">Modern tools for modern finance teams. No more manual ledgers.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: 'subscriptions', title: 'Subscription Stack', desc: 'Identify zombie accounts and duplicate seats automatically.' },
                                { icon: 'account_balance_wallet', title: 'Treasury Sync', desc: 'Real-time multi-bank and multi-wallet consolidation.' },
                                { icon: 'security', title: 'Compliance Engine', desc: 'Automated tax categorization and PCI DSS Level 1 security.' }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    variants={fadeInUp}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    className="p-8 rounded-[32px] bg-surface-container-low border border-outline-variant hover:border-primary/30 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-h3 text-on-surface mb-3">{feature.title}</h3>
                                    <p className="text-on-surface-variant leading-relaxed mb-6">{feature.desc}</p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:gap-3 transition-all">
                                        Learn more <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Transactions Demo */}
                <section className="py-32 bg-surface-container-lowest">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                            <div className="px-8 py-6 border-b border-outline-variant flex items-center justify-between">
                                <h3 className="text-xl font-h3 text-on-surface">Live Feed</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary tracking-widest uppercase">Real-Time</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container-high/50 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                                        <tr>
                                            <th className="px-8 py-4">Transaction</th>
                                            <th className="px-8 py-4 text-right">Amount</th>
                                            <th className="px-8 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant">
                                        {[
                                            { name: 'AWS Cloud Services', amount: '$4,240.12', status: 'Settled', color: 'emerald' },
                                            { name: 'Figma Professional', amount: '$145.00', status: 'Pending', color: 'primary' },
                                            { name: 'Google Workspace', amount: '$320.00', status: 'Settled', color: 'emerald' }
                                        ].map((t, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-5 font-medium text-on-surface">{t.name}</td>
                                                <td className="px-8 py-5 text-right font-tabular-nums text-on-surface">{t.amount}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Settled' ? 'bg-emerald-400' : 'bg-primary'}`}></span>
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6">
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="max-w-6xl mx-auto rounded-[48px] bg-primary p-12 md:p-24 relative overflow-hidden text-center"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-50">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_40%)]"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-h1 text-white mb-8 tracking-tight">Ready to pilot your growth?</h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">Join 500+ modern enterprises automating their financial operations with PayPilot.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-xl">
                                    Get Started Free
                                </button>
                                <button className="w-full sm:w-auto px-10 py-5 bg-primary-container/20 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/10 transition-all">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 border-t border-outline-variant bg-surface-container-lowest">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-h1 tracking-tighter text-on-surface block mb-6">PayPilot</span>
                        <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                            The intelligent reconciliation layer for the next generation of business. Secure, automated, and precise.
                        </p>
                    </div>
                    {[
                        { title: 'Product', links: ['Treasury', 'Rewards', 'Security', 'Pricing'] },
                        { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Legal'] },
                        { title: 'Social', links: ['Twitter', 'LinkedIn', 'Github'] }
                    ].map((col, i) => (
                        <div key={i}>
                            <h5 className="text-label-caps text-on-surface mb-6">{col.title}</h5>
                            <ul className="space-y-4">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <a className="text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-outline-variant px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-on-surface-variant">© 2024 PayPilot Systems Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">public</span>
                        <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">mail</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;