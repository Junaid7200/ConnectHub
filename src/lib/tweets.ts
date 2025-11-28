import { supabase } from '@/src/lib/supabase';

// export const getHomeTimeline = (limit = 20, offset = 0) => {
//     return supabase
//         .from('tweets')
//         .select('*, tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)')
//         .order('created_at', { ascending: false })
//         .range(offset, offset + limit - 1);
// };

export const getHomeTimeline = async (viewerId: string, limit = 20, offset = 0) => {
    const { data: following, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', viewerId);

    if (followsError) {
        return { data: null, error: followsError };
    }

    const authorIds = Array.from(
        new Set([viewerId, ...(following?.map((row) => row.following_id).filter(Boolean) ?? [])])
    );

    return supabase
        .from('tweets')
        .select(
            'id, author_id, body, created_at, visibility, parent_tweet_id, profiles!tweets_author_id_fkey(id, username, display_name, avatar_url, is_verified), tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)'
        )
        .is('parent_tweet_id', null) // only root tweets
        .in('author_id', authorIds)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
};

// Count replies for a set of tweet IDs (grouped)
export const getRepliesCount = (tweetIds: string[]) => {
    return supabase
        .from('tweets')
        .select('parent_tweet_id, count:id', { count: 'exact', head: false })
        .in('parent_tweet_id', tweetIds);
};

// Get tweets liked by this user (returns tweet_ids the user liked)
export const getUserLikesForTweets = (tweetIds: string[], userId: string) => {
    return supabase
        .from('tweet_likes')
        .select('tweet_id')
        .eq('user_id', userId)
        .in('tweet_id', tweetIds);
};

// Get tweets retweeted by this user
export const getUserRetweetsForTweets = (tweetIds: string[], userId: string) => {
    return supabase
        .from('tweet_retweets')
        .select('tweet_id')
        .eq('user_id', userId)
        .in('tweet_id', tweetIds);
};

// Get tweets bookmarked by this user
export const getUserBookmarksForTweets = (tweetIds: string[], userId: string) => {
    return supabase
        .from('tweet_bookmarks')
        .select('tweet_id')
        .eq('user_id', userId)
        .in('tweet_id', tweetIds);
};








export const getTweetsByAuthor = (authorId: string, limit = 20, offset = 0) => {
    return supabase
        .from('tweets')
        .select(
            'id, author_id, body, created_at, visibility, parent_tweet_id, profiles!tweets_author_id_fkey(id, username, display_name, avatar_url, is_verified), tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)'
        )
        .eq('author_id', authorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
};

export const getTweetDetail = (tweetId: string) => {
    return supabase
        .from('tweets')
        .select(
            'id, author_id, body, created_at, visibility, parent_tweet_id, profiles!tweets_author_id_fkey(id, username, display_name, avatar_url, is_verified), tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)'
        )
        .eq('id', tweetId)
        .single();
};

export const getReplies = (parentTweetId: string) => {
    return supabase
        .from('tweets')
        .select(
            'id, author_id, body, created_at, visibility, parent_tweet_id, profiles!tweets_author_id_fkey(id, username, display_name, avatar_url, is_verified), tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)'
        )
        .eq('parent_tweet_id', parentTweetId)
        .order('created_at', { ascending: true });
};

export const createTweet = (payload: {
    author_id: string;
    body: string;
    visibility?: 'public' | 'followers';
    parent_tweet_id?: string | null;
}) => {
    return supabase.from('tweets').insert(payload).select().single();
};

export const like = (tweetId: string, userId: string) =>
    supabase.from('tweet_likes').insert({ tweet_id: tweetId, user_id: userId });

export const unlike = (tweetId: string, userId: string) =>
    supabase.from('tweet_likes').delete().eq('tweet_id', tweetId).eq('user_id', userId);

export const retweet = (tweetId: string, userId: string) =>
    supabase.from('tweet_retweets').insert({ tweet_id: tweetId, user_id: userId });

export const unretweet = (tweetId: string, userId: string) =>
    supabase.from('tweet_retweets').delete().eq('tweet_id', tweetId).eq('user_id', userId);

export const bookmark = (tweetId: string, userId: string) =>
    supabase.from('tweet_bookmarks').insert({ tweet_id: tweetId, user_id: userId });

export const unbookmark = (tweetId: string, userId: string) =>
    supabase.from('tweet_bookmarks').delete().eq('tweet_id', tweetId).eq('user_id', userId);
