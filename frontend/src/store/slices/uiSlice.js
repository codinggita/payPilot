import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        theme: localStorage.getItem('theme') || 'dark',
        sidebarOpen: true,
        globalLoading: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setGlobalLoading: (state, action) => {
            state.globalLoading = action.payload;
        },
    },
});

export const { toggleTheme, setTheme, toggleSidebar, setGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
