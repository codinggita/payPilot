import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import { Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const WalletCard = ({ wallet, onRefresh, isGridView }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    
    const handleDelete = async () => {
        if (!confirm(`Remove ${wallet.walletName} from your wallets?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/wallets/${wallet._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                alert('Wallet removed successfully');
                onRefresh();
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to remove wallet');
        }
    };
    
    const handleViewHistory = () => {
        setShowHistory(!showHistory);
    };
    
    const isActive = wallet.status === 'active';
    
    if (isGridView) {
        return (
            <div className={`glass-panel rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 border border-white/5 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 ${!isActive ? 'opacity-60 grayscale' : ''}`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">{wallet.walletName}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    {wallet.linkedCard ? `${wallet.provider} ${wallet.linkedCard}` : wallet.provider}
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-600"
                            >
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-36 bg-[#1f2020] rounded-xl border border-white/10 shadow-xl z-10">
                                    <button 
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        Remove Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-slate-500">Current Balance</span>
                        <div className="text-3xl font-bold text-white tabular-nums font-manrope tracking-tight">
                            ${wallet.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-slate-500">Rewards Balance</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                <span className="text-sm font-bold text-white">{wallet.rewardsBalance?.toLocaleString() || 0} pts</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 text-slate-500">Status</span>
                            <div className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                wallet.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'
                            }`}>
                                {wallet.status !== 'inactive' && <span className="w-1 h-1 rounded-full bg-emerald-500 mr-2"></span>}
                                {wallet.status === 'active' ? 'Active' : wallet.status}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 flex justify-between items-center transition-colors bg-white/5 group-hover:bg-white/[0.03]">
                    <span className="text-[10px] font-bold text-slate-500">
                        Last active: {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : 'Today'}
                    </span>
                    <button 
                        onClick={handleViewHistory}
                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all text-indigo-400 hover:text-indigo-300"
                    >
                        View History
                        {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>

                {/* Wallet History (Expandable) */}
                {showHistory && (
                    <div className="px-6 pb-4 bg-white/[0.02] border-t border-white/5">
                        <p className="text-xs text-slate-400 py-3">Recent Transactions for {wallet.walletName}:</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Initial Balance</span>
                                <span className="text-white font-medium">${wallet.balance?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Last Updated</span>
                                <span className="text-white font-medium">{new Date(wallet.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Provider</span>
                                <span className="text-white font-medium">{wallet.provider}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // List View
    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-indigo-400">account_balance_wallet</span>
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-slate-500">Name</p>
                            <p className="text-sm font-bold text-white">{wallet.walletName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Balance</p>
                            <p className="text-sm font-bold text-white">${wallet.balance?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Rewards</p>
                            <p className="text-sm font-bold text-amber-400">{wallet.rewardsBalance?.toLocaleString() || 0} pts</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Status</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${wallet.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                                {wallet.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <button 
                        onClick={handleViewHistory}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Details
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                        Remove
                    </button>
                </div>
            </div>
            {showHistory && (
                <div className="px-4 pb-4 bg-white/[0.02] border-t border-white/5">
                    <div className="grid grid-cols-4 gap-4 text-xs text-slate-400 py-2">
                        <span>Provider: <span className="text-white">{wallet.provider}</span></span>
                        <span>Last Active: <span className="text-white">{new Date(wallet.updatedAt).toLocaleDateString()}</span></span>
                        <span>Linked Card: <span className="text-white">{wallet.linkedCard || 'N/A'}</span></span>
                        <span>Created: <span className="text-white">{new Date(wallet.createdAt).toLocaleDateString()}</span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

function Wallets() {
    const [wallets, setWallets] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showAllActivity, setShowAllActivity] = useState(false);
    const [compareView, setCompareView] = useState(false);
    const [newWallet, setNewWallet] = useState({
        walletName: '',
        provider: '',
        balance: '',
        linkedCard: ''
    });

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/wallets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                setWallets(result.data || []);
                setTotalBalance(result.totalBalance || 0);
            }
        } catch (error) {
            console.error('Fetch wallets error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleAddWallet = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/wallets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    walletName: newWallet.walletName,
                    provider: newWallet.provider,
                    balance: parseFloat(newWallet.balance) || 0,
                    linkedCard: newWallet.linkedCard
                })
            });
            
            if (response.ok) {
                alert('Wallet added successfully');
                setShowAddModal(false);
                setNewWallet({ walletName: '', provider: '', balance: '', linkedCard: '' });
                fetchWallets();
            }
        } catch (error) {
            console.error('Add wallet error:', error);
            alert('Failed to add wallet');
        }
    };

    const handleViewAllActivity = () => {
        setShowAllActivity(!showAllActivity);
    };

    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10">
                    {/* Header */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Wallets Management</h1>
                            <p className="text-slate-400 mt-2 font-medium max-w-2xl leading-relaxed">
                                Monitor liquidity, manage rewards, and track real-time activity across all linked financial institutions and digital wallets.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="glass-panel rounded-2xl px-8 py-4 flex flex-col justify-center border border-white/5 shadow-xl bg-white/[0.02]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Liquidity</span>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold text-white font-manrope tracking-tight">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-xl">add_card</span>
                                Add Wallet
                            </button>
                        </div>
                    </div>

                    {/* Toolbar with Working Grid/List Toggle */}
                    <div className="flex items-center justify-between glass-panel px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                                    viewMode === 'grid' 
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                                        : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">grid_view</span> Grid
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                                    viewMode === 'list' 
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                                        : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">list</span> List
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${compareView ? "text-indigo-400" : "text-slate-500"}`}>Compare View {compareView ? "ON" : "OFF"}</span>
                            <button onClick={() => setCompareView(!compareView)} className="w-12 h-6 bg-white/5 rounded-full relative p-1 transition-all hover:bg-white/10 group">
                                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${compareView ? "bg-indigo-500 translate-x-full" : "bg-slate-500"}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Wallets Grid/List */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : wallets.length === 0 ? (
                        <div className="text-center py-12 glass-panel rounded-3xl border border-white/5">
                            <span className="material-symbols-outlined text-6xl text-slate-500 opacity-30">account_balance_wallet</span>
                            <p className="text-slate-400 mt-4">No wallets added yet</p>
                            <p className="text-sm text-slate-500 mt-1">Click "Add Wallet" to get started</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wallets.map((wallet) => (
                                <WalletCard key={wallet._id} wallet={wallet} onRefresh={fetchWallets} isGridView={true} />
                            ))}
                            
                            {/* Add New Placeholder */}
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-6 group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500 transition-all duration-500 bg-white/[0.02]">
                                    <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-indigo-400">add</span>
                                </div>
                                <div className="text-center space-y-2">
                                    <span className="text-lg font-bold text-white block font-manrope">Connect New Institution</span>
                                    <span className="text-xs text-slate-500 font-medium tracking-wide">Plaid-secured banking integration</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {wallets.map((wallet) => (
                                <WalletCard key={wallet._id} wallet={wallet} onRefresh={fetchWallets} isGridView={false} />
                            ))}
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="w-full border-2 border-dashed border-white/10 rounded-2xl p-6 flex items-center justify-center gap-4 group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-2xl text-slate-500 group-hover:text-indigo-400">add</span>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-white">Connect New Institution</span>
                            </button>
                        </div>
                    )}

                    
            {/* Compare View - Shows when toggled ON */}
            {compareView && wallets.length >= 2 && (
                <div className="glass-panel rounded-3xl border border-white/5 bg-white/[0.01] p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-400">compare</span>
                        Wallet Comparison
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase">Feature</th>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <th key={i} className="px-6 py-3 text-center text-xs font-bold text-white uppercase">{w.walletName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400">Balance</td>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <td key={i} className="px-6 py-4 text-center font-bold text-white">
                                            ${w.balance?.toFixed(2)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400">Rewards</td>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <td key={i} className="px-6 py-4 text-center font-bold text-amber-400">
                                            {w.rewardsBalance?.toLocaleString() || 0} pts
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400">Provider</td>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <td key={i} className="px-6 py-4 text-center text-slate-300">{w.provider}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400">Status</td>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <td key={i} className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${w.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-slate-400">Linked Card</td>
                                    {wallets.slice(0, 4).map((w, i) => (
                                        <td key={i} className="px-6 py-4 text-center text-slate-300">{w.linkedCard || "N/A"}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4">
                        Compare up to 4 wallets side by side. {wallets.length > 4 ? `(Showing first 4 of ${wallets.length} wallets)` : ""}
                    </p>
                </div>
            )}

            {compareView && wallets.length < 2 && (
                <div className="glass-panel rounded-3xl border border-white/5 p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-500 opacity-30">compare</span>
                    <p className="text-slate-400 mt-4">Add at least 2 wallets to use Compare View</p>
                </div>
            )}

                    {/* Recent Activity */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white font-manrope tracking-tight">Recent Activity</h2>
                            <button 
                                onClick={handleViewAllActivity}
                                className="text-indigo-400 font-bold text-sm uppercase tracking-widest hover:text-indigo-300 transition-colors border-b border-indigo-500/30 pb-1 flex items-center gap-1"
                            >
                                {showAllActivity ? 'Show Less' : 'View All Activity'}
                                {showAllActivity ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        </div>
                        <div className="glass-panel rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wallet</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(showAllActivity ? wallets : wallets.slice(0, 3)).map((wallet, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shadow-inner">
                                                        <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-white transition-colors">payments</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">Balance Update</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">
                                                            {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : 'Today'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-slate-300">{wallet.walletName}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black tracking-[0.1em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                                                    COMPLETED
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right tabular-nums font-black text-sm text-white">
                                                ${wallet.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    {wallets.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center text-slate-400">
                                                No recent activity
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Wallet Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1f2020] rounded-2xl max-w-md w-full p-6 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New Wallet</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddWallet} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Wallet Name</label>
                                <input
                                    type="text"
                                    value={newWallet.walletName}
                                    onChange={(e) => setNewWallet({ ...newWallet, walletName: e.target.value })}
                                    className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                                    placeholder="e.g., American Express"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Provider</label>
                                <input
                                    type="text"
                                    value={newWallet.provider}
                                    onChange={(e) => setNewWallet({ ...newWallet, provider: e.target.value })}
                                    className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                                    placeholder="e.g., Chase, Amex, HSBC"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Initial Balance ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newWallet.balance}
                                    onChange={(e) => setNewWallet({ ...newWallet, balance: e.target.value })}
                                    className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Linked Card (Optional)</label>
                                <input
                                    type="text"
                                    value={newWallet.linkedCard}
                                    onChange={(e) => setNewWallet({ ...newWallet, linkedCard: e.target.value })}
                                    className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                                    placeholder="•••• 1234"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2.5 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                                >
                                    Add Wallet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FAB Sync Button */}
            <div className="fixed bottom-10 right-10 z-50">
                <button className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden">
                    <span className="material-symbols-outlined text-3xl group-hover:rotate-180 transition-transform duration-700">sync</span>
                </button>
            </div>
        </div>
    );
}

export default Wallets;

