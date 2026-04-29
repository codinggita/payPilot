import React, { useState, useEffect, useRef } from 'react';
import { Banknote, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ConnectPlaid = ({ onConnected }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const hasChecked = useRef(false);
  
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    
    const checkConnection = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setChecking(false);
          return;
        }
        
        const response = await fetch('/api/users/plaid-status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setConnected(data.connected);
          if (data.connected && onConnected) onConnected();
        }
      } catch (error) {
        console.error('Check Plaid status error:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkConnection();
  }, [onConnected]);
  
  const handleConnect = () => {
    alert('Plaid integration requires additional setup. For demo purposes, please use Manual Upload or Gmail integration.');
  };
  
  if (checking) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-6">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Banknote className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-lg">Bank Integration</h3>
            <p className="text-sm text-on-surface-variant">Real-time transaction sync via Plaid</p>
          </div>
        </div>
        {connected ? (
          <span className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Connected
          </span>
        ) : (
          <span className="text-yellow-500 text-sm">Not connected</span>
        )}
      </div>
      
      <button
        onClick={handleConnect}
        disabled={loading || connected}
        className="w-full py-3 rounded-xl font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
      >
        Connect Bank Account
      </button>
      <p className="text-xs text-on-surface-variant text-center mt-3">Powered by Plaid • Bank-level security</p>
    </div>
  );
};

export default ConnectPlaid;
