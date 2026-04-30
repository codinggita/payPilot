const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

// @desc    Global search across transactions and subscriptions
// @route   GET /api/search
// @access  Private
exports.globalSearch = async (req, res) => {
    try {
        const { query, type } = req.query;
        const userId = req.user.id;
        
        if (!query || query.trim().length === 0) {
            return res.json({ success: true, data: { transactions: [], subscriptions: [], totalResults: 0 } });
        }
        
        const searchRegex = new RegExp(query, 'i');
        let results = {};
        let totalResults = 0;
        
        // Search transactions if type is 'all' or 'transactions'
        if (!type || type === 'all' || type === 'transactions') {
            const transactions = await Transaction.find({
                userId,
                $or: [
                    { merchant: searchRegex },
                    { category: searchRegex },
                    { sourceAccount: searchRegex }
                ]
            })
            .sort({ date: -1 })
            .limit(10)
            .select('merchant amount date category status');
            
            results.transactions = transactions;
            totalResults += transactions.length;
        }
        
        // Search subscriptions if type is 'all' or 'subscriptions'
        if (!type || type === 'all' || type === 'subscriptions') {
            const subscriptions = await Subscription.find({
                userId,
                $or: [
                    { merchant: searchRegex },
                    { billingCycle: searchRegex }
                ]
            })
            .sort({ nextRenewalDate: 1 })
            .limit(10)
            .select('merchant amount billingCycle nextRenewalDate status');
            
            results.subscriptions = subscriptions;
            totalResults += subscriptions.length;
        }
        
        res.json({
            success: true,
            query: query,
            totalResults,
            data: results
        });
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Quick search suggestions
// @route   GET /api/search/suggestions
// @access  Private
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;
        
        if (!query || query.trim().length < 2) {
            return res.json({ success: true, data: [] });
        }
        
        const searchRegex = new RegExp('^' + query, 'i');
        
        // Get unique merchant names
        const merchants = await Transaction.aggregate([
            { $match: { userId, merchant: searchRegex } },
            { $group: { _id: '$merchant', count: { $sum: 1 }, totalAmount: { $sum: '$amount' }, lastDate: { $max: '$date' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        // Get unique categories
        const categories = await Transaction.aggregate([
            { $match: { userId, category: searchRegex } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);
        
        const suggestions = [
            ...merchants.map(m => ({
                type: 'merchant',
                text: m._id,
                subtitle: `${m.count} transactions • Last: ${new Date(m.lastDate).toLocaleDateString()}`,
                count: m.count,
                icon: 'store'
            })),
            ...categories.map(c => ({
                type: 'category',
                text: c._id,
                subtitle: `${c.count} transactions`,
                count: c.count,
                icon: 'category'
            }))
        ].slice(0, 8);
        
        res.json({
            success: true,
            data: suggestions
        });
        
    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
