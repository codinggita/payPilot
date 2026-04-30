const Transaction = require('../models/Transaction');
const Suggestion = require('../models/Suggestion');

// @desc    Get upload history (statements list)
// @route   GET /api/statements/history
// @access  Private
exports.getUploadHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get all transactions grouped by creation date
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(500);
        
        if (transactions.length === 0) {
            return res.json({
                success: true,
                data: [],
                totalUploads: 0,
                totalEntries: 0
            });
        }
        
        // Group by upload date (using createdAt)
        const groupedByDate = {};
        
        for (const tx of transactions) {
            const dateKey = tx.createdAt 
                ? new Date(tx.createdAt).toISOString().split('T')[0] 
                : new Date(tx.date).toISOString().split('T')[0];
            
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = {
                    date: dateKey,
                    entries: 0,
                    totalAmount: 0,
                    merchants: new Set(),
                    status: 'Parsed'
                };
            }
            
            groupedByDate[dateKey].entries++;
            groupedByDate[dateKey].totalAmount += tx.amount || 0;
            if (tx.merchant) groupedByDate[dateKey].merchants.add(tx.merchant);
        }
        
        // Convert to array format
        const history = Object.keys(groupedByDate)
            .sort((a, b) => b.localeCompare(a)) // Sort by date descending
            .map(dateKey => {
                const group = groupedByDate[dateKey];
                const formattedDate = new Date(dateKey).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                });
                return {
                    _id: dateKey,
                    date: formattedDate,
                    fileName: `Bank_Statement_${dateKey}.csv`,
                    type: 'csv',
                    account: 'Bank Statement',
                    status: 'Parsed',
                    entries: group.entries,
                    totalAmount: group.totalAmount,
                    merchants: Array.from(group.merchants).slice(0, 5)
                };
            });
        
        res.json({
            success: true,
            data: history,
            totalUploads: history.length,
            totalEntries: transactions.length
        });
    } catch (error) {
        console.error('Get upload history error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get statements statistics
// @route   GET /api/statements/stats
// @access  Private
exports.getStatementStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const totalUploaded = await Transaction.countDocuments({ userId });
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUploads = await Transaction.countDocuments({ 
            userId, 
            createdAt: { $gte: sevenDaysAgo } 
        });
        
        const pendingReview = await Transaction.countDocuments({ userId, status: 'pending' });
        const matchedCount = await Transaction.countDocuments({ userId, status: 'matched' });
        const totalCount = await Transaction.countDocuments({ userId });
        const matchAccuracy = totalCount > 0 
            ? ((matchedCount / totalCount) * 100).toFixed(1) 
            : '0.0';
        
        const detectedSubscriptions = await Suggestion.countDocuments({ userId });
        
        res.json({
            success: true,
            data: {
                totalUploaded,
                recentUploads,
                pendingReview,
                matchAccuracy: `${matchAccuracy}%`,
                detectedSubscriptions,
                storageUsed: '1.2GB'
            }
        });
    } catch (error) {
        console.error('Get statement stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get data preview (recent entries)
// @route   GET /api/statements/preview
// @access  Private
exports.getDataPreview = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const recentEntries = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('merchant date amount category status');
        
        const totalEntries = await Transaction.countDocuments({ userId });
        const matchedEntries = await Transaction.countDocuments({ userId, status: 'matched' });
        const pendingEntries = await Transaction.countDocuments({ userId, status: 'pending' });
        
        res.json({
            success: true,
            data: {
                recentEntries,
                totalEntries,
                matchedEntries,
                pendingEntries
            }
        });
    } catch (error) {
        console.error('Get data preview error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
