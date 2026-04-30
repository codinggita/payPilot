import React from 'react';

function TopNavBar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 w-full bg-slate-950/60 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-indigo-500/10 font-manrope antialiased">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors text-xl">search</span>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 text-white" 
            placeholder="Search transactions, receipts, or merchants..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold active:scale-95 duration-200 shadow-lg shadow-indigo-500/20">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Quick Action
        </button>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:bg-white/5 transition-colors rounded-full active:scale-95">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;
