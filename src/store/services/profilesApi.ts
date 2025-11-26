import { follow, getFollowers, getFollowing, getProfileById, getProfileByUsername, getUserSettings, unfollow, updateProfile } from '@/src/lib/profiles';
import { createApi } from '@reduxjs/toolkit/query/react';
import { supabaseBaseQuery } from './baseQuerySupabase';

export const profilesApi = createApi({
    reducerPath: 'profilesApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        getProfileById: builder.query({
            query: (id: string) =>
                getProfileById(id),
                providesTags: (result, error, id) => [{ type: 'Profile', id }],
        }),
        getProfileByUsername: builder.query({
            query: (username: string) =>
                getProfileByUsername(username),
        }),
        updateProfile: builder.mutation({
            query: ({ id, fields }: { id: string; fields: any }) =>
                updateProfile(id, fields),
            invalidatesTags: (result, error, { id }) => [{ type: 'Profile', id }],
        }),
        getFollowers: builder.query({
            query: (id: string) =>
                getFollowers(id),
        }),
        getFollowing: builder.query({
            query: (id: string) =>
                getFollowing(id),
        }),
        follow: builder.mutation({
            query: ({followerId, followingId}: {followerId: string, followingId: string}) => follow(followerId, followingId),
        }),
        unfollow: builder.mutation({
            query: ({followerId, followingId}: {followerId: string, followingId: string}) => unfollow(followerId, followingId),
        }),
        getUserSettings: builder.query({
            query: (profileId: string) =>
                getUserSettings(profileId),
        })
    }),
});

export const { useGetProfileByIdQuery, useGetProfileByUsernameQuery, useUpdateProfileMutation, useGetFollowersQuery, useGetFollowingQuery, useFollowMutation, useUnfollowMutation, useGetUserSettingsQuery } = profilesApi;
