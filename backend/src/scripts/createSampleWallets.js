const mongoose = require('mongoose');
require('dotenv').config();

const createSampleWallets = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        
        const User = require('../src/models/user.model');
        const Wallet = require('../src/models/Wallet');
        
        const user = await User.findOne();
        if (!user) {
            console.log('No user found');
            process.exit(1);
        }
        
        const existing = await Wallet.countDocuments({ userId: user._id });
        if (existing > 0) {
            console.log(`Already have ${existing} wallets. Skipping.`);
            await mongoose.disconnect();
            return;
        }
        
        const sampleWallets = [
            { walletName: 'American Express', provider: 'American Express', balance: 42350.00, linkedCard: '•••• 4002', rewardsBalance: 124500, status: 'active' },
            { walletName: 'Chase Sapphire', provider: 'Chase', balance: 12840.12, linkedCard: '•••• 8922', rewardsBalance: 88230, status: 'active' },
            { walletName: 'HSBC Global', provider: 'HSBC', balance: 100.00, linkedCard: '•••• 0014', rewardsBalance: 0, status: 'inactive' }
        ];
        
        for (const wallet of sampleWallets) {
            await Wallet.create({ userId: user._id, ...wallet });
            console.log(`  Created: ${wallet.walletName}`);
        }
        
        console.log(`\n? Created ${sampleWallets.length} sample wallets`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

createSampleWallets();
