import TweetCard from "@/src/components/features/Cards/TweetCard";
import Fab from "@/src/components/primitives/Fab";
import { useAppSelector } from "@/src/hooks/useRedux";
import { supabase } from "@/src/lib/supabase";
import {
  useGetHomeTimelineQuery,
  useGetRepliesCountQuery,
  useGetUserBookmarksForTweetsQuery,
  useGetUserLikesForTweetsQuery,
  useGetUserRetweetsForTweetsQuery,
} from "@/src/store/services/tweetsApi";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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
  const { data: likedData = [] } = useGetUserLikesForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );
  const { data: retweetedData = [] } = useGetUserRetweetsForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );
  const { data: bookmarkedData = [] } = useGetUserBookmarksForTweetsQuery(
    { tweetIds, userId: viewerId },
    { skip: !viewerId || tweetIds.length === 0 }
  );

  const repliesMap = useMemo(
    () =>
      new Map<string, number>(
        repliesData.map((row: any) => [row.parent_tweet_id, row.count])
      ),
    [repliesData]
  );
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
        avatarUrl={avatarUrl}
        time={new Date(item.created_at).toLocaleDateString()}
        text={item.body}
        media={media} // Passing actual media data here
        counts={counts}
        initialLiked={liked}
        isOwnTweet={item.author_id === viewerId}
        showThread={false}
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
        contentContainerStyle={{ paddingBottom: 0 }}
      />
      <Fab onPress={() => router.push("/(New)/NewTweet")} />
    </View>
  );
}
