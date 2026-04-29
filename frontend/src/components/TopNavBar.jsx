import React from 'react';

function TopNavBar() {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 h-20 w-full bg-[#121414]/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-indigo-500/5 font-manrope">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative w-full max-w-lg">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-500" 
                        placeholder="Search transactions, reports, or vendors..." 
                        type="text"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <button className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 duration-200 shadow-lg shadow-indigo-600/20">
                    <span>Quick Action</span>
                    <span className="material-symbols-outlined text-sm">bolt</span>
                </button>
                
                <div className="flex items-center gap-6">
                    <button className="relative text-slate-400 hover:text-white transition-colors p-1">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#121414]"></span>
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
                        <img 
                            alt="User profile avatar" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbc4QEPu5Czc_Pp-UE_tYeuOkpWdbxEYvllGfygzqIC87Up_Q-gW_2WWxcfEqMJsB-2m0CfVJXCS1WM9uoLH8PPxRfdeoqrIwKEC5lvjgeurv_TDT6a_2-bSjQJXtpd_C7qY1Bht2aHmB_5zuqv0WEhBNOcfFnRdJlk-GHTyKTAGT-Bcrh8iijSr8nvFon7USIlXzqnTzWksO7ivYw8anzEHHE7Tgh58-oTsaoAt47J86pMCs3EXwyq4CxExY2kUlsjXwBqftBYF8"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TopNavBar;
