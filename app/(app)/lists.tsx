import { useFocusEffect } from '@react-navigation/native';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';

import ListRow from '@/src/components/features/lists/ListRow';
import Fab from '@/src/components/primitives/Fab';
import { ListItem, ListTab } from '@/src/types/types';

const subscribedLists: ListItem[] = [];

const memberLists: ListItem[] = [
  {
    id: '1',
    owner: 'Joshua Lawrence',
    name: 'D-teams',
    description: 'systems',
    members: 277,
    avatar: require('@/assets/images/project_images/p1.png'),
  },
  {
    id: '2',
    owner: 'Pixsellz Team',
    name: 'start-up',
    members: 77,
  },
  {
    id: '3',
    owner: 'Pixsellz Team',
    name: 'gadgets',
    members: 88,
    subscribers: 5,
  },
  {
    id: '4',
    owner: 'Pixsellz Team',
    name: 'designer',
    members: 68,
  },
  {
    id: '5',
    owner: 'Ustrations',
    name: 'Illustrators',
    members: 3959,
    subscribers: 11,
    avatar: require('@/assets/images/project_images/p1.png'),
  },
];

export default function Lists() {
  const [tab, setTab] = useState<ListTab>('subscribed');
  const listRef = useRef<FlatList>(null);
  const lists = useMemo(() => (tab === 'subscribed' ? subscribedLists : memberLists), [tab]);

  const renderItem: ListRenderItem<ListItem> = ({ item }) => <ListRow {...item} />;

  useFocusEffect(
    React.useCallback(() => {
      setTab('subscribed');
      listRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }, [])
  );

  const EmptyState = () => (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>You haven't created or subscribed to any Lists</Text>
      <Text style={styles.emptySubtitle}>When you do, it'll show up here.</Text>
      <Pressable style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Create a List</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsRow}>
          <Pressable onPress={() => setTab('subscribed')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'subscribed' && styles.tabTextActive]}>
              Subscribed to
            </Text>
            {tab === 'subscribed' && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable onPress={() => setTab('member')} style={styles.tab}>
            <Text style={[styles.tabText, tab === 'member' && styles.tabTextActive]}>Member of</Text>
            {tab === 'member' && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={[styles.listContent, lists.length === 0 && styles.listContentEmpty]}
        ListEmptyComponent={tab === 'subscribed' ? EmptyState : undefined}
        ListFooterComponent={<View style={{ height: 120 }} />}
        keyboardShouldPersistTaps="handled"
      />

      <Fab iconSource={require('@/assets/images/project_images/List-FAB.svg')} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECF0',
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingBottom: 0,
    justifyContent: 'flex-end',
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
    paddingTop: 12,
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
    paddingBottom: 80,
  },
  list: {
    flex: 1,
    backgroundColor: '#E7ECF0',
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#E7ECF0',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#657786',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#4C9EEB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
