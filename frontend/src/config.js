export const API_URL = 'https://paypilot-api.onrender.com/api';

export const endpoints = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
    },
    subscriptions: {
        list: `${API_URL}/subscriptions`,
        suggestions: `${API_URL}/subscriptions/suggestions`,
    },
    reconciliation: {
        upload: `${API_URL}/reconciliation/upload`,
    },
    users: {
        profile: `${API_URL}/users/profile`,
        gmailStatus: `${API_URL}/users/gmail-status`,
        plaidStatus: `${API_URL}/users/plaid-status`,
    }
};
