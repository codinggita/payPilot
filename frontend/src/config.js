export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        logout: `${API_URL}/auth/logout`,
    },
    user: {
        profile: `${API_URL}/users/profile`,
        update: `${API_URL}/users/profile`,
    },
    subscriptions: {
        list: `${API_URL}/subscriptions`,
        create: `${API_URL}/subscriptions`,
        update: (id) => `${API_URL}/subscriptions/${id}`,
        delete: (id) => `${API_URL}/subscriptions/${id}`,
        pause: (id) => `${API_URL}/subscriptions/${id}/pause`,
        resume: (id) => `${API_URL}/subscriptions/${id}/resume`,
        suggestions: `${API_URL}/subscriptions/suggestions`,
    },
    transactions: {
        list: `${API_URL}/transactions`,
        upload: `${API_URL}/transactions/upload`,
    },
    rewards: {
        list: `${API_URL}/rewards`,
        redeem: `${API_URL}/rewards/redeem`,
    },
    wallets: {
        list: `${API_URL}/wallets`,
        create: `${API_URL}/wallets`,
    },
    reconciliation: {
        upload: `${API_URL}/reconciliation/upload`,
        status: `${API_URL}/reconciliation/status`,
    },
};
