const mongoose = require('mongoose');
require('dotenv').config();

const createSampleTransactions = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        
        const User = require('./src/models/user.model');
        const Transaction = require('./src/models/Transaction');
        
        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }
        
        // Check if transactions exist
        const count = await Transaction.countDocuments({ userId: user._id });
        if (count > 0) {
            console.log(`Already have ${count} transactions. Skipping.`);
            process.exit(0);
        }
        
        const sampleTransactions = [
            { merchant: 'Netflix', amount: 15.99, category: 'Entertainment', date: new Date('2024-04-15'), status: 'matched' },
            { merchant: 'Spotify', amount: 9.99, category: 'Entertainment', date: new Date('2024-04-10'), status: 'matched' },
            { merchant: 'Amazon Prime', amount: 14.99, category: 'Shopping', date: new Date('2024-04-05'), status: 'matched' },
            { merchant: 'AWS Cloud Services', amount: 124.50, category: 'Infrastructure', date: new Date('2024-04-20'), status: 'pending' },
            { merchant: 'Starbucks Coffee', amount: 5.75, category: 'Food', date: new Date('2024-04-18'), status: 'matched' },
            { merchant: 'Uber Ride', amount: 24.30, category: 'Transport', date: new Date('2024-04-16'), status: 'pending' },
            { merchant: 'Apple iCloud', amount: 2.99, category: 'Software', date: new Date('2024-04-12'), status: 'matched' },
            { merchant: 'Disney+', amount: 13.99, category: 'Entertainment', date: new Date('2024-04-08'), status: 'matched' },
            { merchant: 'GitHub Sponsorship', amount: 5.00, category: 'Software', date: new Date('2024-04-03'), status: 'matched' },
            { merchant: 'Microsoft 365', amount: 9.99, category: 'Software', date: new Date('2024-04-01'), status: 'matched' },
            { merchant: 'DoorDash Delivery', amount: 42.50, category: 'Food', date: new Date('2024-03-28'), status: 'matched' },
            { merchant: 'YouTube Premium', amount: 13.99, category: 'Entertainment', date: new Date('2024-03-25'), status: 'pending' }
        ];
        
        for (const tx of sampleTransactions) {
            await Transaction.create({
                userId: user._id,
                ...tx
            });
        }
        
        console.log(`Created ${sampleTransactions.length} sample transactions`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

createSampleTransactions();
