import { supabase } from '@/src/lib/supabase';
import { createApi } from '@reduxjs/toolkit/query/react';
import { supabaseBaseQuery } from './baseQuerySupabase';

export const profilesApi = createApi({
    reducerPath: 'profilesApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (id: string) =>
                supabase.from('profiles').select('*').eq('id', id).single(),
            providesTags: (result, error, id) => [{ type: 'Profile', id }],
        }),
        updateProfile: builder.mutation({
            query: ({ id, fields }: { id: string; fields: any }) =>
                supabase.from('profiles').update(fields).eq('id', id).select().single(),
            invalidatesTags: (result, error, { id }) => [{ type: 'Profile', id }],
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profilesApi;
