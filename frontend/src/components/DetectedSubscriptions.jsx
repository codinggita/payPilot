import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, X, Loader2, Clock, DollarSign, Calendar, Mail, Landmark, FileText, Search } from 'lucide-react';

const DetectedSubscriptions = ({ refreshTrigger }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const hasFetched = useRef(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions/suggestions', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSuggestions(result.data);
        } else if (Array.isArray(result)) {
          setSuggestions(result);
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Fetch suggestions error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (hasFetched.current && !refreshTrigger) return;
    hasFetched.current = true;
    fetchSuggestions();
  }, [refreshTrigger]);
  
  const handleApprove = async (suggestionId) => {
    setProcessing(suggestionId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/suggestions/${suggestionId}/approve`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        setSuggestions(prev => prev.filter(s => s._id !== suggestionId));
        alert('Subscription added successfully!');
        window.dispatchEvent(new Event('subscriptionsChanged'));
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to add subscription');
    } finally {
      setProcessing(null);
    }
  };
  
  const handleReject = async (suggestionId) => {
    setProcessing(suggestionId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/subscriptions/suggestions/${suggestionId}/reject`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        setSuggestions(prev => prev.filter(s => s._id !== suggestionId));
      }
    } catch (error) {
      console.error('Reject error:', error);
    } finally {
      setProcessing(null);
    }
  };
  
  const getSourceIcon = (source) => {
    switch(source) {
      case 'gmail': return <Mail className="w-3 h-3" />;
      case 'plaid': return <Landmark className="w-3 h-3" />;
      case 'csv': return <FileText className="w-3 h-3" />;
      default: return <Search className="w-3 h-3" />;
    }
  };
  
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };
  
  if (loading) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-8">
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <p className="text-center text-on-surface-variant mt-2">Scanning for subscriptions...</p>
      </div>
    );
  }
  
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-8 text-center border border-outline-variant">
        <Sparkles className="w-12 h-12 mx-auto mb-3 text-on-surface-variant opacity-30" />
        <p className="text-on-surface-variant font-medium">No new subscriptions detected yet</p>
        <p className="text-sm text-on-surface-variant mt-1">
          Connect Gmail to scan receipts | Upload bank statement | Connect bank account
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold text-on-surface text-lg">Detected Subscriptions</h3>
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
          {suggestions.length} new
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {suggestions.map(suggestion => (
          <div
            key={suggestion._id}
            className="bg-gradient-to-r from-surface-container-high to-surface-container rounded-xl p-5 border border-primary/20 hover:border-primary/50 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="font-bold text-on-surface text-xl">{suggestion.data?.merchant || 'Unknown'}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary flex items-center gap-1">
                    {getSourceIcon(suggestion.source)} {suggestion.source?.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(suggestion.data?.confidence)} bg-white/5`}>
                    Lock {suggestion.data?.confidence || 0}% confidence
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs text-on-surface-variant">Amount</p>
                      <p className="text-sm font-bold text-white">${suggestion.data?.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-on-surface-variant">Billing</p>
                      <p className="text-sm font-bold text-white">{suggestion.data?.billingCycle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-on-surface-variant">Next Renewal</p>
                      <p className="text-sm font-bold text-white">
                        {suggestion.data?.nextRenewalDate ? new Date(suggestion.data.nextRenewalDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleReject(suggestion._id)}
                  disabled={processing === suggestion._id}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleApprove(suggestion._id)}
                  disabled={processing === suggestion._id}
                  className="p-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                  title="Approve"
                >
                  {processing === suggestion._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectedSubscriptions;
