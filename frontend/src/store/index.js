import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import transactionReducer from './slices/transactionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subscriptions: subscriptionReducer,
        transactions: transactionReducer,
        ui: uiReducer,
    },
});
