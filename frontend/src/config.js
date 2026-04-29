export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
