const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

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
  static async createLinkToken(userId) {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'PayPilot',
      products: ['transactions'],
      country_codes: ['US', 'GB', 'CA', 'IN'],
      language: 'en',
      webhook: `${process.env.BACKEND_URL}/api/plaid/webhook`
    });
    return response.data;
  }
  
  static async exchangePublicToken(publicToken) {
    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    return response.data;
  }
  
  static async getTransactions(accessToken, startDate, endDate) {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: { count: 500 }
    });
    return response.data;
  }
  
  static async getRecentTransactions(accessToken) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return this.getTransactions(accessToken, startDate, endDate);
  }
}

module.exports = { PlaidService, plaidClient };
