import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import SettingsHeader from '@/src/components/SettingsHeader';

const settingsData = [
  {
    key: 'safeSearch',
    title: 'Safe search',
    body: 'Hide sensitive content in search results.',
    defaultOn: true,
  },
  {
    key: 'blockMuted',
    title: 'Remove blocked and muted',
    body: 'Hide content from accounts you have blocked or muted.',
    defaultOn: true,
  },
  {
    key: 'personalize',
    title: 'Personalize search results',
    body: 'Improve search results based on places you’ve been to and your activity.',
    defaultOn: false,
  },
];

export default function SearchSettings() {
  const router = useRouter();
  const [toggles, setToggles] = useState(
    settingsData.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.key] = item.defaultOn;
      return acc;
    }, {})
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsHeader title="Search settings" onBack={() => router.back()} onDone={() => router.back()} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionText}>Search</Text>
      </View>
      {settingsData.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
            <Switch
              value={toggles[item.key]}
              onValueChange={(value) => setToggles((prev) => ({ ...prev, [item.key]: value }))}
              trackColor={{ false: '#E1E8ED', true: '#39C36E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 24,
  },
  sectionHeader: {
    height: 50,
    backgroundColor: '#E7ECF0',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B6571',
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextColumn: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 15,
    color: '#657786',
    lineHeight: 20,
  },
});
