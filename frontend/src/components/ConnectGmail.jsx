import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { API_URL } from '../config';

const ConnectGmail = ({ onConnected }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState('');
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

        const response = await fetch(`${API_URL}/users/gmail-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setConnected(data.connected);
          setGmailEmail(data.email || '');
          if (data.connected && onConnected) onConnected();
        }
      } catch (error) {
        console.error('Check Gmail status error:', error);
      } finally {
        setChecking(false);
      }
    };

    checkConnection();

    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail') === 'connected') {
      // Refresh data after successful connection
      checkConnection();
      if (onConnected) onConnected();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [onConnected]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${API_URL}/gmail/auth-url`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to get auth URL');

      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Gmail connect error:', error);
      alert('Failed to connect Gmail: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Gmail? You will need to reconnect to continue scanning for subscriptions.')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/gmail-disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setConnected(false);
        setGmailEmail('');
        if (onConnected) onConnected();
        alert('Gmail disconnected successfully');
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      alert('Failed to disconnect Gmail');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant transition-all hover:border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-lg">Gmail Integration</h3>
            <p className="text-sm text-on-surface-variant">Scan receipt emails automatically</p>
          </div>
        </div>
        {connected ? (
          <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Connected
          </span>
        ) : (
          <span className="text-yellow-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Not connected
          </span>
        )}
      </div>

      <div className="border-t border-outline-variant my-4"></div>

      {connected && gmailEmail ? (
        <>
          <div className="mb-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-green-400" />
              <span className="text-on-surface font-medium">Connected Gmail:</span>
              <span className="text-green-400 font-mono">{gmailEmail}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              ? PayPilot will automatically scan this Gmail account for subscription receipts
            </p>
          </div>

          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Disconnect Gmail
          </button>
        </>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            <p className="text-on-surface-variant text-sm">
              PayPilot will scan your Gmail for subscription receipts and automatically detect:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant ml-2">
              <li>Netflix, Spotify, Amazon Prime subscriptions</li>
              <li>Free trials before they convert to paid</li>
              <li>Renewal dates and pricing changes</li>
              <li>Subscription cancellations</li>
            </ul>
          </div>

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Connect Gmail Account
              </>
            )}
          </button>
        </>
      )}

      {connected && (
        <p className="text-xs text-on-surface-variant text-center mt-3 flex items-center justify-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Your data is secure. We only access subscription-related emails.
        </p>
      )}
    </div>
  );
};

export default ConnectGmail;
