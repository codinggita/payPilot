import React, { useState, useEffect, useRef } from 'react';
import { Banknote, CheckCircle, AlertCircle, Loader2, Shield, ExternalLink } from 'lucide-react';
import { usePlaidLink } from 'react-plaid-link';
import { API_URL } from '../config';
import { showToast } from '../utils/toast';

const ConnectPlaid = ({ onConnected }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkToken, setLinkToken] = useState(null);
  const hasChecked = useRef(false);

  // Check if Plaid is already connected
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

        const response = await fetch(`${API_URL}/users/plaid-status`, {
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

  // Create link token when ready to connect
  const createLinkToken = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/plaid/create-link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Create link token error:', error);
      showToast.error('Failed to initialize bank connection. Please try again.');
      setLoading(false);
    }
  };

  // Handle Plaid Link success
  const onSuccess = async (public_token, metadata) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/plaid/exchange-public-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ public_token })
      });

      const data = await response.json();

      if (data.success) {
        setConnected(true);
        if (onConnected) onConnected();
        showToast.success(`Bank connected successfully! Detected ${data.detectedCount} subscriptions from your transactions.`);
      } else {
        throw new Error(data.error || 'Failed to connect bank');
      }
    } catch (error) {
      console.error('Exchange token error:', error);
      showToast.error('Failed to connect bank account. Please try again.');
    } finally {
      setLoading(false);
      setLinkToken(null);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => {
      setLoading(false);
      setLinkToken(null);
    }
  });

  const handleConnect = async () => {
    await createLinkToken();
  };

  // Open Plaid Link when linkToken is available
  useEffect(() => {
    if (linkToken && ready && !connected) {
      open();
    }
  }, [linkToken, ready, open, connected]);

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
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Banknote className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-lg">Bank Integration</h3>
            <p className="text-sm text-on-surface-variant">Real-time transaction sync via Plaid</p>
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

      {connected ? (
        <div className="space-y-3">
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-2 text-sm">
              <Banknote className="w-4 h-4 text-green-400" />
              <span className="text-on-surface font-medium">Bank Connected</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Your bank transactions are being synced in real-time. Subscriptions detected will appear above.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-5">
            <p className="text-on-surface-variant text-sm">
              Connect your bank account for automatic transaction sync:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant ml-2">
              <li>No manual CSV uploads needed</li>
              <li>Real-time subscription detection</li>
              <li>Automatic renewal tracking</li>
              <li>Support for 12,000+ financial institutions</li>
            </ul>
          </div>

          <button
            onClick={handleConnect}
            disabled={loading || connected}
            className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Banknote className="w-4 h-4" />
                Connect Bank Account
              </>
            )}
          </button>
        </>
      )}

      <p className="text-xs text-on-surface-variant text-center mt-3 flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        Powered by Plaid � Bank-level security
      </p>

      {!connected && (
        <p className="text-xs text-on-surface-variant text-center mt-2">
          <ExternalLink className="w-3 h-3 inline mr-1" />
          Works with Chase, Bank of America, Wells Fargo, and 12,000+ banks
        </p>
      )}
    </div>
  );
};

export default ConnectPlaid;
