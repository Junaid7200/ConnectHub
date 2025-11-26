import {
    bookmark,
    createTweet,
    getHomeTimeline,
    getReplies,
    getTweetDetail,
    getTweetsByAuthor,
    like,
    retweet,
    unbookmark,
    unlike,
    unretweet,
} from '@/src/lib/tweets';
import { createApi } from '@reduxjs/toolkit/query/react';
import { supabaseBaseQuery } from './baseQuerySupabase';

export const tweetsApi = createApi({
    reducerPath: 'tweetsApi',
    baseQuery: supabaseBaseQuery,
    tagTypes: ['Tweet', 'Timeline'],
    endpoints: (builder) => ({
        getHomeTimeline: builder.query<any[], { limit?: number; offset?: number }>({
            query: ({ limit = 20, offset = 0 } = {}) => getHomeTimeline(limit, offset),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Tweet' as const, id })),
                        { type: 'Timeline', id: 'HOME' },
                    ]
                    : [{ type: 'Timeline', id: 'HOME' }],
        }),
        getTweetsByAuthor: builder.query<any[], { authorId: string; limit?: number; offset?: number }>({
            query: ({ authorId, limit = 20, offset = 0 }) => getTweetsByAuthor(authorId, limit, offset),
            providesTags: (result, _err, { authorId }) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Tweet' as const, id })),
                        { type: 'Timeline', id: `AUTHOR-${authorId}` },
                    ]
                    : [{ type: 'Timeline', id: `AUTHOR-${authorId}` }],
        }),
        getTweetDetail: builder.query<any, string>({
            query: (tweetId) => getTweetDetail(tweetId),
            providesTags: (_result, _err, tweetId) => [{ type: 'Tweet', id: tweetId }],
        }),
        getReplies: builder.query<any[], string>({
            query: (tweetId) => getReplies(tweetId),
            providesTags: (result, _err, tweetId) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Tweet' as const, id })),
                        { type: 'Timeline', id: `REPLIES-${tweetId}` },
                    ]
                    : [{ type: 'Timeline', id: `REPLIES-${tweetId}` }],
        }),
        createTweet: builder.mutation<
            any,
            { author_id: string; body: string; visibility?: 'public' | 'followers'; parent_tweet_id?: string | null }
        >({
            query: (payload) => createTweet(payload),
            invalidatesTags: (_r, _e, { parent_tweet_id }) => {
                const tags = [{ type: 'Timeline' as const, id: 'HOME' }];
                if (parent_tweet_id) tags.push({ type: 'Timeline' as const, id: `REPLIES-${parent_tweet_id}` });
                return tags;
            },
        }),
        likeTweet: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => like(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
        unlikeTweet: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => unlike(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
        retweet: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => retweet(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
        unretweet: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => unretweet(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
        bookmark: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => bookmark(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
        unbookmark: builder.mutation<any, { tweetId: string; userId: string }>({
            query: ({ tweetId, userId }) => unbookmark(tweetId, userId),
            invalidatesTags: (_r, _e, { tweetId }) => [{ type: 'Tweet', id: tweetId }],
        }),
    }),
});

export const {
    useGetHomeTimelineQuery,
    useGetTweetsByAuthorQuery,
    useGetTweetDetailQuery,
    useGetRepliesQuery,
    useCreateTweetMutation,
    useLikeTweetMutation,
    useUnlikeTweetMutation,
    useRetweetMutation,
    useUnretweetMutation,
    useBookmarkMutation,
    useUnbookmarkMutation,
} = tweetsApi;
