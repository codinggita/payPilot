const mongoose = require('mongoose');
require('dotenv').config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        
        const Transaction = require('./src/models/Transaction');
        const User = require('./src/models/user.model');
        
        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }
        
        // Count before deletion
        const beforeCount = await Transaction.countDocuments({ userId: user._id });
        console.log(`Before cleanup: ${beforeCount} transactions`);
        
        // Delete all transactions for this user
        const result = await Transaction.deleteMany({ userId: user._id });
        console.log(`Deleted ${result.deletedCount} transactions`);
        
        // Verify
        const afterCount = await Transaction.countDocuments({ userId: user._id });
        console.log(`After cleanup: ${afterCount} transactions`);
        
        console.log('? Cleanup complete! Now upload your CSV again to get clean data.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

cleanup();
