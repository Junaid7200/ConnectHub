import TweetCard from "@/src/components/features/Cards/TweetCard";
import { formatRelativeTime } from "@/src/lib/time";
import Fab from "@/src/components/primitives/Fab";
import { useAppSelector } from "@/src/hooks/useRedux";
import { supabase } from "@/src/lib/supabase";
import {
  useBookmarkMutation,
  useGetHomeTimelineQuery,
  useGetRepliesCountQuery,
  useGetUserBookmarksForTweetsQuery,
  useGetUserLikesForTweetsQuery,
  useGetUserRetweetsForTweetsQuery,
  useLikeTweetMutation,
  useRetweetMutation,
  useUnbookmarkMutation,
  useUnlikeTweetMutation,
  useUnretweetMutation,
} from "@/src/store/services/tweetsApi";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

const PAGE_SIZE = 20;


const publicUrlFor = (path?: string | null) => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data?.publicUrl ?? undefined;
};



export default function HomeScreen() {
  const router = useRouter();
  const [likeTweet] = useLikeTweetMutation();
  const [unlikeTweet] = useUnlikeTweetMutation();
  const [retweet] = useRetweetMutation();
  const [unretweet] = useUnretweetMutation();
  const [bookmark] = useBookmarkMutation();
  const [unbookmark] = useUnbookmarkMutation();

  // 1) who is logged in?
  const authUser = useAppSelector((state) => state.auth.session);
  const viewerId = authUser?.id ?? "";

  // 2) fetch home timeline for that user
  const {
    data: timeline = [],
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetHomeTimelineQuery(
    { viewerId, limit: PAGE_SIZE, offset: 0 },
    { skip: !viewerId }
  );
  // console.log(`the errors: ${JSON.stringify(error)}`);
  // console.log(`the timeline: ${JSON.stringify(timeline)}`);

  // 2b) collect tweet IDs and fetch per-viewer interactions + replies count
  const tweetIds = useMemo(
    () => timeline.map((t: any) => t.id).filter(Boolean),
    [timeline]
  );

  const { data: repliesData = [] } = useGetRepliesCountQuery(tweetIds, {
    skip: tweetIds.length === 0,
  });
  const { data: likedData = [], refetch: refetchLikes } = useGetUserLikesForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );
  const { data: retweetedData = [], refetch: refetchRetweets } = useGetUserRetweetsForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );
  const { data: bookmarkedData = [], refetch: refetchBookmarks } = useGetUserBookmarksForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );

  const repliesMap = useMemo(() => {
    const counts = new Map<string, number>();
    repliesData.forEach((row: any) => {
      const parent = row?.parent_tweet_id;
      if (!parent) return;
      counts.set(parent, (counts.get(parent) ?? 0) + 1);
    });
    return counts;
  }, [repliesData]);
  const likedSet = useMemo(
    () => new Set<string>(likedData.map((row: any) => row.tweet_id)),
    [likedData]
  );
  const retweetedSet = useMemo(
    () => new Set<string>(retweetedData.map((row: any) => row.tweet_id)),
    [retweetedData]
  );
  const bookmarkedSet = useMemo(
    () => new Set<string>(bookmarkedData.map((row: any) => row.tweet_id)),
    [bookmarkedData]
  );

  const handleLikeToggle = useCallback(
    async (tweetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await likeTweet({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] liked", tweetId);
        } else {
          await unlikeTweet({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] unliked", tweetId);
        }
        refetchLikes?.();
      } catch (err) {
        console.warn("Failed to toggle like", err);
      }
    },
    [likeTweet, unlikeTweet, viewerId, refetchLikes]
  );

  const handleRetweetToggle = useCallback(
    async (tweetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await retweet({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] retweeted", tweetId);
        } else {
          await unretweet({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] unretweeted", tweetId);
        }
        refetchRetweets?.();
      } catch (err) {
        console.warn("Failed to toggle retweet", err);
      }
    },
    [retweet, unretweet, viewerId, refetchRetweets]
  );

  const handleBookmarkToggle = useCallback(
    async (tweetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await bookmark({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] bookmarked", tweetId);
        } else {
          await unbookmark({ tweetId, userId: viewerId }).unwrap();
          console.log("[tweets] unbookmarked", tweetId);
        }
        refetchBookmarks?.();
      } catch (err) {
        console.warn("Failed to toggle bookmark", err);
      }
    },
    [bookmark, unbookmark, viewerId, refetchBookmarks]
  );

  // 3) pull-to-refresh handler
  const onRefresh = () => refetch();

  // 4) one row → TweetCard
  const renderItem = ({ item }: { item: any }) => {
    const profile = item.profiles;

    // Resolve avatar and media public URLs
    const avatarUrl = publicUrlFor(profile?.avatar_url);
    const media = (item.tweet_media ?? [])
      .map((m: any) => {
        const uri = publicUrlFor(m.storage_path);
        if (!uri) return null;
        const poster = m.thumbnail_url ? publicUrlFor(m.thumbnail_url) : undefined;
        return {
          type: m.media_type === "video" ? "video" : "image",
          source: { uri },
          poster: poster ? { uri: poster } : undefined,
        };
      })
      .filter(Boolean);

    const counts = {
      replies: repliesMap.get(item.id) ?? 0, // replies count
      retweets: item.tweet_retweets?.[0]?.count ?? 0,
      likes: item.tweet_likes?.[0]?.count ?? 0,
      shares: item.tweet_bookmarks?.[0]?.count ?? 0,
    };

    const liked = likedSet.has(item.id);
    const retweeted = retweetedSet.has(item.id);
    const bookmarked = bookmarkedSet.has(item.id);

    return (
      <TweetCard
        id={item.id}
        displayName={profile?.display_name ?? "Unknown"}
        username={profile?.username ?? "unknown"}
        verified={profile?.is_verified ?? false}
        avatarUrl={avatarUrl}
        time={formatRelativeTime(item.created_at)}
        text={item.body}
        media={media} // Passing actual media data here
        counts={counts}
        initialLiked={liked}
        initialRetweeted={retweeted}
        initialBookmarked={bookmarked}
        isOwnTweet={item.author_id === viewerId}
        showThread={false}
        onPressComment={() =>
          router.push({ pathname: "/(app)/tweet-detail", params: { id: item.id } })
        }
        onLikeToggle={(next) => handleLikeToggle(item.id, next)}
        onRetweetToggle={(next) => handleRetweetToggle(item.id, next)}
        onBookmarkToggle={(next) => handleBookmarkToggle(item.id, next)}
        onQuoteRetweet={() =>
          router.push({
            pathname: "/(New)/NewTweet",
            params: { quoteId: item.id },
          })
        }
        onPressThread={() =>
          router.push({
            pathname: "/(app)/tweet-detail",
            params: { id: item.id },
          })
        }
      />
    );
  };

  // 5) empty / loading / error state
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 24, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#657786" }}>
          {error ? "Failed to load timeline. Pull to retry." : "No tweets yet."}
        </Text>
      </View>
    );
  };

  // 6) main render
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <FlatList
        style={{ flex: 1 }}
        data={timeline}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#4C9EEB"
          />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <Fab onPress={() => router.push("/(New)/NewTweet")} />
    </View>
  );
}
