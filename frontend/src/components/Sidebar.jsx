import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, active }) => (
    <Link 
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
            active 
                ? 'bg-indigo-600/20 text-white border-r-2 border-indigo-500' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
    >
        <span className={`material-symbols-outlined ${active ? 'text-indigo-500' : ''} transition-colors`}>
            {icon}
        </span>
        <span className="font-medium tracking-tight">{label}</span>
    </Link>
);

function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 h-screen bg-[#0B0E14] border-r border-white/10 flex flex-col py-6 fixed left-0 top-0 z-50 font-manrope">
            {/* Logo Section */}
            <div className="px-6 mb-10 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#919090] rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                        account_balance_wallet
                    </span>
                </div>
                <div>
                    <h1 className="text-lg font-black text-white leading-tight">SpendSync</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise Finance</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-1">
                <SidebarItem icon="dashboard" label="Overview" path="/dashboard" active={location.pathname === '/dashboard'} />
                <SidebarItem icon="subscriptions" label="Subscriptions" path="/subscriptions" active={location.pathname === '/subscriptions'} />
                <SidebarItem icon="military_tech" label="Rewards" path="/rewards" active={location.pathname === '/rewards'} />
                <SidebarItem icon="receipt_long" label="Transactions" path="/transactions" active={location.pathname === '/transactions'} />
                <SidebarItem icon="sync_alt" label="Reconciliation" path="/reconciliation" active={location.pathname === '/reconciliation'} />
                <SidebarItem icon="account_balance_wallet" label="Wallets" path="/wallets" active={location.pathname === '/wallets'} />
                <SidebarItem icon="description" label="Statements" path="/statements" active={location.pathname === '/statements'} />
            </nav>

            {/* Bottom Menu */}
            <div className="px-4 space-y-1 mt-auto">
                <SidebarItem icon="person" label="Profile" path="/profile" active={location.pathname === '/profile'} />
                <SidebarItem icon="settings" label="Settings" path="/settings" active={location.pathname === '/settings'} />
                
                <div className="pt-4 mt-4 border-t border-white/5">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-all group">
                        <span className="material-symbols-outlined group-hover:text-red-400">logout</span>
                        <span className="font-medium tracking-tight">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
