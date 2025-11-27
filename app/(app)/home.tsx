import TweetCard from '@/src/components/features/Cards/TweetCard';
import Fab from '@/src/components/primitives/Fab';
import { useAppSelector } from '@/src/hooks/useRedux';
import { useGetHomeTimelineQuery } from '@/src/store/services/tweetsApi';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

const PAGE_SIZE = 20;

export default function HomeScreen() {
  const router = useRouter();

  // 1) who is logged in?
  const authUser = useAppSelector((state) => state.auth.session);
  const viewerId = authUser?.id ?? '';

  // 2) fetch home timeline for that user
  const { data: timeline = [], isLoading, isFetching, refetch, error } = useGetHomeTimelineQuery( { viewerId, limit: PAGE_SIZE, offset: 0 },
    { skip: !viewerId }
  );
  console.log(`the errors: ${JSON.stringify(error)}`);
  console.log(`the timeline: ${JSON.stringify(timeline)}`);

  // 3) pull-to-refresh handler
  const onRefresh = () => refetch();

  // 4) one row → TweetCard
  const renderItem = ({ item }: { item: any }) => {
    const profile = item.profiles;

    const counts = {
      replies: 0,
      retweets: item.tweet_retweets?.[0]?.count ?? 0,
      likes: item.tweet_likes?.[0]?.count ?? 0,
      shares: item.tweet_bookmarks?.[0]?.count ?? 0,
    };

    return (
      <TweetCard
        id={item.id}
        displayName={profile?.display_name ?? 'Unknown'}
        username={profile?.username ?? 'unknown'}
        avatarUrl={profile?.avatar_url ?? undefined}
        time={new Date(item.created_at).toLocaleDateString()}
        text={item.body}
        counts={counts}
        isOwnTweet={item.author_id === viewerId}
        showThread={false}
        onPressThread={() =>
          router.push({
            pathname: '/(app)/tweet-detail',
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
        <View style={{ padding: 24, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ color: '#657786' }}>
          {error ? 'Failed to load timeline. Pull to retry.' : 'No tweets yet.'}
        </Text>
      </View>
    );
  };

  // 6) main render
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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
      <Fab onPress={() => router.push('/(New)/NewTweet')} />
    </View>
  );
}
