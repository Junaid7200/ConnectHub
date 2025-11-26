import {
    getConversationsForUser,
    getMessages,
    sendMessage,
    startConversationTwoStep,
} from '@/src/lib/messages';
import { createApi } from '@reduxjs/toolkit/query/react';
import { supabaseBaseQuery } from './baseQuerySupabase';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['Conversation', 'Message'],
    endpoints: (builder) => ({
        getConversations: builder.query<any[], string>({
            query: (profileId) => getConversationsForUser(profileId),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Conversation' as const, id })),
                        { type: 'Conversation', id: 'LIST' },
                    ]
                    : [{ type: 'Conversation', id: 'LIST' }],
        }),
        getMessages: builder.query<any[], { conversationId: string; limit?: number; offset?: number }>({
            query: ({ conversationId, limit = 50, offset = 0 }) =>
                getMessages(conversationId, limit, offset),
            providesTags: (result, _e, { conversationId }) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Message' as const, id })),
                        { type: 'Conversation', id: conversationId },
                    ]
                    : [{ type: 'Conversation', id: conversationId }],
        }),
        startConversation: builder.mutation<any, string[]>({
            query: (participantIds) =>
                startConversationTwoStep(participantIds).then((data) => ({ data, error: null })),
            invalidatesTags: () => [{ type: 'Conversation', id: 'LIST' }],
        }),
        sendMessage: builder.mutation<any, { conversation_id: string; sender_id: string; content: string }>({
            query: (payload) => sendMessage(payload),
            invalidatesTags: (_r, _e, { conversation_id }) => [
                { type: 'Conversation', id: conversation_id },
            ],
        }),
    }),
});

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useStartConversationMutation,
    useSendMessageMutation,
} = messagesApi;
