import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NewTweetHeaderProps } from '@/src/types/types';

export default function NewTweetHeader({
  onCancel,
  onTweet,
  tweetDisabled,
  title = 'Tweet',
}: NewTweetHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable hitSlop={8} onPress={onCancel}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        hitSlop={8}
        onPress={onTweet}
        disabled={tweetDisabled}
        style={[styles.tweetButton, tweetDisabled && styles.tweetButtonDisabled]}
      >
        <Text style={[styles.tweetText, tweetDisabled && styles.tweetTextDisabled]}>Tweet</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  cancel: {
    color: '#4C9EEB',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
  },
  tweetButton: {
    backgroundColor: '#7EC7F8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tweetButtonDisabled: {
    opacity: 0.6,
  },
  tweetText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  tweetTextDisabled: {
    color: '#FFFFFF',
  },
});
