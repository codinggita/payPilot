import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import SEO from '../components/SEO';
import PageSkeleton from '../components/Skeletons/PageSkeleton';
import { Wallet, Gift, PiggyBank, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { API_URL } from '../config';



const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        const statsRes = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        const chartsRes = await fetch(`${API_URL}/dashboard/charts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const chartsData = await chartsRes.json();
        if (chartsData.success) setCharts(chartsData.data);

      } catch (error) {
        console.error('Fetch dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#121414] min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <TopNavBar />
          <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
            <PageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121414] text-[#e3e2e2] min-h-screen flex">
      <SEO title="Dashboard" description="View your financial overview including total spend, active subscriptions, rewards earned, and monthly savings." />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopNavBar />
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-manrope text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-2">Welcome back! Here is your financial overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-3">
                <Wallet className="w-5 h-5 text-indigo-400" />
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400">Total Spend</p>
              <p className="text-2xl font-bold text-white">${stats?.totalSpend?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm text-slate-400">Active Subscriptions</p>
              <p className="text-2xl font-bold text-white">{stats?.activeSubscriptions || 0}</p>
            </div>

            <div className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-3">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm text-slate-400">Rewards Earned</p>
              <p className="text-2xl font-bold text-white">${stats?.rewardsEarned?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="bg-[#1f2020] rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-3">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-400">Est. Monthly Savings</p>
              <p className="text-2xl font-bold text-white">${stats?.monthlySavings?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {stats?.pendingReconciliation > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <p className="font-semibold text-white">Action Required</p>
                  <p className="text-sm text-slate-400">{stats.pendingReconciliation} transactions need reconciliation</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1f2020] rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Spending Trend</h3>
              {charts?.spendingTrend?.length > 0 ? (
                <div className="h-64 flex items-end justify-between gap-3">
                  {charts.spendingTrend.map((item, idx) => {
                    const maxAmount = Math.max(...(charts.spendingTrend.map(i => i.amount) || [100]));
                    const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-indigo-500/10 rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max(height, 5)}px` }}>
                          <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all" style={{ height: `${height}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-12">No spending data yet. Upload a bank statement.</p>
              )}
            </div>

            <div className="bg-[#1f2020] rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Spending by Category</h3>
              {charts?.categoryBreakdown?.length > 0 ? (
                <div className="space-y-3">
                  {charts.categoryBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{cat._id}</span>
                        <span className="text-white font-medium">${cat.total.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(cat.total / (charts.categoryBreakdown[0]?.total || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-12">No category data yet. Upload a bank statement.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
