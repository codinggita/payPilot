const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    
    // Optional profile fields
    phone: { type: String, default: '' },
    organization: { type: String, default: '' },
    avatar: { type: String, default: '' },
    
    // Gmail Integration
    gmailAccessToken: { type: String },
    gmailRefreshToken: { type: String },
    gmailConnectedAt: { type: Date },
    gmailEmail: { type: String },
    
    // Plaid Integration
    plaidAccessToken: { type: String },
    plaidItemId: { type: String },
    plaidConnectedAt: { type: Date },
    
    // Settings
    settings: {
        autoDetectSubscriptions: { type: Boolean, default: true },
        autoAddSubscriptions: { type: Boolean, default: false }
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
