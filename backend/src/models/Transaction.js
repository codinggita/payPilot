const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    merchant: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'Uncategorized' },
    date: { type: Date, required: true },
    sourceAccount: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'matched', 'disputed', 'reconciled', 'flagged'],
        default: 'pending'
    },
    referenceNo: { type: String },
    isRecurring: { type: Boolean, default: false },
    
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    reconciliationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reconciliation' },
    
    createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, merchant: 1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
