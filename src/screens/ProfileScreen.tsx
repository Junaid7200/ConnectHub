import Avatar from '@/src/components/(app)/(Nav)/avatar';
import TweetCard from '@/src/components/(app)/TweetCard';
import Fab from '@/src/components/Fab';
import { TweetCardProps } from '@/src/types/types';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';

const profileAvatar = require('@/assets/images/project_images/p1.png');

const tweets: (TweetCardProps & { pinned?: boolean })[] = [
  {
    id: 'pinned',
    pinned: true,
    displayName: 'Pixsellz',
    username: 'pixsellz',
    time: '7/31/19',
    text: 'Scheme Constructor - your ultimate prototyping kit for all UX web and mobile app design! constructor.pixsellz.io',
    counts: { replies: 2, retweets: 12, likes: 15, shares: 1 },
    media: [require('@/assets/images/project_images/MediaToolBar/Media.png')],
  },
  {
    id: 'reply1',
    displayName: 'Pixsellz',
    username: 'pixsellz',
    time: '12h',
    text: '#prototyping #wireframe #uiux #ux',
    counts: { replies: 1, retweets: 1, likes: 3, shares: 0 },
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'tweets' | 'replies' | 'media' | 'likes'>('tweets');
  const linkUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/Profile/Link.svg')).uri, []);
  const calendarUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/Profile/Calendar.svg')).uri,
    []
  );
  const pinUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/Profile/Pin.svg')).uri, []);
  const renderHeader = () => (
    <View>
      <View style={[styles.banner, { height: 100 + insets.top, paddingTop: insets.top + 8 }]}>
        <Pressable style={[styles.backCircle, { top: insets.top + 12 }]} onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/home'))}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.bannerTitle}>Digital Goodies Team</Text>
      </View>

      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <Avatar source={profileAvatar as any} size={86} />
          </View>
        </View>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name}>Pixsellz</Text>
        <Text style={styles.handle}>@pixsellz</Text>
        <Text style={styles.bio}>Digital Goodies Team - Web & Mobile UI/UX development; Graphics; Illustrations</Text>

        <View style={styles.metaRow}>
          <SvgUri uri={linkUri} width={16} height={16} />
          <Text style={styles.metaLink}> pixsellz.io</Text>
          <SvgUri uri={calendarUri} width={16} height={16} style={{ marginLeft: 12 }} />
          <Text style={styles.metaText}> Joined September 2018</Text>
        </View>

        <View style={styles.followRow}>
          <Text style={styles.followNumber}>217</Text>
          <Text style={styles.followLabel}> Following</Text>
          <Text style={[styles.followNumber, { marginLeft: 12 }]}>118</Text>
          <Text style={styles.followLabel}> Followers</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        {(['tweets', 'replies', 'media', 'likes'] as const).map((tab) => {
          const label =
            tab === 'tweets'
              ? 'Tweets'
              : tab === 'replies'
                ? 'Tweets & replies'
                : tab === 'media'
                  ? 'Media'
                  : 'Likes';
          return (
            <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]} numberOfLines={1}>
                {label}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const data = activeTab === 'tweets' ? tweets : [];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id as string}
        renderItem={({ item }) => (
          <View>
            {item.pinned && (
              <View style={styles.pinnedRow}>
                <SvgUri uri={pinUri} width={12} height={12} />
                <Text style={styles.pinnedLabel}>Pinned Tweet</Text>
              </View>
            )}
            <TweetCard {...item} hideEngagement={false} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content yet</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <Fab onPress={() => router.push('/(New)/NewTweet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    height: 140,
    backgroundColor: '#1B1B1B',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
    left: 16,
  },
  backChevron: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -32,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4C9EEB',
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: '#4C9EEB',
    fontWeight: '600',
    fontSize: 15,
  },
  infoBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1419',
  },
  handle: {
    fontSize: 15,
    color: '#657786',
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLink: {
    fontSize: 15,
    color: '#4C9EEB',
    marginLeft: 4,
  },
  metaText: {
    fontSize: 15,
    color: '#657786',
    marginLeft: 4,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    marginTop: 2,
  },
  followNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  followLabel: {
    fontSize: 15,
    color: '#657786',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#687684',
    letterSpacing: -0.3,
  },
  tabTextActive: {
    color: '#4C9EEB',
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: '#4C9EEB',
    borderRadius: 999,
    marginTop: 0,
  },
  pinnedLabel: {
    color: '#687684',
    fontSize: 14,
    fontWeight: '600',
  },
  pinnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    columnGap: 6,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#657786',
  },
});
