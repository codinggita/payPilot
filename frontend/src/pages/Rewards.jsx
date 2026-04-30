import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';

const RewardStatCard = ({ title, value, change, trend, icon, color }) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex justify-between items-start mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</p>
            <span className={`material-symbols-outlined text-${color}-400 text-2xl`}>{icon}</span>
        </div>
        <div className="text-3xl font-bold text-white tabular-nums mb-2">{value}</div>
        {change && (
            <div className="flex items-center gap-2">
                <span className={`flex items-center ${trend === 'up' ? 'text-emerald-400' : 'text-slate-400'} text-sm font-bold`}>
                    <span className="material-symbols-outlined text-sm">
                        {trend === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                    {change}
                </span>
                <span className="text-xs text-slate-500 font-medium">vs last month</span>
            </div>
        )}
        {!change && (
            <div className="text-xs text-slate-500 font-medium">
                Estimated clearance in <span className="text-white font-bold">3 days</span>
            </div>
        )}
    </div>
);

const RewardSourceCard = ({ name, type, amount, status, logo, color, isPoints, onRedeem, rewardId }) => (
    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between hover:border-white/10 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[10px] text-white shadow-lg ${color}`}>
                {logo ? <span className="material-symbols-outlined text-white text-xl">{logo}</span> : name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{name}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{type}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="font-bold text-white tabular-nums">{amount} {isPoints ? 'pts' : ''}</div>
            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${status === 'Ready' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {status}
            </div>
            {status === 'Ready' && onRedeem && (
                <button 
                    onClick={() => onRedeem(rewardId)}
                    className="mt-2 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Redeem Now
                </button>
            )}
        </div>
    </div>
);

function Rewards() {
    const [rewards, setRewards] = useState([]);
    const [summary, setSummary] = useState({ totalPoints: 0, totalCashback: 0, pendingAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('1year');
    const [chartData, setChartData] = useState([
        { month: 'MAR', value: 50 },
        { month: 'APR', value: 65 },
        { month: 'MAY', value: 75 },
        { month: 'JUN', value: 85 },
        { month: 'JUL', value: 90 },
        { month: 'AUG', value: 100 }
    ]);

    const fetchRewards = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/rewards', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const result = await response.json();
                setRewards(result.data || []);
                if (result.summary) setSummary(result.summary);
                updateChartData(result.data);
            }
        } catch (error) {
            console.error('Fetch rewards error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = (rewardsData) => {
        // Calculate rewards points per month from actual data
        const monthlyPoints = {};
        const now = new Date();
        
        rewardsData.forEach(reward => {
            const date = new Date(reward.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthlyPoints[month]) monthlyPoints[month] = 0;
            monthlyPoints[month] += reward.pointsEarned || 0;
        });
        
        // Default months if no data
        const months = ['MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];
        const maxPoints = Math.max(...Object.values(monthlyPoints), 100);
        
        const newChartData = months.map(month => ({
            month,
            value: monthlyPoints[month] ? Math.min((monthlyPoints[month] / maxPoints) * 100, 100) : [50, 65, 75, 85, 90, 100][months.indexOf(month)]
        }));
        
        setChartData(newChartData);
    };

    const handleChartPeriodChange = (period) => {
        setChartPeriod(period);
        if (period === '6months') {
            setChartData([
                { month: 'MAR', value: 50 },
                { month: 'APR', value: 65 },
                { month: 'MAY', value: 75 },
                { month: 'JUN', value: 85 },
                { month: 'JUL', value: 90 },
                { month: 'AUG', value: 100 }
            ]);
        } else {
            setChartData([
                { month: 'SEP', value: 55 },
                { month: 'OCT', value: 60 },
                { month: 'NOV', value: 70 },
                { month: 'DEC', value: 80 },
                { month: 'JAN', value: 85 },
                { month: 'FEB', value: 95 },
                { month: 'MAR', value: 88 },
                { month: 'APR', value: 92 },
                { month: 'MAY', value: 85 },
                { month: 'JUN', value: 78 },
                { month: 'JUL', value: 82 },
                { month: 'AUG', value: 100 }
            ]);
        }
    };

    const handleRedeem = async (rewardId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/rewards/${rewardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'redeemed', redemptionMethod: 'manual' })
            });
            
            if (response.ok) {
                alert('? Reward redeemed successfully!');
                fetchRewards(); // Refresh the list
            } else {
                alert('Failed to redeem reward');
            }
        } catch (error) {
            console.error('Redeem error:', error);
            alert('Failed to redeem reward');
        }
    };

    const handleBulkRedeem = async () => {
        const readyRewards = rewards.filter(r => r.status === 'credited' && (r.pointsEarned > 0 || r.cashbackAmount > 0));
        if (readyRewards.length === 0) {
            alert('No rewards available for redemption');
            return;
        }
        
        if (confirm(`Redeem ${readyRewards.length} reward(s) worth ${summary.totalPoints.toLocaleString()} points + $${summary.totalCashback.toFixed(2)}?`)) {
            for (const reward of readyRewards) {
                await fetch(`/api/rewards/${reward._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'redeemed', redemptionMethod: 'bulk' })
                });
            }
            alert('? All rewards redeemed successfully!');
            fetchRewards();
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    // Calculate source-based rewards for the right sidebar
    const sourceRewards = [
        { 
            id: rewards.find(r => r.sourceName === 'American Express Platinum')?._id,
            name: 'American Express', 
            type: 'Platinum Business', 
            amount: Math.floor(summary.totalPoints * 0.36).toLocaleString(), 
            status: summary.totalPoints > 0 ? 'Ready' : 'Pending', 
            color: 'bg-[#006FCF]', 
            isPoints: true 
        },
        { 
            id: rewards.find(r => r.sourceName === 'Chase Sapphire Reserve')?._id,
            name: 'Chase Ultimate', 
            type: 'Sapphire Reserve', 
            amount: Math.floor(summary.totalPoints * 0.1).toLocaleString(), 
            status: summary.totalPoints > 0 ? 'Ready' : 'Pending', 
            color: 'bg-[#117ACA]', 
            isPoints: true 
        },
        { 
            id: rewards.find(r => r.sourceName === 'PayPilot Cashback')?._id,
            name: 'PayPilot Wallet', 
            type: 'Platform Cashback', 
            amount: `$${summary.totalCashback.toFixed(2)}`, 
            status: summary.totalCashback > 0 ? 'Ready' : 'Pending', 
            logo: 'wallet', 
            color: 'bg-indigo-600', 
            isPoints: false 
        }
    ];

    return (
        <div className="bg-[#121414] text-[#e3e2e2] font-['Work_Sans'] antialiased min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 md:pl-64">
                <TopNavBar />
                <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Rewards & Cashback</h1>
                            <p className="text-slate-400 mt-2 font-medium">Analyze your earnings and maximize your enterprise rewards strategy.</p>
                        </div>
                        <button 
                            onClick={handleBulkRedeem}
                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all hover:from-indigo-500 hover:to-indigo-600"
                        >
                            Redeem Rewards
                        </button>
                    </div>

                    {/* Summary Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <RewardStatCard 
                            title="Total Points" 
                            value={summary.totalPoints.toLocaleString()} 
                            change="12.5%" 
                            trend="up" 
                            icon="token" 
                            color="indigo" 
                        />
                        <RewardStatCard 
                            title="Cashback Earned" 
                            value={`$${summary.totalCashback.toFixed(2)}`} 
                            change="8.2%" 
                            trend="up" 
                            icon="payments" 
                            color="emerald" 
                        />
                        <RewardStatCard 
                            title="Pending Approval" 
                            value={`$${summary.pendingAmount.toFixed(2)}`} 
                            icon="hourglass_empty" 
                            color="amber" 
                        />
                    </div>

                    <div className="grid grid-cols-12 gap-8 mb-10">
                        {/* Performance Chart */}
                        <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                                <h3 className="text-xl font-bold text-white font-manrope">Rewards Performance</h3>
                                <div className="flex bg-white/5 p-1 rounded-xl">
                                    <button 
                                        onClick={() => handleChartPeriodChange('6months')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                            chartPeriod === '6months' 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                                                : 'text-slate-500 hover:text-white'
                                        }`}
                                    >
                                        6 Months
                                    </button>
                                    <button 
                                        onClick={() => handleChartPeriodChange('1year')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                            chartPeriod === '1year' 
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                                                : 'text-slate-500 hover:text-white'
                                        }`}
                                    >
                                        1 Year
                                    </button>
                                </div>
                            </div>
                            
                            <div className="h-64 flex items-end justify-between gap-4 px-4">
                                {chartData.map((item, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div 
                                            className="w-full bg-indigo-500/10 rounded-t-xl group-hover:bg-indigo-500/20 transition-all relative overflow-hidden" 
                                            style={{ height: `${item.value}%` }}
                                        >
                                            <div 
                                                className="absolute inset-x-0 bottom-0 bg-indigo-500 rounded-t-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all" 
                                                style={{ height: `${item.value}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reward Sources */}
                        <div className="col-span-12 lg:col-span-4 space-y-4">
                            {sourceRewards.map((reward, idx) => (
                                <RewardSourceCard 
                                    key={idx} 
                                    {...reward} 
                                    onRedeem={() => reward.id && handleRedeem(reward.id)}
                                    rewardId={reward.id}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Redemption History Table */}
                    <div className="glass-panel rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white font-manrope">Redemption History</h3>
                            <button className="text-indigo-400 hover:text-indigo-300 font-bold text-sm flex items-center gap-2 transition-all group">
                                View All <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Source</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Type</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {rewards.length > 0 ? (
                                        rewards.slice(0, 5).map((reward, i) => (
                                            <tr key={reward._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-5 text-sm font-semibold text-white tabular-nums">
                                                    {new Date(reward.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${reward.sourceType === 'card' ? 'bg-[#006FCF]' : reward.sourceType === 'upi' ? 'bg-[#117ACA]' : 'bg-indigo-600'}`}>
                                                            <span className="material-symbols-outlined text-[14px] text-white">
                                                                {reward.sourceType === 'card' ? 'credit_card' : reward.sourceType === 'upi' ? 'qr_code' : 'account_balance_wallet'}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">{reward.sourceName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-slate-400">
                                                    {reward.rewardType === 'points' ? 'Points Earned' : 'Cashback'}
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-white tabular-nums">
                                                    {reward.rewardType === 'points' ? `${reward.pointsEarned?.toLocaleString()} pts` : `$${reward.cashbackAmount?.toFixed(2)}`}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                                                        reward.status === 'credited' ? 'bg-emerald-500/10 border border-emerald-500/20' : 
                                                        reward.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/20' : 
                                                        reward.status === 'redeemed' ? 'bg-slate-500/10 border border-slate-500/20' :
                                                        'bg-slate-500/10 border border-slate-500/20'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            reward.status === 'credited' ? 'bg-emerald-400' : 
                                                            reward.status === 'pending' ? 'bg-amber-400' : 
                                                            reward.status === 'redeemed' ? 'bg-slate-400' : 'bg-slate-400'
                                                        }`}></div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                            reward.status === 'credited' ? 'text-emerald-400' : 
                                                            reward.status === 'pending' ? 'text-amber-400' : 
                                                            reward.status === 'redeemed' ? 'text-slate-400' : 'text-slate-400'
                                                        }`}>
                                                            {reward.status === 'credited' ? 'Available' : reward.status === 'pending' ? 'Processing' : reward.status === 'redeemed' ? 'Redeemed' : reward.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                                                No redemption history yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Rewards;
