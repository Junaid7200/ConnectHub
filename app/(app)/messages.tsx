import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import MsgCard from '@/src/components/(app)/(msgs)/msgCard';
import MessagesSearchBar from '@/src/components/(app)/(msgs)/search';
import Fab from '@/src/components/Fab';
import { MessageCardProps } from '@/src/types/types';

const mockMessages: MessageCardProps[] = [
  {
    // avatar: require('@/assets/images/project_images/p1.png'),
    displayName: 'AzizDjan',
    username: 'A_AzizDjan',
    date: '12/2/19',
    preview: "You: You're very welcome AzizDjan!",
  },
  {
    // avatar: require('@/assets/images/project_images/p1.png'),
    displayName: 'Andrew Parker',
    username: 'andrewvv_',
    date: '12/1/19',
    preview: 'You accepted the request',
  },
  {
    // avatar: require('@/assets/images/project_images/p1.png'),
    displayName: 'Komol Kuchkarov',
    username: 'kkuchkarov',
    date: '12/1/19',
    preview: 'You accepted the request',
  },
  {
    // avatar: require('@/assets/images/project_images/p1.png'),
    displayName: 'karennne',
    username: 'karennne',
    date: '6/26/19',
    preview: 'You: I would greatly appreciate if you could retweet this if you think its worthy :)',
  },
  {
    // avatar: require('@/assets/images/project_images/p1.png'),
    displayName: 'Maximillian',
    username: 'maxjacobson',
    date: '5/22/19',
    preview: 'sent you a link: Hello Pixsellz,',
  },
];

export default function Messages() {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <MessagesSearchBar />
      </View>
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => `${item.username}-${item.date}`}
        renderItem={({ item }) => <MsgCard {...item} />}
        contentContainerStyle={styles.listContent}
      />
      <Fab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchWrapper: {
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  listContent: {
    paddingBottom: 80,
  },
});
