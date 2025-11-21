import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#E7ECF0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  text: {
    fontSize: 19,
    fontWeight: '800',
    color: '#687684',
    letterSpacing: -0.5,
  },
});
