import Avatar from '@/src/components/(app)/(Nav)/avatar';
import TweetCard from '@/src/components/(app)/TweetCard';
import { TweetCardProps } from '@/src/types/types';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { BarChart3, ChevronLeft, Heart, MessageCircle, Repeat2, Upload } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

const mainTweet: TweetCardProps = {
  displayName: 'Pixsellz',
  username: 'pixsellz',
  time: '17:18 · 2/14/20',
  text: 'Must have icon collections',
  counts: { replies: 3, retweets: 2, likes: 24, shares: 1 },
  media: [require('@/assets/images/project_images/MediaToolBar/Media.png')],
  isOwnTweet: true,
};

export default function TweetMineScreen() {
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

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 200 }}>
        <TweetCard {...mainTweet} containerStyle={styles.tweetCard} hideEngagement />

        <View style={styles.sectionRow}>
          <Text style={styles.timeText}>17:18 · 2/14/20 · </Text>
          <Text style={styles.timeLink}>Twitter Web App</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <BarChart3 size={16} color="#657786" />
          <Text style={[styles.metaText, { marginLeft: 8 }]}>View Tweet activity</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.sectionRow}>
          <Text style={styles.likeText}>
            <Text style={styles.likeNumber}>1</Text> Like
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

        <View style={styles.emptyReplies} />
      </ScrollView>

      <View style={styles.replyBar}>
        <Avatar source={require('@/assets/images/project_images/p1.png')} name="You" size={34} />
        <Text style={styles.composerPlaceholder}>Add another Tweet</Text>
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
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    paddingTop: 40
  },
  header: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#0F1419' },
  body: { flex: 1 },
  tweetCard: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 8,
  },
  sectionRow: {
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
  metaText: {
    fontSize: 15,
    color: '#0F1419',
  },
  likeText: {
    fontSize: 15,
    color: '#0F1419',
  },
  likeNumber: {
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E1E8ED',
    marginHorizontal: 16,
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
    marginTop: 4,
    marginBottom: 8,
  },
  engagementPress: {
    padding: 4,
  },
  emptyReplies: {
    minHeight: 200,
    backgroundColor: '#E7ECF0',
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
