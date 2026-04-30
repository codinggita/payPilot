const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/user.model');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({
            success: true,
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                // Optional fields (if they exist in your model)
                avatar: user.avatar || null,
                phone: user.phone || null,
                organization: user.organization || null
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { fullName, email, phone, organization, avatar } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (organization) user.organization = organization;
        if (avatar) user.avatar = avatar;
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                organization: user.organization,
                avatar: user.avatar,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Check Gmail connection status
router.get('/gmail-status', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const connected = !!(user?.gmailAccessToken);
        res.json({ 
            connected, 
            email: connected ? user?.gmailEmail || user.email : null 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Disconnect Gmail
router.post('/gmail-disconnect', protect, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            gmailAccessToken: null,
            gmailRefreshToken: null,
            gmailConnectedAt: null,
            gmailEmail: null
        });
        res.json({ message: 'Gmail disconnected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check Plaid connection status
router.get('/plaid-status', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const connected = !!(user?.plaidAccessToken);
        res.json({ connected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Disconnect Plaid
router.post('/plaid-disconnect', protect, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            plaidAccessToken: null,
            plaidItemId: null,
            plaidConnectedAt: null
        });
        res.json({ message: 'Plaid disconnected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
