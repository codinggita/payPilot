import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import { Loader2, CheckCircle, Shield, Bell, Globe, Sun, Moon, Key, Save, Copy, RefreshCw, X, Eye, EyeOff } from 'lucide-react';

const SettingToggle = ({ label, desc, checked, onChange, disabled }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <div className={`w-10 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                checked ? 'bg-indigo-600' : 'bg-white/10'
            }`}></div>
        </label>
    </div>
);

function Settings() {
    const [settings, setSettings] = useState({
        theme: 'dark',
        notifications: {
            email: true,
            push: true,
            renewalReminders: true,
            marketing: false
        },
        currency: 'USD',
        language: 'en',
        autoDetectSubscriptions: true,
        twoFactorAuth: false,
        apiKey: 'sk_live_51M0...93kF2'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('General');
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Fetch settings
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setSettings(prev => ({
                        ...prev,
                        ...result.data,
                        apiKey: prev.apiKey,
                        twoFactorAuth: result.data.twoFactorAuth || prev.twoFactorAuth
                    }));
                }
            }
        } catch (error) {
            console.error('Fetch settings error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Save settings
    const handleSaveSettings = async () => {
        setSaving(true);
        setMessage(null);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    theme: settings.theme,
                    notifications: settings.notifications,
                    currency: settings.currency,
                    language: settings.language,
                    autoDetectSubscriptions: settings.autoDetectSubscriptions,
                    twoFactorAuth: settings.twoFactorAuth
                })
            });
            
            if (response.ok) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
                setTimeout(() => setMessage(null), 5000);
            }
        } catch (error) {
            console.error('Save settings error:', error);
            setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setSaving(false);
        }
    };

    // Notification toggle handler
    const handleNotificationChange = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    // Theme toggle
    const handleThemeChange = (theme) => {
        setSettings(prev => ({ ...prev, theme }));
    };

    // Copy API key
    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(settings.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Regenerate API key
    const handleRegenerateKey = () => {
        if (confirm('Are you sure you want to regenerate your API key? The old key will stop working immediately.')) {
            const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 10) + '...' + Math.random().toString(36).substring(2, 6).toUpperCase();
            setSettings(prev => ({ ...prev, apiKey: newKey }));
            setMessage({ type: 'success', text: 'API key regenerated! Save to apply.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Change password
    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setPasswordSuccess('Password changed successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordForm(false);
                setTimeout(() => setPasswordSuccess(''), 3000);
            } else {
                setPasswordError(data.message || 'Failed to change password');
            }
        } catch (error) {
            setPasswordError('Network error. Please try again.');
        }
    };

    const tabs = ['General', 'Notifications', 'Security', 'Billing', 'Integrations'];

    if (loading) {
        return (
            <div className="bg-[#121414] min-h-screen flex">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                <main className="p-6 md:p-10 max-w-[1200px] mx-auto w-full space-y-10">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Settings</h1>
                        <p className="text-slate-400 mt-2 font-medium leading-relaxed">
                            Manage your account preferences and configurations
                        </p>
                    </div>

                    {/* Message Alert */}
                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                            <CheckCircle className="w-4 h-4" />
                            {message.text}
                        </div>
                    )}

                    {/* Password Success Message */}
                    {passwordSuccess && (
                        <div className="p-4 rounded-xl flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            {passwordSuccess}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-white/5 overflow-x-auto whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-2 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                                    activeTab === tab 
                                        ? 'text-indigo-400 border-indigo-500' 
                                        : 'text-slate-500 border-transparent hover:text-slate-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Column */}
                        <div className="col-span-12 lg:col-span-7 space-y-8">
                            {/* General Tab */}
                            {activeTab === 'General' && (
                                <>
                                    {/* Auto-Detect Section */}
                                    <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                        <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                            <Shield className="w-5 h-5 text-indigo-400" />
                                            Account Information
                                        </h3>
                                        <div className="space-y-2">
                                            <SettingToggle 
                                                label="Auto-Detect Subscriptions" 
                                                desc="Automatically scan for recurring payments from uploaded statements and Gmail receipts" 
                                                checked={settings.autoDetectSubscriptions}
                                                onChange={() => setSettings(prev => ({ ...prev, autoDetectSubscriptions: !prev.autoDetectSubscriptions }))}
                                            />
                                        </div>
                                    </section>

                                    {/* Theme Section */}
                                    <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                        <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                            {settings.theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                                            Appearance
                                        </h3>
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">Interface Theme</p>
                                            <p className="text-[10px] text-slate-500 font-medium mb-4">Choose your preferred interface style</p>
                                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                                <button 
                                                    onClick={() => handleThemeChange('light')}
                                                    className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                        settings.theme === 'light' 
                                                            ? 'bg-white text-slate-900 shadow-lg' 
                                                            : 'text-slate-500 hover:text-white'
                                                    }`}
                                                >
                                                    <Sun className="w-3 h-3" /> Light
                                                </button>
                                                <button 
                                                    onClick={() => handleThemeChange('dark')}
                                                    className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                        settings.theme === 'dark' 
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                                            : 'text-slate-500 hover:text-white'
                                                    }`}
                                                >
                                                    <Moon className="w-3 h-3" /> Dark
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    {/* API Management */}
                                    <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                        <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-8">
                                            <Key className="w-5 h-5 text-indigo-400" />
                                            API Key Management
                                        </h3>
                                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Live Production Key</span>
                                                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">Active</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <code className="flex-1 bg-black/40 px-5 py-3 rounded-xl font-mono text-indigo-300 text-sm overflow-x-auto border border-white/5 tracking-wider">
                                                    {showApiKey ? settings.apiKey : 'sk_live_••••••••••••••••'}
                                                </code>
                                                <button 
                                                    onClick={handleCopyApiKey}
                                                    className="text-slate-500 hover:text-white transition-colors relative"
                                                    title="Copy API Key"
                                                >
                                                    {copied ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                    className="text-slate-500 hover:text-white transition-colors"
                                                    title={showApiKey ? "Hide API Key" : "Show API Key"}
                                                >
                                                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={handleRegenerateKey}
                                                    className="text-slate-500 hover:text-rose-400 transition-colors"
                                                    title="Regenerate API Key"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleRegenerateKey}
                                            className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 hover:text-white hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all text-xs font-black uppercase tracking-widest"
                                        >
                                            + Generate New API Key
                                        </button>
                                    </section>
                                </>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'Notifications' && (
                                <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                        <Bell className="w-5 h-5 text-indigo-400" />
                                        Alerts & Notifications
                                    </h3>
                                    <div className="space-y-2">
                                        <SettingToggle 
                                            label="Email Summaries" 
                                            desc="Weekly financial health reports sent to your email" 
                                            checked={settings.notifications?.email}
                                            onChange={() => handleNotificationChange('email')}
                                        />
                                        <SettingToggle 
                                            label="Push Notifications" 
                                            desc="Instant alerts for important updates and security notifications" 
                                            checked={settings.notifications?.push}
                                            onChange={() => handleNotificationChange('push')}
                                        />
                                        <SettingToggle 
                                            label="Renewal Reminders" 
                                            desc="Get notified 3 days before any subscription renews" 
                                            checked={settings.notifications?.renewalReminders}
                                            onChange={() => handleNotificationChange('renewalReminders')}
                                        />
                                        <SettingToggle 
                                            label="Weekly Digest" 
                                            desc="Summary of your spending, savings, and detected subscriptions" 
                                            checked={settings.notifications?.weeklyDigest !== false}
                                            onChange={() => handleNotificationChange('weeklyDigest')}
                                        />
                                        <SettingToggle 
                                            label="Marketing Updates" 
                                            desc="Product news, feature announcements, and special offers" 
                                            checked={settings.notifications?.marketing}
                                            onChange={() => handleNotificationChange('marketing')}
                                        />
                                    </div>
                                </section>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'Security' && (
                                <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                        <Shield className="w-5 h-5 text-indigo-400" />
                                        Security Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <SettingToggle 
                                            label="Two-Factor Authentication" 
                                            desc="Add an extra layer of security to your account" 
                                            checked={settings.twoFactorAuth}
                                            onChange={() => setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                                        />
                                        
                                        {/* Change Password */}
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex items-center justify-between py-3">
                                                <div>
                                                    <p className="text-sm font-bold text-white">Password</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">Update your account password</p>
                                                </div>
                                                <button 
                                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                                    className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                                                </button>
                                            </div>
                                            
                                            {showPasswordForm && (
                                                <div className="mt-4 p-4 bg-white/5 rounded-xl space-y-3">
                                                    {passwordError && (
                                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                                            {passwordError}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">Current Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white text-sm"
                                                            placeholder="Enter current password"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white text-sm"
                                                            placeholder="Enter new password (min 6 characters)"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1">Confirm New Password</label>
                                                        <input
                                                            type="password"
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            className="w-full bg-[#292a2a] rounded-lg px-4 py-2.5 border border-white/10 focus:border-indigo-500 outline-none text-white text-sm"
                                                            placeholder="Confirm new password"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleChangePassword}
                                                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition-all"
                                                    >
                                                        Update Password
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Active Sessions */}
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-sm font-bold text-white mb-3">Active Sessions</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                            <span className="text-xs text-emerald-400 font-bold">??</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-white">Current Session</p>
                                                            <p className="text-[10px] text-slate-500">Windows • Chrome • {new Date().toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Billing Tab */}
                            {activeTab === 'Billing' && (
                                <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                        <Globe className="w-5 h-5 text-indigo-400" />
                                        Billing & Plan
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="bg-indigo-600/10 rounded-2xl p-6 border border-indigo-500/20">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Current Plan</p>
                                                    <p className="text-2xl font-bold text-white mt-1">Enterprise</p>
                                                </div>
                                                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Unlimited transactions
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Gmail integration
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" /> CSV upload
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" /> Priority support
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                                                View Invoices
                                            </button>
                                            <button className="flex-1 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 transition-all">
                                                Upgrade Plan
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Integrations Tab */}
                            {activeTab === 'Integrations' && (
                                <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                        <Key className="w-5 h-5 text-indigo-400" />
                                        Connected Services
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                    <span className="text-red-400 font-bold text-lg">G</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Gmail</p>
                                                    <p className="text-[10px] text-slate-500">Email receipt scanning</p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">CONNECTED</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                    <span className="text-purple-400 font-bold text-lg">P</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">Plaid</p>
                                                    <p className="text-[10px] text-slate-500">Bank transaction sync</p>
                                                </div>
                                            </div>
                                            <button className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Connect</button>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="col-span-12 lg:col-span-5 space-y-8">
                            {/* Notifications Preview (Shown on General tab too) */}
                            {activeTab === 'General' && (
                                <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-6">
                                        <Bell className="w-5 h-5 text-indigo-400" />
                                        Quick Notifications
                                    </h3>
                                    <div className="space-y-2">
                                        <SettingToggle 
                                            label="Email Summaries" 
                                            desc="Weekly financial health reports" 
                                            checked={settings.notifications?.email}
                                            onChange={() => handleNotificationChange('email')}
                                        />
                                        <SettingToggle 
                                            label="Renewal Reminders" 
                                            desc="Get notified before subscriptions renew" 
                                            checked={settings.notifications?.renewalReminders}
                                            onChange={() => handleNotificationChange('renewalReminders')}
                                        />
                                    </div>
                                </section>
                            )}

                            {/* Plan Card - Shows on all tabs */}
                            <section className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-10 relative overflow-hidden shadow-2xl shadow-indigo-600/20 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                                <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                                <div className="absolute -left-20 -top-20 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] opacity-80">Current Plan</span>
                                        <h2 className="text-4xl font-black text-white font-manrope tracking-tight mt-2">Enterprise</h2>
                                        <p className="text-indigo-100/70 text-xs font-medium mt-3">Billed annually. All features included.</p>
                                    </div>
                                    <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]">
                                        Manage Subscription
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <footer className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <button className="text-rose-500 font-black text-xs uppercase tracking-widest hover:text-rose-400 transition-colors">
                            Delete Account
                        </button>
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={fetchSettings}
                                className="text-slate-500 hover:text-white font-bold text-sm transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Reset Changes
                            </button>
                            <button 
                                onClick={handleSaveSettings}
                                disabled={saving}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {saving ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default Settings;
