const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');

// @desc    Get all rewards for logged-in user
// @route   GET /api/rewards
// @access  Private
exports.getRewards = async (req, res) => {
    try {
        const { status, sourceType } = req.query;
        
        const query = { userId: req.user.id };
        if (status) query.status = status;
        if (sourceType) query.sourceType = sourceType;
        
        const rewards = await Reward.find(query).sort({ createdAt: -1 });
        
        // Calculate summary stats
        const totalPoints = rewards
            .filter(r => r.rewardType === 'points' && r.status === 'credited')
            .reduce((sum, r) => sum + (r.pointsEarned || 0), 0);
        
        const totalCashback = rewards
            .filter(r => r.rewardType === 'cashback' && r.status === 'credited')
            .reduce((sum, r) => sum + (r.cashbackAmount || 0), 0);
        
        const pendingAmount = rewards
            .filter(r => r.status === 'pending')
            .reduce((sum, r) => sum + (r.cashbackAmount || r.pointsEarned || 0), 0);
        
        res.json({
            success: true,
            data: rewards,
            summary: {
                totalPoints,
                totalCashback,
                pendingAmount
            }
        });
    } catch (error) {
        console.error('Get rewards error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single reward by ID
// @route   GET /api/rewards/:id
// @access  Private
exports.getRewardById = async (req, res) => {
    try {
        const reward = await Reward.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }
        
        res.json({ success: true, data: reward });
    } catch (error) {
        console.error('Get reward error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new reward (from transaction cashback)
// @route   POST /api/rewards
// @access  Private
exports.createReward = async (req, res) => {
    try {
        const { sourceType, sourceName, rewardType, pointsEarned, cashbackAmount, expiryDate, transactionId } = req.body;
        
        const reward = await Reward.create({
            userId: req.user.id,
            sourceType,
            sourceName,
            rewardType: rewardType || 'points',
            pointsEarned: pointsEarned || 0,
            cashbackAmount: cashbackAmount || 0,
            expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'pending',
            transactionId
        });
        
        // Update transaction with reward reference if provided
        if (transactionId) {
            await Transaction.findByIdAndUpdate(transactionId, { rewardId: reward._id });
        }
        
        res.status(201).json({
            success: true,
            message: 'Reward created successfully',
            data: reward
        });
    } catch (error) {
        console.error('Create reward error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update reward status (redeem/credit)
// @route   PUT /api/rewards/:id
// @access  Private
exports.updateReward = async (req, res) => {
    try {
        const { status, redemptionMethod } = req.body;
        
        const reward = await Reward.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }
        
        if (status) {
            reward.status = status;
            if (status === 'redeemed') {
                reward.redeemedAt = new Date();
                reward.redemptionMethod = redemptionMethod || 'manual';
            }
        }
        
        await reward.save();
        
        res.json({
            success: true,
            message: `Reward ${status === 'redeemed' ? 'redeemed' : 'updated'} successfully`,
            data: reward
        });
    } catch (error) {
        console.error('Update reward error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete reward
// @route   DELETE /api/rewards/:id
// @access  Private
exports.deleteReward = async (req, res) => {
    try {
        const reward = await Reward.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!reward) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }
        
        res.json({
            success: true,
            message: 'Reward deleted successfully'
        });
    } catch (error) {
        console.error('Delete reward error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get rewards summary by source
// @route   GET /api/rewards/summary/sources
// @access  Private
exports.getRewardsSummary = async (req, res) => {
    try {
        const summary = await Reward.aggregate([
            { $match: { userId: req.user.id, status: 'credited' } },
            {
                $group: {
                    _id: '$sourceName',
                    totalPoints: { $sum: '$pointsEarned' },
                    totalCashback: { $sum: '$cashbackAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalPoints: -1, totalCashback: -1 } }
        ]);
        
        res.json({ success: true, data: summary });
    } catch (error) {
        console.error('Get rewards summary error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
