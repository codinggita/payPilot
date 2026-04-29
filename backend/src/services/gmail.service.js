const { google } = require('googleapis');

class GmailService {
  constructor(accessToken) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    this.oauth2Client.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }
  
  extractSubscriptionFromEmail(email) {
    const data = email.payload?.parts?.[0]?.body?.data || email.payload?.body?.data;
    if (!data) return null;
    
    const decoded = Buffer.from(data, 'base64').toString('utf-8');
    
    const patterns = {
      amount: /(\$[\d,]+\.\d{2})|([\d,]+\.\d{2}\s?(USD|usd))/,
      date: /(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{2}-\d{2})/,
      nextBilling: /next billing date:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      trial: /free trial|trial period/i,
      cancelled: /cancelled|canceled|your subscription has been cancelled/i
    };
    
    const from = email.payload?.headers?.find(h => h.name === 'From')?.value || '';
    let merchant = '';
    
    const senders = {
      'netflix.com': 'Netflix', 'spotify.com': 'Spotify',
      'amazon.com': 'Amazon Prime', 'apple.com': 'Apple',
      'google.com': 'Google', 'microsoft.com': 'Microsoft',
      'disneyplus.com': 'Disney+', 'hulu.com': 'Hulu'
    };
    
    for (const [domain, name] of Object.entries(senders)) {
      if (from.includes(domain)) { merchant = name; break; }
    }
    
    if (!merchant) return null;
    
    const amountMatch = decoded.match(patterns.amount);
    const amount = amountMatch ? parseFloat(amountMatch[0].replace(/[^0-9.-]/g, '')) : null;
    const isCancelled = patterns.cancelled.test(decoded);
    const isTrial = patterns.trial.test(decoded);
    
    let nextBillingDate = null;
    const dateMatch = decoded.match(patterns.nextBilling) || decoded.match(patterns.date);
    if (dateMatch) nextBillingDate = new Date(dateMatch[1]);
    
    return { merchant, amount, nextBillingDate, isTrial, isCancelled, detectedFrom: 'gmail' };
  }
  
  async fetchSubscriptionEmails(maxResults = 50) {
    try {
      const query = 'subject:(subscription OR receipt OR "your bill" OR "payment confirmation")';
      const response = await this.gmail.users.messages.list({ userId: 'me', q: query, maxResults });
      const messages = response.data.messages || [];
      const subscriptions = [];
      const processedIds = new Set();
      
      for (const message of messages) {
        if (processedIds.has(message.id)) continue;
        processedIds.add(message.id);
        const email = await this.gmail.users.messages.get({ userId: 'me', id: message.id, format: 'full' });
        const subscription = this.extractSubscriptionFromEmail(email.data);
        if (subscription && subscription.amount) subscriptions.push(subscription);
      }
      return subscriptions;
    } catch (error) {
      console.error('Gmail fetch error:', error);
      return [];
    }
  }
}

module.exports = GmailService;
