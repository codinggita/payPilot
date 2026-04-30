const mongoose = require('mongoose');
require('dotenv').config();

const createTestSuggestion = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        
        const User = require('../models/user.model');
        const Suggestion = require('../models/Suggestion');
        
        const user = await User.findOne();
        if (!user) {
            console.log('No user found. Please register first.');
            process.exit(1);
        }
        
        // Check if suggestion already exists
        const existing = await Suggestion.findOne({ 
            userId: user._id, 
            'data.merchant': 'Spotify' 
        });
        
        if (!existing) {
            const suggestion = await Suggestion.create({
                userId: user._id,
                type: 'subscription_detected',
                source: 'gmail',
                data: {
                    merchant: 'Spotify',
                    originalMerchant: 'Spotify.com',
                    amount: '9.99',
                    billingCycle: 'monthly',
                    nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    confidence: 92,
                    firstDetected: new Date(),
                    lastDetected: new Date(),
                    matchedTransactionIds: []
                },
                status: 'pending'
            });
            console.log('Test suggestion created:', suggestion);
        } else {
            console.log('Test suggestion already exists');
        }
        
        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
};

createTestSuggestion();
