import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config';

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchAll',
    async (filters = {}, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            let url = `${API_URL}/transactions?limit=200`;
            if (filters.status && filters.status !== 'all') url += `&status=${filters.status}`;
            if (filters.category && filters.category !== 'all') url += `&category=${filters.category}`;
            if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
            
            const response = await fetch(url, {
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

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        list: [],
        loading: false,
        error: null,
        filters: { status: 'all', category: 'all', search: '' },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, clearError: clearTxError } = transactionSlice.actions;
export default transactionSlice.reducer;
