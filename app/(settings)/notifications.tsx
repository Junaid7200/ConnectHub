import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import SettingsHeader from '@/src/components/SettingsHeader';

const settingsData = [
  {
    key: 'push',
    title: 'Push notifications',
    body: 'Receive push notifications for new activity.',
    defaultOn: true,
  },
  {
    key: 'mentions',
    title: 'Mentions and replies',
    body: 'Notify me when someone mentions or replies to me.',
    defaultOn: true,
  },
  {
    key: 'follows',
    title: 'New followers',
    body: 'Get notified when someone follows you.',
    defaultOn: true,
  },
  {
    key: 'sound',
    title: 'Sound',
    body: 'Play a sound for new notifications.',
    defaultOn: false,
  },
];

export default function NotificationSettings() {
  const router = useRouter();
  const [toggles, setToggles] = useState(
    settingsData.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.key] = item.defaultOn;
      return acc;
    }, {})
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsHeader title="Notification settings" onBack={() => router.back()} onDone={() => router.back()} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionText}>Notifications</Text>
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
