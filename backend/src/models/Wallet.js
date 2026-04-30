const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    walletName: { type: String, required: true },
    provider: { type: String, required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    linkedCard: { type: String },
    
    rewardsBalance: { type: Number, default: 0 },
    lastActivity: { type: Date },
    
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

walletSchema.index({ userId: 1, provider: 1 });

module.exports = mongoose.model('Wallet', walletSchema);
