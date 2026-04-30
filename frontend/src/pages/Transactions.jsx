import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import { Download, Filter, Search, X } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/transactions?limit=200';
      if (filters.status !== 'all') url += `&status=${filters.status}`;
      if (filters.category !== 'all') url += `&category=${filters.category}`;
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setTransactions(data);
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

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Status'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(tx => {
      const row = [
        new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        `"${tx.merchant.replace(/"/g, '""')}"`,
        tx.category || 'Uncategorized',
        tx.amount?.toFixed(2) || '0.00',
        tx.status || 'pending'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'matched': return { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'Matched' };
      case 'pending': return { dot: 'bg-yellow-500 animate-pulse', text: 'text-yellow-400', label: 'Pending' };
      case 'disputed': return { dot: 'bg-red-500', text: 'text-red-400', label: 'Disputed' };
      default: return { dot: 'bg-slate-500', text: 'text-slate-400', label: status || 'Pending' };
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const matchedCount = transactions.filter(t => t.status === 'matched').length;
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="bg-[#121414] text-[#e3e2e2] min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopNavBar />
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Transactions</h1>
              <p className="text-slate-400 mt-2">
                {transactions.length > 0 
                  ? `Showing ${transactions.length} real transactions from your bank statements`
                  : 'Upload a bank statement to see your transactions'}
              </p>
            </div>
            {transactions.length > 0 && (
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
          </div>

          {/* Stats Cards - Real Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1f2020] rounded-xl p-4 border border-white/5">
              <p className="text-sm text-slate-400">Total Spent</p>
              <p className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">From {transactions.length} transactions</p>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-4 border border-emerald-500/20">
              <p className="text-sm text-slate-400">Matched</p>
              <p className="text-2xl font-bold text-emerald-400">{matchedCount}</p>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-4 border border-yellow-500/20">
              <p className="text-sm text-slate-400">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1f2020] rounded-xl border border-white/5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="bg-transparent text-white text-sm focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="matched">Matched</option>
                <option value="pending">Pending</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-[#1f2020] rounded-xl border border-white/5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by merchant..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
              />
              {filters.search && (
                <button onClick={() => setFilters({ ...filters, search: '' })}>
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Transactions Table - Real Data */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 bg-[#1f2020] rounded-2xl border border-white/5">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-500/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-slate-500">receipt_long</span>
              </div>
              <p className="text-slate-400 font-medium">No transactions yet</p>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Go to the Reconciliation page and upload a CSV bank statement to see your real transaction data here.
              </p>
              <button 
                onClick={() => window.location.href = '/reconciliation'}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500"
              >
                Go to Reconciliation
              </button>
            </div>
          ) : (
            <div className="bg-[#1f2020] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Merchant</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Category</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Amount</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => {
                      const statusStyle = getStatusStyle(tx.status);
                      return (
                        <tr key={tx._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-300">{formatDate(tx.date)}</td>
                          <td className="px-6 py-4 font-medium text-white">{tx.merchant}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs">
                              {tx.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-white">${tx.amount?.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                              <span className={`text-xs font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transactions;
