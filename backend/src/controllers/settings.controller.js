const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('settings');
        
        const defaultSettings = {
            theme: 'dark',
            notifications: {
                email: true,
                push: true,
                renewalReminders: true,
                weeklyDigest: true,
                marketing: false
            },
            currency: 'USD',
            language: 'en',
            autoDetectSubscriptions: true,
            twoFactorAuth: false
        };
        
        res.json({
            success: true,
            data: user?.settings || defaultSettings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        const { 
            theme, 
            notifications, 
            currency, 
            language, 
            autoDetectSubscriptions,
            twoFactorAuth 
        } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!user.settings) user.settings = {};
        
        // Update each setting if provided
        if (theme !== undefined) user.settings.theme = theme;
        if (currency) user.settings.currency = currency;
        if (language) user.settings.language = language;
        if (autoDetectSubscriptions !== undefined) user.settings.autoDetectSubscriptions = autoDetectSubscriptions;
        if (twoFactorAuth !== undefined) user.settings.twoFactorAuth = twoFactorAuth;
        
        // Update notifications if provided
        if (notifications) {
            user.settings.notifications = {
                ...user.settings.notifications,
                ...notifications
            };
        }
        
        await user.save();
        
        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/settings/password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide current and new password' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }
        
        const user = await User.findById(req.user.id);
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
