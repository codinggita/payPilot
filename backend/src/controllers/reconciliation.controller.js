const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const Suggestion = require('../models/Suggestion');
const { detectRecurringTransactions } = require('../services/patternDetector');

// Parse CSV helper function
const parseCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const transactions = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                let date = row.Date || row.date || row['Transaction Date'] || row['Posting Date'];
                let description = row.Description || row.description || row['Merchant Name'] || row['Payee'];
                let amount = parseFloat(row.Amount || row.amount || row.Debit || row.Withdrawal);
                
                if (amount < 0) amount = Math.abs(amount);
                
                if (date && description && amount > 0) {
                    transactions.push({
                        date: new Date(date),
                        merchant: description.trim().substring(0, 100),
                        amount: amount,
                        category: 'Uncategorized',
                        status: 'pending'
                    });
                }
            })
            .on('end', () => resolve(transactions))
            .on('error', reject);
    });
};

// Upload statement endpoint
exports.uploadStatement = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const transactions = await parseCSVFile(req.file.path);
        
        // Save transactions to database
        const savedTransactions = [];
        for (const tx of transactions) {
            const newTx = await Transaction.create({
                userId: req.user.id,
                ...tx
            });
            savedTransactions.push(newTx);
        }
        
        // Detect subscriptions
        const detected = detectRecurringTransactions(transactions);
        
        // Create suggestions
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
                    source: 'csv',
                    data: sub,
                    status: 'pending'
                });
            }
        }
        
        // Clean up
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        res.json({
            success: true,
            transactionsCount: savedTransactions.length,
            detectedCount: detected.length
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET reconciliation stats
exports.getStats = async (req, res) => {
    try {
        const totalTransactions = await Transaction.countDocuments({ userId: req.user.id });
        const matchedTransactions = await Transaction.countDocuments({ userId: req.user.id, status: 'matched' });
        const pendingTransactions = await Transaction.countDocuments({ userId: req.user.id, status: 'pending' });
        
        // Get total amount
        const totalAmountResult = await Transaction.aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get category breakdown
        const categoryBreakdown = await Transaction.aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: '$category', count: { $sum: 1 }, total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);
        
        res.json({
            success: true,
            data: {
                totalTransactions,
                matchedTransactions,
                pendingTransactions,
                unmatchedTransactions: totalTransactions - matchedTransactions,
                totalAmount: totalAmountResult[0]?.total || 0,
                categoryBreakdown
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
