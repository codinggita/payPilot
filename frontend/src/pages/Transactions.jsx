import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filters, setFilters] = useState({
        dateRange: 'Oct 1, 2023 - Oct 31, 2023',
        category: 'all',
        status: 'all'
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = '/api/transactions?limit=100';
            if (filters.category !== 'all') url += `&category=${filters.category}`;
            if (filters.status !== 'all') url += `&status=${filters.status}`;
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                setTransactions(result.data || []);
            }
        } catch (error) {
            console.error('Fetch transactions error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'matched': return { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Matched' };
            case 'pending': return { dot: 'bg-indigo-500 animate-pulse', text: 'text-indigo-400', label: 'Pending' };
            case 'disputed': return { dot: 'bg-rose-500', text: 'text-rose-400', label: 'Disputed' };
            default: return { dot: 'bg-slate-500', text: 'text-slate-400', label: status || 'Unknown' };
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Infrastructure': 'bg-indigo-500/10 text-indigo-400',
            'Software': 'bg-purple-500/10 text-purple-400',
            'Meals': 'bg-amber-500/10 text-amber-400',
            'Travel': 'bg-emerald-500/10 text-emerald-400',
            'Entertainment': 'bg-pink-500/10 text-pink-400',
            'Shopping': 'bg-cyan-500/10 text-cyan-400',
            'Food': 'bg-orange-500/10 text-orange-400'
        };
        return colors[category] || 'bg-slate-500/10 text-slate-400';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getMerchantIcon = (merchant) => {
        const icons = {
            'Netflix': '??',
            'Spotify': '??',
            'Amazon': '??',
            'AWS': '??',
            'Cloudflare': '??',
            'Adobe': '??',
            'Delta': '??'
        };
        for (const [key, icon] of Object.entries(icons)) {
            if (merchant.includes(key)) return icon;
        }
        return merchant.charAt(0).toUpperCase();
    };

    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                    {/* Header & Actions */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-4xl font-bold font-manrope text-white tracking-tight">Transactions</h2>
                            <p className="text-slate-400 mt-2">Review and reconcile your recent spending.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                                <span className="material-symbols-outlined text-lg">task_alt</span>
                                Mark as Reviewed
                            </button>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-[#1f2020]/60 backdrop-blur-md p-4 rounded-xl border border-white/5 mb-8 flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Range</span>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#292a2a] rounded-lg border border-white/10 hover:border-indigo-500/50 transition-colors text-sm">
                                <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
                                {filters.dateRange}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</span>
                            <select 
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="bg-[#292a2a] border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none min-w-[160px]"
                            >
                                <option value="all">All Categories</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Software">Software</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Travel">Travel</option>
                                <option value="Food">Food</option>
                                <option value="Shopping">Shopping</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setFilters({ ...filters, status: 'all' })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.status === 'all' ? 'bg-indigo-600 text-white' : 'bg-[#292a2a] text-slate-400 hover:bg-white/5'}`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setFilters({ ...filters, status: 'pending' })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.status === 'pending' ? 'bg-indigo-600 text-white' : 'bg-[#292a2a] text-slate-400 hover:bg-white/5'}`}
                                >
                                    Pending
                                </button>
                                <button 
                                    onClick={() => setFilters({ ...filters, status: 'disputed' })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.status === 'disputed' ? 'bg-indigo-600 text-white' : 'bg-[#292a2a] text-slate-400 hover:bg-white/5'}`}
                                >
                                    Disputed
                                </button>
                            </div>
                        </div>
                        <div className="ml-auto flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clear</span>
                            <button 
                                onClick={() => setFilters({ dateRange: 'Oct 1, 2023 - Oct 31, 2023', category: 'all', status: 'all' })}
                                className="text-indigo-400 hover:text-indigo-300 text-sm"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-8 h-[calc(100vh-320px)]">
                        {/* Table Section */}
                        <div className="flex-1 bg-[#1f2020]/60 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-[#292a2a] z-10">
                                        <tr className="border-b border-white/10">
                                            <th className="px-4 py-4 w-12">
                                                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-indigo-600 w-4 h-4" />
                                            </th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Merchant</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12">
                                                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                                </td>
                                            </tr>
                                        ) : transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12 text-slate-400">
                                                    No transactions found. Upload a bank statement to get started.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => {
                                                const statusStyle = getStatusStyle(tx.status);
                                                return (
                                                    <tr 
                                                        key={tx._id} 
                                                        className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedTransaction?._id === tx._id ? 'bg-indigo-500/5' : ''}`}
                                                        onClick={() => setSelectedTransaction(tx)}
                                                    >
                                                        <td className="px-4 py-4">
                                                            <input type="checkbox" className="rounded bg-white/5 border-white/10 text-indigo-600 w-4 h-4" />
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold">
                                                                    {getMerchantIcon(tx.merchant)}
                                                                </div>
                                                                <span className="font-medium text-white">{tx.merchant}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="font-bold text-white">-${tx.amount?.toFixed(2)}</span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(tx.category)}`}>
                                                                {tx.category || 'Uncategorized'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-400 text-sm">{formatDate(tx.date)}</td>
                                                        <td className="px-4 py-4 text-slate-500 text-xs">{tx.sourceAccount || 'Bank Statement'}</td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                                <span className={`text-xs font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="px-4 py-3 bg-[#1f2020] border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Showing {transactions.length} transactions</span>
                                <div className="flex gap-2">
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400">
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <span className="text-sm font-bold text-white px-2">1</span>
                                    <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Detail Drawer */}
                        {selectedTransaction && (
                            <div className="w-[420px] bg-[#1f2020]/80 backdrop-blur-xl border border-indigo-500/20 rounded-xl flex flex-col overflow-hidden shadow-2xl">
                                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-indigo-600/10">
                                    <h3 className="text-xl font-bold text-white font-manrope">Details</h3>
                                    <button 
                                        onClick={() => setSelectedTransaction(null)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="p-5 flex-1 overflow-y-auto space-y-5">
                                    {/* Receipt Card */}
                                    <div className="bg-white text-slate-900 rounded-xl p-5 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
                                        <div className="text-center mb-4">
                                            <h4 className="font-bold text-lg">{selectedTransaction.merchant}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Transaction Receipt</p>
                                        </div>
                                        <div className="border-t border-dashed border-slate-200 pt-4">
                                            <div className="flex justify-between text-sm">
                                                <span>{selectedTransaction.merchant}</span>
                                                <span className="font-bold">${selectedTransaction.amount?.toFixed(2)}</span>
                                            </div>
                                            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between font-bold text-lg">
                                                <span>Total</span>
                                                <span>${selectedTransaction.amount?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-center text-slate-400">
                                            TRANSACTION ID: {selectedTransaction._id?.slice(-12)}<br/>
                                            DATE: {formatDate(selectedTransaction.date)}
                                        </div>
                                    </div>
                                    {/* Status */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Reconciliation Status</h4>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined ${selectedTransaction.status === 'matched' ? 'text-emerald-400' : 'text-slate-500'}`}>check_circle</span>
                                                <span className="text-sm">{selectedTransaction.status === 'matched' ? 'Matched with Bank Statement' : 'Pending Reconciliation'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Notes */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notes</h4>
                                        <textarea 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600 resize-none" 
                                            placeholder="Add a memo for the audit trail..." 
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="p-5 bg-[#1b1c1c] border-t border-white/5 flex gap-3">
                                    <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">Flag Account</button>
                                    <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Approve</button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Transactions;
