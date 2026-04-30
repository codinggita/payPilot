const Transaction = require('../models/Transaction');

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const { limit = 50, page = 1, status, category, search } = req.query;
        
        const query = { userId: req.user.id };
        if (status && status !== 'all') query.status = status;
        if (category && category !== 'all') query.category = category;
        if (search) query.merchant = { $regex: search, $options: 'i' };
        
        const total = await Transaction.countDocuments(query);
        
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        
        res.json({
            success: true,
            data: transactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update transaction status
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    try {
        const { status, category } = req.body;
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        
        if (status) transaction.status = status;
        if (category) transaction.category = category;
        await transaction.save();
        
        res.json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
