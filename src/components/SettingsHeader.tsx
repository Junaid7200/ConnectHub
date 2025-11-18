import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { SettingsHeaderProps } from '@/src/types/types';

export default function SettingsHeader({ title, onBack, onDone }: SettingsHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable hitSlop={8} onPress={onBack} style={styles.side}>
        <ChevronLeft size={22} color="#4C9EEB" />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable hitSlop={8} onPress={onDone} style={styles.side}>
        <Text style={styles.done}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  side: {
    minWidth: 44,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    textAlign: 'center',
  },
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4C9EEB',
  },
});
