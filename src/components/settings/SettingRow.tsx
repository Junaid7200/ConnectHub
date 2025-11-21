import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { SettingItem } from '@/src/types/types';

type SettingRowProps = SettingItem & {
  topBorder?: boolean;
};

export default function SettingRow({ title, onPress, topBorder }: SettingRowProps) {
  return (
    <Pressable onPress={onPress} style={[styles.row, topBorder && styles.topBorder]}>
      <Text style={styles.title}>{title}</Text>
      <ChevronRight size={16} color="#687684" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E1E8ED',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#141619',
    letterSpacing: -0.3,
  },
});
