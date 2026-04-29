import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

function Dashboard() {
    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            {/* Fixed Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                
                <main className="p-6 md:p-10 space-y-10">
                    {/* Header & Alerts */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-manrope text-white">Overview</h2>
                            <p className="text-slate-400 mt-2">Welcome back. Your financial ecosystem is currently stable.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-4 bg-red-950/20 border border-red-500/20 px-5 py-3 rounded-2xl">
                                <span className="material-symbols-outlined text-red-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                <div>
                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Action Required</p>
                                    <p className="text-sm font-semibold text-white">3 Unmatched charges</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-indigo-950/20 border border-indigo-500/20 px-5 py-3 rounded-2xl">
                                <span className="material-symbols-outlined text-indigo-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_repeat</span>
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Upcoming</p>
                                    <p className="text-sm font-semibold text-white">AWS renewal in 2 days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Spend */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-start mb-6">
                                <span className="material-symbols-outlined text-indigo-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_down</span>
                                    4.2%
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Total Spend</p>
                            <h2 className="text-2xl font-bold text-white tabular-nums">$124,592.00</h2>
                            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400 w-[65%] rounded-full shadow-[0_0_12px_rgba(129,140,248,0.4)]"></div>
                            </div>
                        </div>

                        {/* Active Subscriptions */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-start mb-6">
                                <span className="material-symbols-outlined text-indigo-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync_saved_locally</span>
                                <span className="text-indigo-400 text-xs font-bold">+2 new</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Active Subscriptions</p>
                            <h2 className="text-2xl font-bold text-white tabular-nums">48</h2>
                            <p className="text-xs text-slate-500 mt-4">Awaiting reconciliation: 3</p>
                        </div>

                        {/* Rewards Earned */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-start mb-6">
                                <span className="material-symbols-outlined text-amber-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                                <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">auto_graph</span>
                                    12%
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Rewards Earned</p>
                            <h2 className="text-2xl font-bold text-white tabular-nums">$8,240.50</h2>
                            <div className="flex mt-6 -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-[#121414]"></div>
                                <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#121414]"></div>
                                <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-[#121414]"></div>
                            </div>
                        </div>

                        {/* Monthly Savings */}
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                            <div className="flex justify-between items-start mb-6">
                                <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Target Hit</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Monthly Savings</p>
                            <h2 className="text-2xl font-bold text-white tabular-nums">$14,200.00</h2>
                            <div className="mt-6 flex justify-between items-end">
                                <div className="flex gap-1.5 items-end h-8">
                                    <div className="w-2 bg-white/10 h-3 rounded-full"></div>
                                    <div className="w-2 bg-white/10 h-5 rounded-full"></div>
                                    <div className="w-2 bg-white/10 h-4 rounded-full"></div>
                                    <div className="w-2 bg-emerald-500 h-8 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"></div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Spending Trend */}
                        <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                <h3 className="text-xl font-bold text-white font-manrope">Spending Trend</h3>
                                <div className="flex bg-white/5 p-1 rounded-xl">
                                    {['7D', '30D', '90D'].map((range) => (
                                        <button key={range} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${range === '30D' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative h-[320px] w-full">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,250 Q100,240 200,180 T400,120 T600,160 T800,40" fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round"></path>
                                    <path d="M0,250 Q100,240 200,180 T400,120 T600,160 T800,40 L800,300 L0,300 Z" fill="url(#chartGradient)"></path>
                                    <circle cx="800" cy="40" fill="#818cf8" r="6" className="animate-pulse"></circle>
                                    <text fill="#818cf8" fontWeight="bold" fontSize="14" x="740" y="30">$124k</text>
                                    <line stroke="white" strokeOpacity="0.05" x1="0" x2="800" y1="0" y2="0"></line>
                                    <line stroke="white" strokeOpacity="0.05" x1="0" x2="800" y1="100" y2="100"></line>
                                    <line stroke="white" strokeOpacity="0.05" x1="0" x2="800" y1="200" y2="200"></line>
                                    <line stroke="white" strokeOpacity="0.1" x1="0" x2="800" y1="300" y2="300"></line>
                                </svg>
                            </div>
                        </div>

                        {/* Categories Donut */}
                        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col">
                            <h3 className="text-xl font-bold text-white font-manrope mb-10">By Category</h3>
                            <div className="flex-1 flex flex-col justify-center items-center relative py-10">
                                <svg className="w-52 h-52 transform -rotate-90 overflow-visible">
                                    <circle cx="104" cy="104" fill="transparent" r="85" stroke="rgba(255,255,255,0.03)" strokeWidth="18"></circle>
                                    <circle cx="104" cy="104" fill="transparent" r="85" stroke="#818cf8" strokeDasharray="534" strokeDashoffset="160" strokeLinecap="round" strokeWidth="18"></circle>
                                    <circle cx="104" cy="104" fill="transparent" r="85" stroke="#34d399" strokeDasharray="534" strokeDashoffset="420" strokeLinecap="round" strokeWidth="18"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-white">$34.2k</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">SaaS Tools</span>
                                </div>
                            </div>
                            <div className="space-y-4 mt-auto">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                                        <span className="text-slate-300">Software & SaaS</span>
                                    </div>
                                    <span className="font-bold text-white">62%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                        <span className="text-slate-300">Infrastructure</span>
                                    </div>
                                    <span className="font-bold text-white">28%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                                        <span className="text-slate-300">Miscellaneous</span>
                                    </div>
                                    <span className="font-bold text-white">10%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Transactions Table */}
                        <div className="lg:col-span-8 glass-panel rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white font-manrope">Recent Transactions</h3>
                                <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02] border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Merchant</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Category</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Date</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[
                                            { merchant: 'Amazon Web Services', initial: 'A', category: 'Infrastructure', date: 'Oct 24, 2023', amount: '$12,450.00', status: 'Settled', color: 'emerald-400' },
                                            { merchant: 'Slack Technologies', initial: 'S', category: 'SaaS', date: 'Oct 23, 2023', amount: '$4,800.00', status: 'Settled', color: 'emerald-400' },
                                            { merchant: 'Google Workspace', initial: 'G', category: 'SaaS', date: 'Oct 22, 2023', amount: '$1,250.00', status: 'Pending', color: 'amber-400' }
                                        ].map((t, i) => (
                                            <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="px-8 py-5 flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm text-white">{t.initial}</div>
                                                    <span className="text-sm font-semibold text-white">{t.merchant}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg uppercase tracking-wider">{t.category}</span>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-slate-400 tabular-nums">{t.date}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-white tabular-nums">{t.amount}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-${t.color}/10 rounded-xl`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-${t.color}`}></div>
                                                        <span className={`text-[10px] font-bold text-${t.color} uppercase tracking-widest`}>{t.status}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                <h3 className="text-xl font-bold text-white font-manrope mb-6">Quick Actions</h3>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all group shadow-lg shadow-indigo-600/10 active:scale-[0.98]">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-2xl">add_circle</span>
                                            <span className="font-bold">Add Subscription</span>
                                        </div>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-5 border border-white/10 text-slate-300 hover:bg-white/5 rounded-2xl transition-all group active:scale-[0.98]">
                                        <div className="flex items-center gap-4">
                                            <span className="material-symbols-outlined text-2xl">sync_alt</span>
                                            <span className="font-bold">Reconcile Now</span>
                                        </div>
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            <div className="glass-panel rounded-3xl overflow-hidden relative min-h-[180px] border border-white/10">
                                <img 
                                    alt="Action banner background" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB85dDTphxp_KFTS1c4tIX1N7stCYLeUFjXGQQwB_VAxlnYpKT9HeBYEpqlobszZEhgwgml5S-bkWdu7gdkTH9ZR2-xvs8qyihi3UBPwKyDqRF2DhTmG0cZuofz8ZAFf2H9AYSMFnIS-oDKxcyuA8hpqoNOI95mo4ZhLd-jM5zAC9rENFUcqHOWN2Qib44mrgrwxCsQUfh6Wqnn2G2p8RPAZiNsR0brTnZMBEi0DMJMcMxvJHOxg68Exmvwi1aYgg9ENMLvbtlJack"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                                <div className="relative p-8 h-full flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-2xl font-bold text-white font-manrope">Optimize Spend</h4>
                                        <p className="text-sm text-slate-300 mt-2">We found 4 duplicate subscriptions. Save $1,200/yr.</p>
                                    </div>
                                    <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-6 flex items-center gap-2 hover:gap-4 transition-all">
                                        Review Insights <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
