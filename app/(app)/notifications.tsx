import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import NotiAll from '@/src/components/(app)/notiAll';
import TweetCard from '@/src/components/(app)/TweetCard';
import Fab from '@/src/components/Fab';
import { AllNotification, MentionNotification, NotificationTab } from '@/src/types/types';

const mockAll: AllNotification[] = [
  {
    id: '1',
    avatar: require('@/assets/images/project_images/p1.png'),
    title: 'In case you missed Saad Drusteer’s Tweet',
    body:
      '🔥 Are you using WordPress and migrating to the JAMstack? I wrote up a case study about how Smashing Magazine moved to JAMstack and saw great performance improvements and better security.',
    link: 'smashingdrusteer.com/2020/01/migrat...',
  },
  {
    id: '2',
    avatar: require('@/assets/images/project_images/p1.png'),
    title: 'In case you missed UX Upper’s Tweet',
    body:
      'Creating meaningful experiences: an Introduction to User Experience design >\nowww.ly/p0fx50y5CoO\n\n#ux #uxdesign #uxresearch #userresearch #research #productdesing #webdesign #userexperience #startup #digital #design #diseno #psychology #servicedesign #conversion',
  },
];

const mockMentions: MentionNotification[] = [
  {
    id: 'm1',
    displayName: 'Martha Craig',
    username: 'craig_love',
    time: '12h',
    verified: true,
    avatar: require('@/assets/images/project_images/p1.png'),
    text: 'Shout out to @you for the help on this release! 🚀',
    likedBy: [],
    counts: { replies: 4, retweets: 2, likes: 18, shares: 1 },
    showThread: false,
  },
];

export default function Notifications() {
  const router = useRouter();
  const pathname = useRouter();
  const [tab, setTab] = useState<NotificationTab>('all');
  const data = tab === 'all' ? mockAll : mockMentions;

  const renderItem = ({ item }: { item: AllNotification | MentionNotification }) => {
    if (tab === 'all') {
      const noti = item as AllNotification;
      return <NotiAll avatar={noti.avatar} title={noti.title} body={noti.body} link={noti.link} />;
    }
    const mention = item as MentionNotification;
    return (
      <TweetCard
        displayName={mention.displayName}
        username={mention.username}
        time={mention.time}
        verified={mention.verified}
        avatar={mention.avatar}
        text={mention.text}
        likedBy={mention.likedBy}
        counts={mention.counts}
        showThread={mention.showThread}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsRow}>
          <Pressable onPress={() => setTab('all')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>All</Text>
            {tab === 'all' && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable onPress={() => setTab('mentions')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'mentions' && styles.tabTextActive]}>Mentions</Text>
            {tab === 'mentions' && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {tab === 'mentions' ? 'No mentions yet' : 'Nothing here yet'}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        <Fab onPress={() => router.push('/(New)/NewTweet')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#657786',
  },
  tabTextActive: {
    color: '#4C9EEB',
  },
  tabIndicator: {
    marginTop: 6,
    height: 2,
    width: '100%',
    backgroundColor: '#4C9EEB',
    borderRadius: 999,
  },
  listContent: {
    paddingBottom: 16,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#657786',
  },
});
