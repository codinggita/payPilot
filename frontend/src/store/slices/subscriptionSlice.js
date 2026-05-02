import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config';

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await fetch(`${API_URL}/subscriptions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            return data.success ? data.data : data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const pauseSubscription = createAsyncThunk(
    'subscriptions/pause',
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await fetch(`${API_URL}/subscriptions/${id}/pause`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to pause');
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const resumeSubscription = createAsyncThunk(
    'subscriptions/resume',
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await fetch(`${API_URL}/subscriptions/${id}/resume`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to resume');
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteSubscription = createAsyncThunk(
    'subscriptions/delete',
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            const response = await fetch(`${API_URL}/subscriptions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete');
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(pauseSubscription.fulfilled, (state, action) => {
                const sub = state.list.find(s => s._id === action.payload);
                if (sub) sub.status = 'paused';
            })
            .addCase(resumeSubscription.fulfilled, (state, action) => {
                const sub = state.list.find(s => s._id === action.payload);
                if (sub) sub.status = 'active';
            })
            .addCase(deleteSubscription.fulfilled, (state, action) => {
                state.list = state.list.filter(s => s._id !== action.payload);
            });
    },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
