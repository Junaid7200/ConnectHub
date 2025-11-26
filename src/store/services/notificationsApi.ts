import { getNotifications, markAllRead, markRead } from '@/src/lib/notifications';
import { createApi } from '@reduxjs/toolkit/query/react';
import { supabaseBaseQuery } from './baseQuerySupabase';

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<any[], { recipientId: string; limit?: number; offset?: number }>({
            query: ({ recipientId, limit = 20, offset = 0 }) => getNotifications(recipientId, limit, offset),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Notification' as const, id })),
                        { type: 'Notification', id: 'LIST' },
                    ]
                    : [{ type: 'Notification', id: 'LIST' }],
        }),
        markRead: builder.mutation<any, string>({
            query: (notificationId) => markRead(notificationId),
            invalidatesTags: (_r, _e, id) => [
                { type: 'Notification', id },
                { type: 'Notification', id: 'LIST' },
            ],
        }),
        markAllRead: builder.mutation<any, string>({
            query: (recipientId) => markAllRead(recipientId),
            invalidatesTags: () => [{ type: 'Notification', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkReadMutation,
    useMarkAllReadMutation,
} = notificationsApi;
