const express = require('express');
const router = express.Router();
const { PlaidService } = require('../services/plaid.service');
const { protect } = require('../middleware/auth');
const User = require('../models/user.model');
const Subscription = require('../models/Subscription');
const Suggestion = require('../models/Suggestion');
const { detectRecurringTransactions } = require('../services/patternDetector');

// Step 1: Create link token
router.post('/create-link-token', protect, async (req, res) => {
    try {
        console.log('Create link token request for user:', req.user.id);
        const { link_token } = await PlaidService.createLinkToken(req.user.id);
        res.json({ link_token });
    } catch (error) {
        console.error('Plaid link token error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Step 2: Exchange public token
router.post('/exchange-public-token', protect, async (req, res) => {
    const { public_token } = req.body;
    
    if (!public_token) {
        return res.status(400).json({ error: 'public_token is required' });
    }
    
    try {
        console.log('Exchange public token for user:', req.user.id);
        
        const { access_token, item_id } = await PlaidService.exchangePublicToken(public_token);
        
        await User.findByIdAndUpdate(req.user.id, {
            plaidAccessToken: access_token,
            plaidItemId: item_id,
            plaidConnectedAt: new Date()
        });
        
        console.log('Fetching transactions...');
        
        // Fetch initial transactions
        const { transactions } = await PlaidService.getRecentTransactions(access_token);
        
        console.log(`Processing ${transactions.length} transactions`);
        
        // Convert Plaid transactions to our format
        const formattedTransactions = transactions.map(tx => ({
            merchant: tx.merchant_name || tx.name,
            amount: Math.abs(tx.amount),
            date: tx.date,
            category: tx.category?.[0],
            sourceAccount: tx.account_id
        }));
        
        // Detect subscriptions
        const detected = detectRecurringTransactions(formattedTransactions);
        console.log(`Detected ${detected.length} potential subscriptions`);
        
        let suggestionsCreated = 0;
        
        for (const sub of detected) {
            const existing = await Subscription.findOne({
                userId: req.user.id,
                merchant: sub.merchant,
                status: { $ne: 'cancelled' }
            });
            
            if (!existing) {
                await Suggestion.create({
                    userId: req.user.id,
                    type: 'subscription_detected',
                    source: 'plaid',
                    data: sub,
                    status: 'pending'
                });
                suggestionsCreated++;
            }
        }
        
        console.log(`Created ${suggestionsCreated} suggestions`);
        
        res.json({ 
            success: true, 
            detectedCount: detected.length,
            suggestionsCreated,
            message: `Bank connected successfully! Found ${detected.length} subscriptions.`
        });
        
    } catch (error) {
        console.error('Plaid exchange error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Step 3: Sync transactions (call this periodically)
router.post('/sync', protect, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user?.plaidAccessToken) {
        return res.status(401).json({ error: 'Plaid not connected' });
    }
    
    try {
        const { transactions } = await PlaidService.getRecentTransactions(user.plaidAccessToken);
        
        const formattedTransactions = transactions.map(tx => ({
            merchant: tx.merchant_name || tx.name,
            amount: Math.abs(tx.amount),
            date: tx.date,
            category: tx.category?.[0]
        }));
        
        const detected = detectRecurringTransactions(formattedTransactions);
        
        res.json({ synced: transactions.length, detected: detected.length });
    } catch (error) {
        console.error('Plaid sync error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Step 4: Webhook for real-time updates
router.post('/webhook', async (req, res) => {
    const { webhook_type, webhook_code, item_id } = req.body;
    console.log('Plaid webhook received:', { webhook_type, webhook_code, item_id });
    
    if (webhook_type === 'TRANSACTIONS' && webhook_code === 'INITIAL_UPDATE') {
        const user = await User.findOne({ plaidItemId: item_id });
        if (user) {
            setTimeout(async () => {
                try {
                    const { transactions } = await PlaidService.getRecentTransactions(user.plaidAccessToken);
                    console.log(`Webhook: Fetched ${transactions.length} transactions for user ${user._id}`);
                } catch (error) {
                    console.error('Webhook sync error:', error);
                }
            }, 1000);
        }
    }
    
    res.sendStatus(200);
});

module.exports = router;
