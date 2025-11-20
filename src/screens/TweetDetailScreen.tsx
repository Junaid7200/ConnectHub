import Avatar from '@/src/components/(app)/(Nav)/avatar';
import TweetCard from '@/src/components/(app)/TweetCard';
import { TweetCardProps } from '@/src/types/types';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { ChevronLeft, Heart, MessageCircle, Repeat2, Upload } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const mainTweet: TweetCardProps = {
  displayName: 'karennne',
  username: 'karenne',
  time: '09:28 · 2/21/20',
  text: '~~ hiring for a UX Lead in Sydney - who should I talk to?',
  counts: { replies: 4, retweets: 6, likes: 15, shares: 1 },
  isOwnTweet: false,
};

const replies: TweetCardProps[] = [
  {
    displayName: 'kiero_d',
    username: 'kiero_d',
    time: '2d',
    text: 'Replying to @karenne\nInteresting Nicola that not one reply or tag on this #UX talent shout out in the 24hrs since your tweet here......🤔',
    counts: { replies: 1, retweets: 1, likes: 1, shares: 0 },
  },
  {
    displayName: 'karenne',
    username: 'karenne',
    time: '2d',
    text: 'Maybe I forgot the hashtags. #hiringux #designjobs #sydneyux #sydneydesigners #uxjobs',
    counts: { replies: 1, retweets: 0, likes: 1, shares: 0 },
  },
];

export default function TweetDetailScreen() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [showRetweetSheet, setShowRetweetSheet] = useState(false);
  const retweetCommentUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/retweetWithComment.svg')).uri,
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/home'))}>
          <ChevronLeft size={22} color="#4C9EEB" />
        </Pressable>
        <Text style={styles.headerTitle}>Tweet</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={replies}
        keyExtractor={(_, idx) => `reply-${idx}`}
        ListHeaderComponent={
          <View>
            <TweetCard {...mainTweet} containerStyle={styles.tweetCard} hideEngagement />
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>09:28 · 2/21/20 · </Text>
              <Text style={styles.timeLink}>Twitter Web App</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.countsRow}>
              <Text style={styles.countText}>
                <Text style={styles.countNumber}>{mainTweet.counts.retweets}</Text> Retweets
              </Text>
              <Text style={[styles.countText, { marginLeft: 12 }]}>
                <Text style={styles.countNumber}>{mainTweet.counts.likes}</Text> Likes
              </Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.engagementRow}>
              <MessageCircle size={20} color="#657786" />
              <Pressable hitSlop={8} onPress={() => setShowRetweetSheet(true)}>
                <Repeat2 size={20} color="#657786" />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={() => setLiked((prev) => !prev)}
                style={styles.engagementPress}
              >
                <Heart size={20} color={liked ? '#CE395F' : '#657786'} fill={liked ? '#CE395F' : 'none'} />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={async () => {
                  try {
                    await Share.share({ message: mainTweet.text });
                  } catch {
                    /* noop */
                  }
                }}
              >
                <Upload size={20} color="#657786" />
              </Pressable>
            </View>
            <View style={styles.divider} />
          </View>
        }
        renderItem={({ item }) => (
          <TweetCard {...item} containerStyle={styles.replyCard} onPressThread={undefined} showThread={false} />
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
      />
      <View style={styles.replyBar}>
        <Avatar source={require('@/assets/images/project_images/p1.png')} name="You" size={34} />
        <Text style={styles.composerPlaceholder}>Tweet your reply</Text>
      </View>
      <Modal transparent visible={showRetweetSheet} animationType="fade" onRequestClose={() => setShowRetweetSheet(false)}>
        <View style={styles.sheetOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowRetweetSheet(false)} />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Pressable style={styles.sheetRow} onPress={() => setShowRetweetSheet(false)} android_ripple={{ color: '#E7ECF0' }}>
              <Repeat2 size={22} color="#657786" />
              <Text style={styles.sheetRowText}>Retweet</Text>
            </Pressable>
            <Pressable style={styles.sheetRow} onPress={() => setShowRetweetSheet(false)} android_ripple={{ color: '#E7ECF0' }}>
              <SvgUri uri={retweetCommentUri} width={22} height={22} />
              <Text style={styles.sheetRowText}>Retweet with comment</Text>
            </Pressable>
            <Pressable style={styles.sheetCancel} onPress={() => setShowRetweetSheet(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#0F1419' },
  tweetCard: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#657786',
  },
  timeLink: {
    fontSize: 14,
    color: '#4C9EEB',
    fontWeight: '500',
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
  },
  countText: {
    fontSize: 14,
    color: '#657786',
  },
  countNumber: {
    color: '#0F1419',
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E1E8ED',
    marginHorizontal: 16,
  },
  replyCard: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  engagementRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
  },
  engagementPress: {
    padding: 4,
  },
  replyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E1E8ED',
    columnGap: 12,
  },
  composerPlaceholder: {
    flex: 1,
    color: '#657786',
    fontSize: 15,
    backgroundColor: '#F2F4F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CED5DC',
    marginBottom: 4,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  sheetRowText: {
    marginLeft: 14,
    fontSize: 17,
    color: '#0F1419',
  },
  sheetCancel: {
    marginTop: 4,
    marginHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#E7ECF0',
  },
  sheetCancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F1419',
  },
});
