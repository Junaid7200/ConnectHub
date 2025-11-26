import {
    addMember,
    createList,
    deleteList,
    getListByOwner,
    getMemberLists,
    getSubscribedLists,
    removeMember,
    subscribe,
    unsubscribe,
    updateList,
} from '@/src/lib/lists';
import { supabaseBaseQuery } from '@/src/store/services/baseQuerySupabase';
import { createApi } from '@reduxjs/toolkit/query/react';

export const listsApi = createApi({
    reducerPath: 'listsApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['List'],
    endpoints: (builder) => ({
        getOwnedLists: builder.query<any[], string>({
            query: (ownerId) => getListByOwner(ownerId),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'List' as const, id })),
                        { type: 'List', id: 'OWNED' },
                    ]
                    : [{ type: 'List', id: 'OWNED' }],
        }),
        getSubscribedLists: builder.query<any[], string>({
            query: (profileId) => getSubscribedLists(profileId),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ lists }) => ({ type: 'List' as const, id: lists?.id })),
                        { type: 'List', id: 'SUBSCRIBED' },
                    ]
                    : [{ type: 'List', id: 'SUBSCRIBED' }],
        }),
        getMemberLists: builder.query<any[], string>({
            query: (profileId) => getMemberLists(profileId),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ lists }) => ({ type: 'List' as const, id: lists?.id })),
                        { type: 'List', id: 'MEMBER' },
                    ]
                    : [{ type: 'List', id: 'MEMBER' }],
        }),
        createList: builder.mutation<any, { owner_id: string; name: string; description?: string | null; is_private?: boolean; cover_image_url?: string | null }>({
            query: (payload) => createList(payload),
            invalidatesTags: () => [{ type: 'List', id: 'OWNED' }],
        }),
        updateList: builder.mutation<any, { listId: string; payload: any }>({
            query: ({ listId, payload }) => updateList(listId, payload),
            invalidatesTags: (_r, _e, { listId }) => [{ type: 'List', id: listId }],
        }),
        deleteList: builder.mutation<any, string>({
            query: (listId) => deleteList(listId),
            invalidatesTags: (_r, _e, listId) => [
                { type: 'List', id: listId },
                { type: 'List', id: 'OWNED' },
            ],
        }),
        addMember: builder.mutation<any, { listId: string; profileId: string }>({
            query: ({ listId, profileId }) => addMember(listId, profileId),
            invalidatesTags: (_r, _e, { listId }) => [{ type: 'List', id: listId }],
        }),
        removeMember: builder.mutation<any, { listId: string; profileId: string }>({
            query: ({ listId, profileId }) => removeMember(listId, profileId),
            invalidatesTags: (_r, _e, { listId }) => [{ type: 'List', id: listId }],
        }),
        subscribe: builder.mutation<any, { listId: string; profileId: string }>({
            query: ({ listId, profileId }) => subscribe(listId, profileId),
            invalidatesTags: () => [{ type: 'List', id: 'SUBSCRIBED' }],
        }),
        unsubscribe: builder.mutation<any, { listId: string; profileId: string }>({
            query: ({ listId, profileId }) => unsubscribe(listId, profileId),
            invalidatesTags: () => [{ type: 'List', id: 'SUBSCRIBED' }],
        }),
    }),
});

export const {
    useGetOwnedListsQuery,
    useGetSubscribedListsQuery,
    useGetMemberListsQuery,
    useCreateListMutation,
    useUpdateListMutation,
    useDeleteListMutation,
    useAddMemberMutation,
    useRemoveMemberMutation,
    useSubscribeMutation,
    useUnsubscribeMutation,
} = listsApi;
