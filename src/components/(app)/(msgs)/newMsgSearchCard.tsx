import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Avatar from '@/src/components/(app)/(Nav)/avatar';
import { MessageSearchCardProps } from '@/src/types/types';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';

export default function NewMsgSearchCard({
  avatar,
  displayName,
  username,
  verified,
  onPress,
}: MessageSearchCardProps & { onPress?: () => void }) {
  const verifiedUri = Asset.fromModule(require('@/assets/images/project_images/verified.svg')).uri;

  return (
    <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: '#CED5DC' }}>
      <Avatar source={avatar} name={displayName} size={36} style={styles.avatar} />
      <View style={styles.textColumn}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{displayName}</Text>
          {verified && <SvgUri uri={verifiedUri} width={14} height={14} style={styles.verified} />}
        </View>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
  },
  verified: {
    marginLeft: 4,
  },
  username: {
    fontSize: 15,
    color: '#657786',
  },
});
