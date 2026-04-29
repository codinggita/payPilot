import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pause, Play, Trash2, CreditCard, Wallet } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import ConnectGmail from '../components/ConnectGmail';
import ConnectPlaid from '../components/ConnectPlaid';
import ManualUpload from '../components/ManualUpload';
import DetectedSubscriptions from '../components/DetectedSubscriptions';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [refreshSuggestions, setRefreshSuggestions] = useState(0);
  const hasFetched = useRef(false);
  
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSubscriptions();
  }, []);
  
  const handlePause = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/subscriptions/${id}/pause`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Pause error:', error);
    }
  };
  
  const handleResume = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/subscriptions/${id}/resume`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Resume error:', error);
    }
  };
  
  const handleCancel = async (id) => {
    if (!confirm('Remove this subscription?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  const handleAddManual = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Add manual subscription logic here
      setShowManualForm(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Add manual error:', error);
    }
  };
  
  const handleUploadComplete = (detected) => {
    if (detected?.length) {
      setRefreshSuggestions(prev => prev + 1);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopNavBar />
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Subscriptions</h1>
              <p className="text-slate-400 mt-2">Manage all your recurring payments in one place</p>
            </div>
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-500 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Manual
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ConnectGmail onConnected={() => setRefreshSuggestions(prev => prev + 1)} />
            <ConnectPlaid onConnected={() => setRefreshSuggestions(prev => prev + 1)} />
            <ManualUpload onUploadComplete={handleUploadComplete} />
          </div>
          
          <div className="mb-8">
            <DetectedSubscriptions refreshTrigger={refreshSuggestions} />
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 bg-[#1f2020] rounded-2xl">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-500 opacity-30" />
              <p className="text-slate-400">No subscriptions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-bold text-white mb-4">Your Subscriptions ({subscriptions.length})</h3>
              {subscriptions.map(sub => (
                <div key={sub._id} className="bg-[#1f2020]/60 rounded-xl p-4 flex justify-between items-center border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{sub.merchant}</p>
                      <p className="text-sm text-slate-400">
                        ${sub.amount} • {sub.billingCycle} • Next: {formatDate(sub.nextRenewalDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {sub.status === 'active' ? (
                      <button onClick={() => handlePause(sub._id)} className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20">
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : sub.status === 'paused' ? (
                      <button onClick={() => handleResume(sub._id)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button onClick={() => handleCancel(sub._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Subscriptions;
