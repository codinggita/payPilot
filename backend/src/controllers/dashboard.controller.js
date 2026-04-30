const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

// Helper to categorize merchant
const categorizeMerchant = (merchant) => {
    const lower = merchant.toLowerCase();
    if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('disney') || lower.includes('youtube')) return 'Entertainment';
    if (lower.includes('amazon')) return 'Shopping';
    if (lower.includes('starbucks') || lower.includes('doorDash') || lower.includes('uber') || lower.includes('restaurant')) return 'Food & Dining';
    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('microsoft') || lower.includes('github')) return 'Software & Cloud';
    if (lower.includes('salary') || lower.includes('deposit')) return 'Income';
    return 'Other';
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get ALL transactions (no date filter)
        const allTransactions = await Transaction.find({ userId });
        
        // Calculate total spend from all transactions (excluding income/credits)
        const totalSpend = allTransactions
            .filter(t => t.amount > 0 && !t.merchant.toLowerCase().includes('salary'))
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Get active subscriptions
        const activeSubscriptions = await Subscription.countDocuments({
            userId,
            status: 'active'
        });
        
        // Get paused subscriptions
        const pausedSubscriptions = await Subscription.countDocuments({
            userId,
            status: 'paused'
        });
        
        // Get total subscriptions
        const totalSubscriptions = activeSubscriptions + pausedSubscriptions;
        
        // Get rewards earned (simulate from subscriptions)
        const rewardsEarned = totalSubscriptions * 2.5; // Simulated reward points value
        
        // Get monthly savings (placeholder)
        const monthlySavings = 142.00;
        
        // Get pending reconciliation
        const pendingReconciliation = await Transaction.countDocuments({
            userId,
            status: 'pending'
        });
        
        // Get upcoming renewals (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const upcomingRenewals = await Subscription.countDocuments({
            userId,
            status: 'active',
            nextRenewalDate: { $lte: nextWeek, $gte: new Date() }
        });
        
        res.json({
            success: true,
            data: {
                totalSpend,
                activeSubscriptions,
                pausedSubscriptions,
                totalSubscriptions,
                rewardsEarned,
                monthlySavings,
                pendingReconciliation,
                upcomingRenewals
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard charts data
// @route   GET /api/dashboard/charts
// @access  Private
exports.getDashboardCharts = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get all transactions
        const transactions = await Transaction.find({ userId });
        
        // Group by month for spending trend (all time)
        const monthlyMap = new Map();
        
        for (const tx of transactions) {
            if (tx.amount <= 0) continue; // Skip credits/income
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const monthName = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            
            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { month: monthName, year, amount: 0 });
            }
            monthlyMap.get(monthKey).amount += tx.amount;
        }
        
        // Convert to array and sort by date
        const spendingTrend = Array.from(monthlyMap.values())
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.indexOf(a.month) - months.indexOf(b.month);
            })
            .slice(-6); // Last 6 months
        
        // Group by category
        const categoryMap = new Map();
        
        for (const tx of transactions) {
            if (tx.amount <= 0) continue;
            let category = tx.category;
            if (category === 'Uncategorized' || !category) {
                category = categorizeMerchant(tx.merchant);
            }
            
            if (!categoryMap.has(category)) {
                categoryMap.set(category, { total: 0, count: 0 });
            }
            categoryMap.get(category).total += tx.amount;
            categoryMap.get(category).count++;
        }
        
        const categoryBreakdown = Array.from(categoryMap.entries())
            .map(([name, data]) => ({ _id: name, total: data.total, count: data.count }))
            .sort((a, b) => b.total - a.total);
        
        // Rewards breakdown by merchant
        const rewardsMap = new Map();
        const subscriptions = await Subscription.find({ userId, status: 'active' });
        
        for (const sub of subscriptions) {
            rewardsMap.set(sub.merchant, (rewardsMap.get(sub.merchant) || 0) + (sub.amount * 0.05));
        }
        
        const rewardsBreakdown = Array.from(rewardsMap.entries())
            .map(([name, total]) => ({ _id: name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
        
        res.json({
            success: true,
            data: {
                spendingTrend,
                categoryBreakdown,
                rewardsBreakdown
            }
        });
    } catch (error) {
        console.error('Dashboard charts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
