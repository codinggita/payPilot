import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Database, TrendingUp } from 'lucide-react';

const Reconciliation = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    matchedTransactions: 0,
    pendingTransactions: 0,
    unmatchedTransactions: 0,
    totalAmount: 0,
    categoryBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reconciliation/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('statement', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reconciliation/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Upload complete! Found ${result.detectedCount} potential subscriptions.`);
        fetchStats();
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const matchRate = stats.totalTransactions > 0 
    ? ((stats.matchedTransactions / stats.totalTransactions) * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-[#121414] text-[#e3e2e2] min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopNavBar />
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Bank Reconciliation</h1>
              <p className="text-slate-400 mt-2">Upload statements and match transactions automatically</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1f2020] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Database className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Total Entries</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Matched</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.matchedTransactions}</p>
              <p className="text-xs text-slate-500 mt-1">{matchRate}% match rate</p>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingTransactions}</p>
            </div>
            <div className="bg-[#1f2020] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-white">${stats.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-[#1f2020] rounded-2xl p-8 border border-white/5 text-center mb-8">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Bank Statement</h3>
            <p className="text-slate-400 mb-6">Upload a CSV or PDF bank statement to detect subscriptions</p>
            
            <label className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all cursor-pointer">
              {uploading ? 'Processing...' : 'Choose File'}
              <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            <p className="text-xs text-slate-500 mt-4">Supported formats: CSV, PDF (Max 10MB)</p>
          </div>

          {/* Category Breakdown */}
          {stats.categoryBreakdown.length > 0 && (
            <div className="bg-[#1f2020] rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Spending by Category</h3>
              <div className="space-y-3">
                {stats.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{cat._id || 'Uncategorized'}</span>
                    <div className="flex-1 mx-4 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(cat.total / stats.totalAmount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">${cat.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reconciliation;
