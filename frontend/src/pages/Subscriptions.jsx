import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pause, Play, Trash2, CreditCard, Wallet } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import ConnectGmail from '../components/ConnectGmail';
import ConnectPlaid from '../components/ConnectPlaid';
import ManualUpload from '../components/ManualUpload';
import DetectedSubscriptions from '../components/DetectedSubscriptions';
import CancellationModal from '../components/CancellationModal';
import { API_URL } from '../config';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [refreshSuggestions, setRefreshSuggestions] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [newSubscription, setNewSubscription] = useState({
    merchant: '',
    amount: '',
    billingCycle: 'monthly',
    nextRenewalDate: ''
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/subscriptions`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSubscriptions(result.data);
        } else if (Array.isArray(result)) {
          setSubscriptions(result);
        } else {
          setSubscriptions([]);
        }
      }
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();

    const handleSubscriptionsChange = () => {
      fetchSubscriptions();
    };
    window.addEventListener('subscriptionsChanged', handleSubscriptionsChange);

    return () => {
      window.removeEventListener('subscriptionsChanged', handleSubscriptionsChange);
    };
  }, []);

  const handlePause = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/subscriptions/${id}/pause`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        fetchSubscriptions();
        alert('Subscription paused. You will not receive renewal reminders.');
      }
    } catch (error) {
      console.error('Pause error:', error);
      alert('Failed to pause subscription');
    }
  };

  const handleResume = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/subscriptions/${id}/resume`, {
        method: 'PATCH',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        fetchSubscriptions();
        alert('Subscription resumed. Renewal reminders are now active.');
      }
    } catch (error) {
      console.error('Resume error:', error);
      alert('Failed to resume subscription');
    }
  };

  const handleCancelClick = (subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedSubscription) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/subscriptions/${selectedSubscription._id}`, {
          method: 'DELETE',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          fetchSubscriptions();
          alert('Subscription removed from PayPilot');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to remove subscription');
      }
    }
    setShowCancelModal(false);
    setSelectedSubscription(null);
  };

  const handleAddManual = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newSubscription.merchant || !newSubscription.amount || !newSubscription.nextRenewalDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          merchant: newSubscription.merchant,
          amount: parseFloat(newSubscription.amount),
          billingCycle: newSubscription.billingCycle,
          nextRenewalDate: newSubscription.nextRenewalDate
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowManualForm(false);
        setNewSubscription({ merchant: '', amount: '', billingCycle: 'monthly', nextRenewalDate: '' });
        fetchSubscriptions();
        alert('Subscription added successfully!');
      } else {
        alert(data.message || 'Failed to add subscription');
      }
    } catch (error) {
      console.error('Add manual error:', error);
      alert('Failed to add subscription');
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
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
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

          {/* Manual Add Form */}
          {showManualForm && (
            <div className="bg-[#1f2020] rounded-2xl p-6 mb-8 border border-white/10 shadow-xl">
              <h3 className="font-bold mb-4 text-white text-lg">Add Subscription Manually</h3>
              <form onSubmit={handleAddManual} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Merchant (e.g., Netflix)"
                  value={newSubscription.merchant}
                  onChange={(e) => setNewSubscription({ ...newSubscription, merchant: e.target.value })}
                  className="bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  step="0.01"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({ ...newSubscription, amount: e.target.value })}
                  className="bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                  required
                />
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({ ...newSubscription, billingCycle: e.target.value })}
                  className="bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <input
                  type="date"
                  value={newSubscription.nextRenewalDate}
                  onChange={(e) => setNewSubscription({ ...newSubscription, nextRenewalDate: e.target.value })}
                  className="bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white"
                  required
                />
                <div className="md:col-span-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-md"
                  >
                    Add Subscription
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Subscriptions List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 bg-[#1f2020] rounded-2xl border border-white/5">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-500 opacity-30" />
              <p className="text-slate-400 font-medium">No subscriptions yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Click "Add Manual" to add a subscription, or connect Gmail/Bank to detect automatically
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-bold text-white mb-4 text-lg">Your Subscriptions ({subscriptions.length})</h3>
              {subscriptions.map(sub => (
                <div
                  key={sub._id}
                  className="bg-[#1f2020]/60 rounded-xl p-4 flex justify-between items-center border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{sub.merchant}</p>
                      <p className="text-sm text-slate-400">
                        ${sub.amount} - {sub.billingCycle} - Next: {formatDate(sub.nextRenewalDate)}
                      </p>
                      {sub.detectedSource && sub.detectedSource !== 'manual' && (
                        <p className="text-xs text-indigo-400 mt-1">
                          Detected via {sub.detectedSource}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => handlePause(sub._id)}
                        className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                        title="Pause reminders"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : sub.status === 'paused' ? (
                      <button
                        onClick={() => handleResume(sub._id)}
                        className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                        title="Resume reminders"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleCancelClick(sub)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Cancel subscription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div className="mt-8 p-4 bg-[#1b1c1c] rounded-xl border border-white/5">
            <p className="text-sm text-slate-400 text-center">
              Note: PayPilot helps you track subscriptions and sends renewal reminders.
              To cancel a subscription, click the trash icon and follow the instructions.
            </p>
          </div>
        </main>
      </div>

      {showCancelModal && selectedSubscription && (
        <CancellationModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedSubscription(null);
          }}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default Subscriptions;
