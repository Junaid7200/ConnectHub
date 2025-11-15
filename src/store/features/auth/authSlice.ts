import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

// Define the shape of our auth state
interface AuthState {
    session: User | null;
    isAuthenticated: boolean;
}

// Define the initial state
const initialState: AuthState = {
    session: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    // 'reducers' are functions that update the state
    reducers: {
        // This action will be called when the user logs in
        setSession: (state, action: PayloadAction<User>) => {
            state.session = action.payload;
            state.isAuthenticated = true;
        },
        // This action will be called when the user logs out
        clearSession: (state) => {
            state.session = null;
            state.isAuthenticated = false;
        },
    },
});

// Export the actions so we can use them in our components
export const { setSession, clearSession } = authSlice.actions;

// Export the reducer to add it to the store
export default authSlice.reducer;