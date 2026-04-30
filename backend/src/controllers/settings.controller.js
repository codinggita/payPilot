const User = require('../models/user.model');

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
                marketing: false
            },
            currency: 'USD',
            language: 'en',
            autoDetectSubscriptions: true
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
        const { theme, notifications, currency, language, autoDetectSubscriptions } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (!user.settings) user.settings = {};
        
        if (theme) user.settings.theme = theme;
        if (notifications) user.settings.notifications = { ...user.settings.notifications, ...notifications };
        if (currency) user.settings.currency = currency;
        if (language) user.settings.language = language;
        if (autoDetectSubscriptions !== undefined) user.settings.autoDetectSubscriptions = autoDetectSubscriptions;
        
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
