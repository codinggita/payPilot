const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['subscription_detected'], default: 'subscription_detected' },
    source: { type: String, enum: ['gmail', 'plaid', 'csv', 'manual'] },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'ignored'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
