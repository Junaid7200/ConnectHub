import { authApi } from '@/src/store/services/authApi';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { listsApi } from './listsApi';
import { messagesApi } from './services/messagesApi';
import { notificationsApi } from './services/notificationsApi';
import { profilesApi } from './services/profilesApi';
import { tweetsApi } from './services/tweetsApi';

export const store = configureStore({
    reducer: {
        // This connects our authSlice to the main store
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [profilesApi.reducerPath]: profilesApi.reducer,
        [tweetsApi.reducerPath]: tweetsApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        [listsApi.reducerPath]: listsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        profilesApi.middleware,
        tweetsApi.middleware,
        notificationsApi.middleware,
        messagesApi.middleware,
        listsApi.middleware
    )
});

// These types are important for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;