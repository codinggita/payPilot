import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Zap, Bell, User, ArrowRight, CreditCard, Receipt, Loader2 } from 'lucide-react';

function TopNavBar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ transactions: [], subscriptions: [], totalResults: 0 });
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setShowSuggestions(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions as user types
    useEffect(() => {
        if (searchQuery.length >= 2) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            
            debounceRef.current = setTimeout(async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/search/suggestions?query=${encodeURIComponent(searchQuery)}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setSuggestions(result.data || []);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error('Suggestions error:', error);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    // Handle search submission
    const handleSearch = async (e) => {
        e?.preventDefault();
        
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        setShowDropdown(true);
        setShowSuggestions(false);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                setSearchResults({
                    transactions: result.data?.transactions || [],
                    subscriptions: result.data?.subscriptions || [],
                    totalResults: result.totalResults || 0
                });
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle clicking a suggestion
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.text);
        handleSearch();
    };

    // Handle clicking a search result
    const handleResultClick = (type, item) => {
        setShowDropdown(false);
        setSearchQuery('');
        
        if (type === 'transaction') {
            navigate('/transactions');
        } else if (type === 'subscription') {
            navigate('/subscriptions');
        }
    };

    // Handle notification click
    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-20 w-full bg-[#121414]/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-indigo-500/5 font-manrope">
            {/* Search Section */}
            <div className="flex items-center gap-6 flex-1" ref={searchRef}>
                <div className="relative w-full max-w-md">
                    <form onSubmit={handleSearch}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search transactions, subscriptions, merchants..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        {searchQuery && (
                            <button 
                                type="button"
                                onClick={() => { setSearchQuery(''); setShowDropdown(false); setShowSuggestions(false); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </form>
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-[#1f2020] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined text-slate-400 text-lg">
                                        {suggestion.type === 'merchant' ? 'store' : 'category'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{suggestion.text}</p>
                                        <p className="text-[10px] text-slate-500">{suggestion.subtitle}</p>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-slate-600" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Quick Action Button */}
                <button 
                    onClick={() => navigate('/subscriptions')}
                    className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 duration-200 shadow-lg shadow-indigo-600/20"
                >
                    <span>Quick Action</span>
                    <Zap className="w-4 h-4" />
                </button>
                
                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={handleNotificationClick}
                        className="relative text-slate-400 hover:text-white transition-colors p-1"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#121414]"></span>
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-[#1f2020] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <Receipt className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-white">3 transactions matched</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Reconciliation complete for Netflix, Spotify</p>
                                            <p className="text-[9px] text-slate-600 mt-1">2 minutes ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-white">Subscription renewal soon</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Amazon Prime renews in 3 days</p>
                                            <p className="text-[9px] text-slate-600 mt-1">1 hour ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                            <Bell className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-white">New feature available</p>
                                            <p className="text-[10px] text-slate-500 mt-1">CSV upload now supports PDF statements</p>
                                            <p className="text-[9px] text-slate-600 mt-1">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t border-white/5 text-center">
                                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer hover:border-indigo-500/50 transition-colors bg-indigo-600/20 flex items-center justify-center"
                    >
                        <User className="w-5 h-5 text-white" />
                    </button>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-white">{user.fullName || 'User'}</p>
                        <p className="text-[10px] text-slate-500">{user.email || 'user@example.com'}</p>
                    </div>
                </div>
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.totalResults > 0 && (
                <div className="absolute top-full left-6 mt-2 w-[500px] max-w-[90vw] bg-[#1f2020] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                    <div className="p-3 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                            {searchResults.totalResults} results for "<span className="text-white font-medium">{searchQuery}</span>"
                        </span>
                        <button 
                            onClick={() => setShowDropdown(false)}
                            className="text-slate-500 hover:text-white"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    
                    {/* Transaction Results */}
                    {searchResults.transactions?.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02]">
                                Transactions ({searchResults.transactions.length})
                            </div>
                            {searchResults.transactions.slice(0, 4).map((tx) => (
                                <button
                                    key={tx._id}
                                    onClick={() => handleResultClick('transaction', tx)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Receipt className="w-4 h-4 text-slate-500" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">{tx.merchant}</p>
                                            <p className="text-[10px] text-slate-500">
                                                {new Date(tx.date).toLocaleDateString()} • {tx.category}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-rose-400">-${tx.amount?.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Subscription Results */}
                    {searchResults.subscriptions?.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02] border-t border-white/5">
                                Subscriptions ({searchResults.subscriptions.length})
                            </div>
                            {searchResults.subscriptions.slice(0, 4).map((sub) => (
                                <button
                                    key={sub._id}
                                    onClick={() => handleResultClick('subscription', sub)}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-indigo-400" />
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">{sub.merchant}</p>
                                            <p className="text-[10px] text-slate-500">
                                                {sub.billingCycle} • Next: {new Date(sub.nextRenewalDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-white">${sub.amount?.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    <div className="p-3 border-t border-white/5 text-center">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                            Press Enter for full results
                        </button>
                    </div>
                </div>
            )}

            {/* No Results */}
            {showDropdown && searchResults.totalResults === 0 && !loading && searchQuery && (
                <div className="absolute top-full left-6 mt-2 w-[400px] bg-[#1f2020] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                    <div className="p-6 text-center">
                        <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-slate-400">No results found</p>
                        <p className="text-xs text-slate-600 mt-1">Try a different search term</p>
                    </div>
                </div>
            )}
        </header>
    );
}

export default TopNavBar;
