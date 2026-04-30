import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const StatementRow = ({ name, type, date, account, status, active }) => (
    <tr className={`hover:bg-white/[0.03] transition-all cursor-pointer group ${active ? 'bg-indigo-500/5' : ''}`}>
        <td className="px-6 py-5">
            <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined ${type === 'pdf' ? 'text-rose-400' : 'text-indigo-400'}`}>
                    {type === 'pdf' ? 'picture_as_pdf' : 'csv'}
                </span>
                <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{name}</span>
            </div>
        </td>
        <td className="px-6 py-5 text-slate-400 text-sm font-medium tabular-nums">{date}</td>
        <td className="px-6 py-5 text-slate-400 text-sm font-medium">{account}</td>
        <td className="px-6 py-5">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                status === 'Parsed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
                <span className={`w-1 h-1 rounded-full ${status === 'Parsed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                {status}
            </span>
        </td>
        <td className="px-6 py-5 text-right">
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-600 hover:text-white">
                <span className="material-symbols-outlined text-lg">more_vert</span>
            </button>
        </td>
    </tr>
);

function Statements() {
    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />

                <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h2 className="text-4xl font-bold font-manrope text-white tracking-tight">Statements</h2>
                            <p className="text-slate-400 mt-2 font-medium">Manage and parse your financial reports for automatic reconciliation.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-bold text-sm active:scale-[0.98]">
                                <span className="material-symbols-outlined text-lg">file_download</span>
                                Export Parsed Data
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xl shadow-indigo-600/20 font-bold text-sm active:scale-[0.98]">
                                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                Upload Statement
                            </button>
                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-12 gap-10">
                        {/* History Table */}
                        <div className="col-span-12 lg:col-span-8 glass-panel rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl">
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white font-manrope">Upload History</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filter:</span>
                                    <select className="bg-transparent border-none text-xs font-bold text-indigo-400 focus:ring-0 cursor-pointer outline-none">
                                        <option>All Status</option>
                                        <option>Parsed</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02] border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">File Name</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <StatementRow name="Q3_Chase_Sapphire_9021.pdf" type="pdf" date="Oct 12, 2023" account="Main Operating" status="Parsed" />
                                        <StatementRow name="Amex_Business_Gold_Oct.csv" type="csv" date="Oct 10, 2023" account="Rewards Reserve" status="Pending" active={true} />
                                        <StatementRow name="Brex_Statement_Sep_Final.pdf" type="pdf" date="Oct 02, 2023" account="Growth Capital" status="Parsed" />
                                        <StatementRow name="SVB_Operating_Statement.pdf" type="pdf" date="Sep 28, 2023" account="Main Operating" status="Parsed" />
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-8 py-5 bg-[#1b1c1c]/40 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing 4 of 24 uploaded statements</span>
                                <div className="flex gap-4">
                                    <button className="p-1.5 hover:text-white transition-colors text-slate-500"><span className="material-symbols-outlined">chevron_left</span></button>
                                    <button className="p-1.5 hover:text-white transition-colors text-slate-500"><span className="material-symbols-outlined">chevron_right</span></button>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            {/* Data Preview Card */}
                            <div className="glass-panel rounded-3xl p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white font-manrope">Data Preview</h3>
                                    <span className="material-symbols-outlined text-emerald-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                </div>
                                <div className="bg-black/20 rounded-2xl p-5 border border-white/5 space-y-6">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Recent Entries</span>
                                        <span>Amount</span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { desc: 'Amazon Web Services', date: 'Oct 11, 2023', amount: '-$4,210.32', color: 'rose' },
                                            { desc: 'Vercel Inc', date: 'Oct 10, 2023', amount: '-$249.00', color: 'rose' },
                                            { desc: 'GitHub Sponsorships', date: 'Oct 09, 2023', amount: '-$1,200.00', color: 'rose' },
                                            { desc: 'Deposit Refund', date: 'Oct 08, 2023', amount: '+$850.00', color: 'emerald' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center group">
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.desc}</p>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight mt-1">{item.date}</p>
                                                </div>
                                                <span className={`text-sm tabular-nums font-bold text-${item.color}-400`}>{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 space-y-4">
                                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-lg">file_open</span>
                                        Download Original PDF
                                    </button>
                                    <button className="w-full py-4 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-lg">table_chart</span>
                                        Full Parse Report
                                    </button>
                                </div>
                            </div>

                            {/* Accuracy Card */}
                            <div className="glass-panel rounded-3xl p-8 relative group cursor-pointer overflow-hidden h-44 flex items-center justify-center border border-white/5 bg-indigo-600/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-50"></div>
                                <div className="relative z-10 text-center space-y-4">
                                    <div className="w-14 h-14 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto shadow-inner border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-indigo-400 text-2xl">bolt</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Auto-Reconcile is On</p>
                                        <p className="text-sm text-slate-400 mt-1 font-medium">System matching accuracy: <span className="text-white font-bold">99.4%</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Uploaded', value: '124', sub: '+3 this wk', color: 'indigo' },
                            { label: 'Parsed Accuracy', value: '99.8%', sub: 'AI Verified', color: 'emerald' },
                            { label: 'Pending Review', value: '02', sub: 'Requires focus', color: 'amber' },
                            { label: 'Storage Used', value: '1.2GB', sub: 'of 10GB', color: 'purple' }
                        ].map((stat, i) => (
                            <div key={i} className={`glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02] border-l-4 border-l-${stat.color}-500 shadow-xl`}>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-end justify-between mt-4">
                                    <h4 className="text-3xl font-bold text-white tabular-nums font-manrope">{stat.value}</h4>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-slate-500'}`}>
                                        {stat.sub}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Statements;
