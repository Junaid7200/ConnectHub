import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import FlatSearchBar from '@/src/components/(app)/(msgs)/flatSearch';
import NewMsgSearchCard from '@/src/components/(app)/(msgs)/newMsgSearchCard';
import SettingsHeader from '@/src/components/SettingsHeader';
import { MessageSearchCardProps } from '@/src/types/types';

const contacts: MessageSearchCardProps[] = [
  { displayName: 'AzizDjan', username: 'A_AzizDjan', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Kieron Dotson', username: 'kiero_d', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Figma', username: 'figmadesign', verified: true, avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Zack John', username: 'zackjohn', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Pixsellz', username: 'pixsellz', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Maximillian', username: 'maxjacobson', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'Tibitha Potter', username: 'mis_potter', avatar: require('@/assets/images/project_images/p1.png') },
  { displayName: 'karennne', username: 'karennne', avatar: require('@/assets/images/project_images/p1.png') },
];

export default function NewMessage() {
  const router = useRouter();
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
    }
  };
  return (
    <View style={styles.container}>
      <SettingsHeader title="New message" onBack={goBack} onDone={goBack} />
      <FlatSearchBar />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <NewMsgSearchCard
            displayName={item.displayName}
            username={item.username}
            avatar={item.avatar}
            verified={item.verified}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
