const Wallet = require('../models/Wallet');

// @desc    Get all wallets for user
// @route   GET /api/wallets
// @access  Private
exports.getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find({ userId: req.user.id }).sort({ createdAt: -1 });
        
        // Calculate total balance
        const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
        
        res.json({
            success: true,
            data: wallets,
            totalBalance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single wallet by ID
// @route   GET /api/wallets/:id
// @access  Private
exports.getWalletById = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        
        res.json({ success: true, data: wallet });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new wallet
// @route   POST /api/wallets
// @access  Private
exports.createWallet = async (req, res) => {
    try {
        const { walletName, provider, balance, linkedCard, rewardsBalance } = req.body;
        
        const wallet = await Wallet.create({
            userId: req.user.id,
            walletName: walletName || provider,
            provider,
            balance: balance || 0,
            linkedCard: linkedCard || '',
            rewardsBalance: rewardsBalance || 0,
            status: 'active'
        });
        
        res.status(201).json({
            success: true,
            message: 'Wallet added successfully',
            data: wallet
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update wallet
// @route   PUT /api/wallets/:id
// @access  Private
exports.updateWallet = async (req, res) => {
    try {
        const { walletName, balance, linkedCard, rewardsBalance, status } = req.body;
        
        const wallet = await Wallet.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        
        if (walletName) wallet.walletName = walletName;
        if (balance !== undefined) wallet.balance = balance;
        if (linkedCard) wallet.linkedCard = linkedCard;
        if (rewardsBalance !== undefined) wallet.rewardsBalance = rewardsBalance;
        if (status) wallet.status = status;
        
        wallet.updatedAt = new Date();
        await wallet.save();
        
        res.json({
            success: true,
            message: 'Wallet updated successfully',
            data: wallet
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete wallet
// @route   DELETE /api/wallets/:id
// @access  Private
exports.deleteWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        
        res.json({
            success: true,
            message: 'Wallet deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
