import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const SettingToggle = ({ label, desc, checked }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-[10px] text-slate-500 font-medium">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
            <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    </div>
);

function Settings() {
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
                            Manage your SpendSync account preferences and system configurations.
                        </p>
                    </div>

                    {/* Tabbed Interface */}
                    <div className="flex items-center gap-8 border-b border-white/5 overflow-x-auto whitespace-nowrap pb-0.5">
                        {['General', 'Notifications', 'Security', 'Billing', 'Integrations'].map((tab, i) => (
                            <button 
                                key={tab} 
                                className={`px-2 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 ${i === 0 ? 'text-indigo-400 border-indigo-500 shadow-[0_4px_12px_-4px_rgba(99,102,241,0.5)]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* Profile Section */}
                        <section className="col-span-12 glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-10 items-center shadow-2xl">
                            <div className="relative shrink-0">
                                <img 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5V6TPYFVAPHlru1hZrkRDkkGqq8_PHYrDbWRNmmYlcFYeiY1fwpSg-kTzOmOqaURB0VItow0wQTApfEYSmLynH2YxIacPXWS2Q-s_uMWRPE6vs0rli2sCOhWSoozu6H6vC9MNLeGffba8MFIh92ae7U_WtKgja2x10erslSJqGJhuFisTiZ6J0sySg-rccCiZBzsxK71IkjHoVlFDV1FRvkv0Cuu1HjKFIFjpmGFZAKWW4WYKU2qtkDUqZ6v1u6i2b88W4MLRHHA" 
                                    alt="Avatar" 
                                    className="w-28 h-28 rounded-full border-2 border-indigo-500/50 p-1.5 object-cover shadow-2xl" 
                                />
                                <button className="absolute bottom-0 right-0 bg-indigo-600 rounded-xl p-2 border-2 border-[#121414] shadow-lg text-white hover:bg-indigo-500 transition-all active:scale-90">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                            </div>
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Full Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Alexander Sterling" 
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Email Address</label>
                                    <input 
                                        type="email" 
                                        defaultValue="alexander.s@spendsync.com" 
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Left Column */}
                        <div className="col-span-12 lg:col-span-7 space-y-8">
                            {/* App Preferences */}
                            <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] shadow-2xl">
                                <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-8">
                                    <span className="material-symbols-outlined text-indigo-400">tune</span>
                                    App Preferences
                                </h3>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">Default Currency</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Set your primary reporting currency</p>
                                        </div>
                                        <select className="bg-white/5 border border-white/5 rounded-xl px-5 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">Timezone</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Reports will be generated in this zone</p>
                                        </div>
                                        <select className="bg-white/5 border border-white/5 rounded-xl px-5 py-2 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]">
                                            <option>(GMT-08:00) Pacific Time</option>
                                            <option>(GMT+00:00) UTC</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">Theme Preference</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Choose your preferred interface style</p>
                                        </div>
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                            <button className="px-5 py-1.5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Light</button>
                                            <button className="px-5 py-1.5 rounded-lg text-[10px] font-black text-white bg-indigo-600 uppercase tracking-widest shadow-lg shadow-indigo-600/20">Dark</button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* API Management */}
                            <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] shadow-2xl">
                                <h3 className="text-xl font-bold text-white font-manrope flex items-center gap-3 mb-8">
                                    <span className="material-symbols-outlined text-indigo-400">key</span>
                                    API Key Management
                                </h3>
                                <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Live Production Key</span>
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">Active</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <code className="flex-1 bg-black/40 px-5 py-3 rounded-xl font-mono text-indigo-300 text-sm overflow-x-auto border border-white/5 tracking-wider">sk_live_51M0...93kF2</code>
                                        <button className="material-symbols-outlined text-slate-500 hover:text-white transition-colors">content_copy</button>
                                        <button className="material-symbols-outlined text-slate-500 hover:text-rose-400 transition-colors">refresh</button>
                                    </div>
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 hover:text-white hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all text-xs font-black uppercase tracking-widest">
                                    + Generate New API Key
                                </button>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-12 lg:col-span-5 space-y-8">
                            {/* Alerts Section */}
                            <section className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01] shadow-2xl">
                                <h3 className="text-xl font-bold text-white font-manrope mb-8">Alerts & Notifications</h3>
                                <div className="space-y-6">
                                    <SettingToggle label="High Spend Alerts" desc="Notify when budget exceeds 80%" checked={true} />
                                    <SettingToggle label="Email Summaries" desc="Weekly financial health reports" checked={true} />
                                    <SettingToggle label="Login Security" desc="Alert on new device sign-in" checked={false} />
                                </div>
                            </section>

                            {/* Plan Card */}
                            <section className="bg-indigo-600 rounded-3xl p-10 relative overflow-hidden shadow-2xl shadow-indigo-600/20 group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] opacity-80">Current Plan</span>
                                        <h2 className="text-5xl font-black text-white font-manrope tracking-tight mt-2 italic">Enterprise</h2>
                                        <p className="text-indigo-100/70 text-xs font-medium mt-3">Billed annually. Next renewal Dec 2024.</p>
                                    </div>
                                    <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]">
                                        Manage Subscription
                                    </button>
                                </div>
                                <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                                <div className="absolute -left-20 -top-20 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <footer className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <button className="text-rose-500 font-black text-xs uppercase tracking-widest hover:text-rose-400 transition-colors">Delete Account</button>
                        <div className="flex items-center gap-6">
                            <button className="text-slate-500 hover:text-white font-bold text-sm transition-colors">Cancel Changes</button>
                            <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98]">
                                Save Preferences
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default Settings;
