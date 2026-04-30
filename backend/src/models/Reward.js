const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    sourceType: { type: String, enum: ['card', 'upi', 'wallet', 'cashback'], required: true },
    sourceName: { type: String, required: true },
    rewardType: { type: String, enum: ['points', 'cashback', 'miles'], default: 'points' },
    
    pointsEarned: { type: Number, default: 0 },
    cashbackAmount: { type: Number, default: 0 },
    
    status: { 
        type: String, 
        enum: ['pending', 'credited', 'expired', 'redeemed'],
        default: 'pending'
    },
    
    expiryDate: { type: Date },
    redemptionMethod: { type: String },
    redeemedAt: { type: Date },
    
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    
    createdAt: { type: Date, default: Date.now }
});

rewardSchema.index({ userId: 1, status: 1 });
rewardSchema.index({ userId: 1, expiryDate: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
