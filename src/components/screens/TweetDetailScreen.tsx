import TweetCard from '@/src/components/features/Cards/TweetCard';
import { useAppSelector } from '@/src/hooks/useRedux';
import { supabase } from '@/src/lib/supabase';
import {
  useBookmarkMutation,
  useGetRepliesQuery,
  useGetTweetDetailQuery,
  useGetUserBookmarksForTweetsQuery,
  useGetUserLikesForTweetsQuery,
  useGetUserRetweetsForTweetsQuery,
  useLikeTweetMutation,
  useRetweetMutation,
  useUnbookmarkMutation,
  useUnlikeTweetMutation,
  useUnretweetMutation,
} from '@/src/store/services/tweetsApi';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

const publicUrlFor = (path?: string | null) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data?.publicUrl ?? undefined;
};

export default function TweetDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const tweetId = typeof params.id === 'string' ? params.id : undefined;

  const session = useAppSelector((state) => state.auth.session);
  const viewerId = session?.id ?? '';

  const {
    data: tweet,
    isLoading: isTweetLoading,
    refetch: refetchTweet,
  } = useGetTweetDetailQuery(tweetId!, { skip: !tweetId });
  const {
    data: replies = [],
    isLoading: isRepliesLoading,
    refetch: refetchReplies,
  } = useGetRepliesQuery(tweetId!, { skip: !tweetId });

  const tweetIds = useMemo(() => {
    const ids: string[] = [];
    if (tweet?.id) ids.push(tweet.id);
    replies?.forEach((item: any) => {
      if (item?.id) ids.push(item.id);
    });
    return ids;
  }, [tweet?.id, replies]);

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

  const [likeTweet] = useLikeTweetMutation();
  const [unlikeTweet] = useUnlikeTweetMutation();
  const [retweet] = useRetweetMutation();
  const [unretweet] = useUnretweetMutation();
  const [bookmark] = useBookmarkMutation();
  const [unbookmark] = useUnbookmarkMutation();

  const repliesCountMap = useMemo(() => {
    const map = new Map<string, number>();
    replies?.forEach((reply: any) => {
      const parentId = reply?.parent_tweet_id;
      if (!parentId) return;
      map.set(parentId, (map.get(parentId) ?? 0) + 1);
    });
    return map;
  }, [replies]);

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

  const refreshAll = useCallback(() => {
    refetchTweet();
    refetchReplies();
    refetchLikes?.();
    refetchRetweets?.();
    refetchBookmarks?.();
  }, [refetchBookmarks, refetchLikes, refetchReplies, refetchRetweets, refetchTweet]);

  const handleLikeToggle = useCallback(
    async (targetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await likeTweet({ tweetId: targetId, userId: viewerId }).unwrap();
        } else {
          await unlikeTweet({ tweetId: targetId, userId: viewerId }).unwrap();
        }
        refreshAll();
      } catch (error) {
        console.warn('Failed to toggle like', error);
      }
    },
    [likeTweet, refreshAll, unlikeTweet, viewerId]
  );

  const handleRetweetToggle = useCallback(
    async (targetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await retweet({ tweetId: targetId, userId: viewerId }).unwrap();
        } else {
          await unretweet({ tweetId: targetId, userId: viewerId }).unwrap();
        }
        refreshAll();
      } catch (error) {
        console.warn('Failed to toggle retweet', error);
      }
    },
    [refreshAll, retweet, unretweet, viewerId]
  );

  const handleBookmarkToggle = useCallback(
    async (targetId: string, next: boolean) => {
      if (!viewerId) return;
      try {
        if (next) {
          await bookmark({ tweetId: targetId, userId: viewerId }).unwrap();
        } else {
          await unbookmark({ tweetId: targetId, userId: viewerId }).unwrap();
        }
        refreshAll();
      } catch (error) {
        console.warn('Failed to toggle bookmark', error);
      }
    },
    [bookmark, refreshAll, unbookmark, viewerId]
  );

  const mapTweet = useCallback(
    (item: any) => {
      const profile = item?.profiles;
      const avatarUrl = publicUrlFor(profile?.avatar_url);
      const media = (item?.tweet_media ?? [])
        .map((m: any) => {
          const uri = publicUrlFor(m.storage_path);
          if (!uri) return null;
          const poster = m.thumbnail_url ? publicUrlFor(m.thumbnail_url) : undefined;
          return {
            type: m.media_type === 'video' ? 'video' : 'image',
            source: { uri },
            poster: poster ? { uri: poster } : undefined,
          };
        })
        .filter(Boolean);

      return {
        id: item.id,
        displayName: profile?.display_name ?? 'Unknown',
        username: profile?.username ?? 'unknown',
        avatarUrl,
        verified: profile?.is_verified ?? false,
        time: new Date(item.created_at).toLocaleString(),
        text: item.body,
        media,
        counts: {
          replies: repliesCountMap.get(item.id) ?? 0,
          retweets: item.tweet_retweets?.[0]?.count ?? 0,
          likes: item.tweet_likes?.[0]?.count ?? 0,
          shares: item.tweet_bookmarks?.[0]?.count ?? 0,
        },
        isOwnTweet: item.author_id === viewerId,
        initialLiked: likedSet.has(item.id),
        initialRetweeted: retweetedSet.has(item.id),
        initialBookmarked: bookmarkedSet.has(item.id),
      } as const;
    },
    [bookmarkedSet, likedSet, repliesCountMap, retweetedSet, viewerId]
  );

  const renderTweet = useCallback(
    (item: any) => {
      const mapped = mapTweet(item);
      return (
        <TweetCard
          {...mapped}
          showThread={false}
          onLikeToggle={(next) => handleLikeToggle(mapped.id ?? '', next)}
          onRetweetToggle={(next) => handleRetweetToggle(mapped.id ?? '', next)}
          onBookmarkToggle={(next) => handleBookmarkToggle(mapped.id ?? '', next)}
        />
      );
    },
    [handleBookmarkToggle, handleLikeToggle, handleRetweetToggle, mapTweet]
  );

  if (!tweetId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 22 }} />
          <Text style={styles.headerTitle}>Tweet</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tweet id provided.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tweet</Text>
      </View>
      {isTweetLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id as string}
          renderItem={({ item }) => (
            <View style={styles.replyCard}>{renderTweet(item)}</View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isTweetLoading || isRepliesLoading}
              onRefresh={refreshAll}
            />
          }
          ListHeaderComponent={
            tweet ? (
              <View>
                {renderTweet(tweet)}
                <View style={styles.divider} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            isRepliesLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No replies yet.</Text>
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#0F1419' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E1E8ED',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  replyCard: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  loading: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#657786',
  },
});
