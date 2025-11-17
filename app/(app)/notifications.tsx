import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import Fab from '@/src/components/Fab';
import NotiAll from '@/src/components/(app)/notiAll';
import TweetCard from '@/src/components/(app)/TweetCard';

const mockAll = [
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

const mockMentions = [
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
  const [tab, setTab] = useState<'all' | 'mentions'>('all');
  const data = tab === 'all' ? mockAll : mockMentions;

  return (
    <View style={styles.container}>
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

      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            tab === 'all' ? (
              <NotiAll avatar={item.avatar} title={item.title} body={item.body} link={item.link} />
            ) : (
              <TweetCard
                displayName={item.displayName}
                username={item.username}
                time={item.time}
                verified={item.verified}
                avatar={item.avatar}
                text={item.text}
                likedBy={item.likedBy}
                counts={item.counts}
                showThread={item.showThread}
              />
            )
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {tab === 'mentions' ? 'No mentions yet' : 'Nothing here yet'}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        <Fab />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
    paddingTop: 8,
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
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
    width: 28,
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
