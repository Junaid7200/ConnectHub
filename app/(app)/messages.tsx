import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Fab from '@/src/components/Fab';

export default function Messages() {
  return (
    <View style={styles.container}>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Messages Screen</Text>
      </View>
      <Fab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#657786',
  },
});
