import { configureStore } from '@reduxjs/toolkit';
// We just created this
import authReducer from './features/auth/authSlice';

export const store = configureStore({
    reducer: {
        // This connects our authSlice to the main store
        auth: authReducer,
    },
});

// These types are important for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;