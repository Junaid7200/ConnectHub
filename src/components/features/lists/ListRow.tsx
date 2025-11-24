import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Avatar from '@/src/components/primitives/Header/avatar';
import { ListItem } from '@/src/types/types';

export default function ListRow({ owner, name, description, members, subscribers, avatar }: ListItem) {
  const memberLabel = `${members} member${members === 1 ? '' : 's'}`;
  const subscriberLabel =
    subscribers !== undefined
      ? ` · ${subscribers} subscriber${subscribers === 1 ? '' : 's'}`
      : '';

  return (
    <View style={styles.card}>
      <View style={styles.textColumn}>
        <Text style={styles.owner}>{owner}</Text>
        <Text style={styles.name}>{name}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
        <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
          {memberLabel}
          {subscriberLabel}
        </Text>
      </View>
      <Avatar source={avatar} name={name} size={46} style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  owner: {
    fontSize: 13,
    color: '#657786',
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F1419',
  },
  description: {
    marginTop: 2,
    fontSize: 14,
    color: '#657786',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: '#657786',
  },
  avatar: {
    marginLeft: 12,
  },
});
