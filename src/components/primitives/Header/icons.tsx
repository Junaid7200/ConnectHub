import { Settings, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const twitterBlue = '#4C9EEB';
// const twitterBlueFaded = '#4C9EEB20'; // ~12% opacity

export const HomeHeaderRight = () => {
  return (
    <View style={styles.main}>
    <Pressable
    // hitSlop adds invisible padding around the pressable area so its easier to tap
      hitSlop={8}
      style={styles.iconButton}
      onPress={() => {
        // TODO: open home feed filter sheet
      }}
    >
      <Sparkles size={24} color={twitterBlue} />
    </Pressable>
    </View>
  );
};

export const SettingsHeaderRight = ({ onPress }: { onPress?: () => void }) => {
  return (
    <View style={styles.main}>
      <Pressable hitSlop={8} style={styles.iconButton} onPress={onPress}>
        <Settings size={24} color={twitterBlue} fill="none" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginRight: 8,
  },
  iconButton: {
    borderRadius: 999,
  },
});
