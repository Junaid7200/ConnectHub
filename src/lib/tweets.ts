import { supabase } from "@/src/lib/supabase";

export const getHomeTimeline = (limit = 20, offset = 0) => {
    supabase.from("tweets").select("*, tweet_likes(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)").order("created_at", { ascending: false}).range(offset, offset + limit - 1)
};

export const getTweetByAuthor = (authorId: string, limit=20, offset = 0) => {
    supabase.from("tweets").select("*, tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)").eq("author_id", authorId).order("created_at", {ascending: false}).range(offset, offset + limit -1)
};

export const getTweetDetail = (tweetId: string) => {
    supabase.from("tweets").select("*, tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)").eq("id", tweetId).single()
};

export const getReplies = (parentTweetId: string) => {
    supabase.from("tweets").select("*, tweet_media(*), tweet_likes(count), tweet_retweets(count), tweet_bookmarks(count)").eq("parent_tweet_id", parentTweetId).order("created_at", {ascending: true})
};

export const createTweet = (payload: {
    author_id: string;
    body: string;
    visibility: "public" | "follows";
    parent_tweet_id?: string | null;
}) => {
    supabase.from("tweets").insert(payload).select().single()
};

