import Fab from '@/src/components/Fab';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { TrendItem } from '@/src/types/types';

const emptyState = {
  title: 'No new trends for you',
  subtitle:
    "It seems like there's not a lot to show you right now, but you can see trends for other areas",
  cta: 'Change location',
};

const mockTrends: TrendItem[] = [
  { id: 't1', title: 'React Native 0.81', tweets: '12.3K Tweets', category: 'Technology · Trending' },
  { id: 't2', title: '#UIUX', tweets: '28.1K Tweets', category: 'Design · Trending' },
  { id: 't3', title: 'Expo 50', tweets: '9,417 Tweets', category: 'Tech · Trending' },
  { id: 't4', title: 'SwiftUI', tweets: '15.4K Tweets', category: 'iOS · Trending' },
  { id: 't5', title: 'Figma', tweets: '21.6K Tweets', category: 'Design · Trending' },
];

export default function Search() {
  const router = useRouter();
  const trends = mockTrends; // swap to [] to see the empty state

  const renderTrend: ListRenderItem<TrendItem> = ({ item }) => (
    <View style={styles.trendRow}>
      <Text style={styles.trendCategory}>{item.category}</Text>
      <Text style={styles.trendTitle}>{item.title}</Text>
      <Text style={styles.trendTweets}>{item.tweets}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <FlatList
        data={trends}
        ListHeaderComponent={
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Trends for you</Text>
            </View>
            <View style={styles.sectionHeaderDivider} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{emptyState.title}</Text>
            <Text style={styles.emptySubtitle}>{emptyState.subtitle}</Text>
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>{emptyState.cta}</Text>
            </View>
          </View>
        }
        renderItem={renderTrend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={{ height: 0 }} />}
      />
      <Fab onPress={() => router.push('/(New)/NewTweet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
  },
  sectionHeaderText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#141619',
  },
  sectionHeaderDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E1E8ED',
    alignSelf: 'stretch',
  },
  emptyCard: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#657786',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: '#4C9EEB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  trendRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  trendCategory: {
    fontSize: 13,
    color: '#657786',
    marginBottom: 4,
  },
  trendTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F1419',
  },
  trendTweets: {
    fontSize: 14,
    color: '#657786',
    marginTop: 2,
  },
});
