const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Get absolute path to models
const modelsPath = path.join(__dirname, '..', 'models');

const createSampleRewards = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        
        // Load models with absolute path
        const User = require(path.join(modelsPath, 'user.model'));
        const Reward = require(path.join(modelsPath, 'Reward'));
        
        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }
        
        console.log(`User found: ${user.email}`);
        console.log(`User ID: ${user._id}`);
        
        // Check if rewards already exist
        const existing = await Reward.countDocuments({ userId: user._id });
        if (existing > 0) {
            console.log(`Already have ${existing} rewards. Skipping.`);
            await mongoose.disconnect();
            return;
        }
        
        const sampleRewards = [
            { sourceType: 'card', sourceName: 'American Express Platinum', rewardType: 'points', pointsEarned: 45200, status: 'credited' },
            { sourceType: 'card', sourceName: 'Chase Sapphire Reserve', rewardType: 'points', pointsEarned: 28150, status: 'credited' },
            { sourceType: 'wallet', sourceName: 'PayPilot Cashback', rewardType: 'cashback', cashbackAmount: 245.50, status: 'pending' },
            { sourceType: 'upi', sourceName: 'Google Pay Rewards', rewardType: 'points', pointsEarned: 1250, status: 'credited' },
            { sourceType: 'card', sourceName: 'Capital One Venture', rewardType: 'miles', pointsEarned: 18750, status: 'pending' }
        ];
        
        for (const reward of sampleRewards) {
            await Reward.create({
                userId: user._id,
                ...reward,
                expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
            });
            console.log(`  Created: ${reward.sourceName} - ${reward.rewardType === 'points' ? reward.pointsEarned + ' pts' : '$' + reward.cashbackAmount}`);
        }
        
        console.log(`\n? Created ${sampleRewards.length} sample rewards`);
        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

createSampleRewards();
