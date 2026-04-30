const mongoose = require('mongoose');

const reconciliationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    statementFile: { type: String },
    totalEntries: { type: Number, default: 0 },
    matchedEntries: { type: Number, default: 0 },
    unmatchedEntries: { type: Number, default: 0 },
    discrepancyAmount: { type: Number, default: 0 },
    matchConfidence: { type: Number, default: 0 },
    
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    
    matchedTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    unmatchedTransactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reconciliation', reconciliationSchema);
