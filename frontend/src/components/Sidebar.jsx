import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Award, 
  Receipt, 
  RefreshCw, 
  Wallet, 
  FileText, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
        active 
          ? 'bg-indigo-600/20 text-white border-r-2 border-indigo-500' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium tracking-tight">{label}</span>
    </Link>
  );
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#0B0E14] border-r border-white/10 flex flex-col py-6 fixed left-0 top-0 z-50 font-manrope">
      {/* Logo Section */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white leading-tight">PayPilot</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise Finance</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        <SidebarItem icon={LayoutDashboard} label="Overview" path="/dashboard" active={location.pathname === "/dashboard"} />
        <SidebarItem icon={CreditCard} label="Subscriptions" path="/subscriptions" active={location.pathname === "/subscriptions"} />
        <SidebarItem icon={Award} label="Rewards" path="/rewards" active={location.pathname === "/rewards"} />
        <SidebarItem icon={Receipt} label="Transactions" path="/transactions" active={location.pathname === "/transactions"} />
        <SidebarItem icon={RefreshCw} label="Reconciliation" path="/reconciliation" active={location.pathname === "/reconciliation"} />
        <SidebarItem icon={Wallet} label="Wallets" path="/wallets" active={location.pathname === "/wallets"} />
        <SidebarItem icon={FileText} label="Statements" path="/statements" active={location.pathname === "/statements"} />
      </nav>

      {/* Bottom Menu */}
      <div className="px-4 space-y-1 mt-auto">
        <SidebarItem icon={User} label="Profile" path="/profile" active={location.pathname === "/profile"} />
        <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === "/settings"} />
        <div className="pt-4 mt-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-all group rounded-lg"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            <span className="font-medium tracking-tight">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
