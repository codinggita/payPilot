const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Configuration for Plaid client
const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

class PlaidService {
    // Create link token for Plaid Link
    static async createLinkToken(userId) {
        try {
            console.log('Creating link token for user:', userId);
            
            const request = {
                user: { client_user_id: userId },
                client_name: 'PayPilot',
                products: ['transactions'],
                country_codes: ['US'],
                language: 'en',
                webhook: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/plaid/webhook`
            };
            
            console.log('Plaid request:', JSON.stringify(request, null, 2));
            
            const response = await plaidClient.linkTokenCreate(request);
            console.log('Link token created successfully');
            
            return response.data;
        } catch (error) {
            console.error('Plaid create link token error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error_message || error.message);
        }
    }
    
    // Exchange public token for access token
    static async exchangePublicToken(publicToken) {
        try {
            console.log('Exchanging public token...');
            
            const response = await plaidClient.itemPublicTokenExchange({
                public_token: publicToken
            });
            
            console.log('Token exchange successful');
            return response.data;
        } catch (error) {
            console.error('Plaid exchange token error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error_message || error.message);
        }
    }
    
    // Fetch transactions
    static async getTransactions(accessToken, startDate, endDate) {
        try {
            console.log(`Fetching transactions from ${startDate} to ${endDate}`);
            
            const response = await plaidClient.transactionsGet({
                access_token: accessToken,
                start_date: startDate,
                end_date: endDate,
                options: { count: 500 }
            });
            
            console.log(`Fetched ${response.data.transactions.length} transactions`);
            return response.data;
        } catch (error) {
            console.error('Plaid get transactions error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error_message || error.message);
        }
    }
    
    // Get recent transactions (last 90 days)
    static async getRecentTransactions(accessToken) {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return this.getTransactions(accessToken, startDate, endDate);
    }
}

module.exports = { PlaidService, plaidClient };
