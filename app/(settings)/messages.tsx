import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import SettingsHeader from '@/src/components/primitives/GenericHeader';

const settingsData = [
  {
    key: 'receive',
    title: 'Receive messages from anyone',
    body:
      "You will be able to receive Direct Message requests from anyone on Twitter, even if you don't follow them.",
    learnMore: true,
    defaultOn: true,
  },
  {
    key: 'quality',
    title: 'Quality filter',
    body:
      'Filters lower-quality messages from your Direct Message requests.',
    learnMore: true,
    defaultOn: false,
  },
  {
    key: 'read',
    title: 'Show read receipts',
    body:
      "When someone sends you a message, people in the conversation will know when you've seen it. If you turn off this setting, you won't be able to see read receipts from others.",
    learnMore: true,
    defaultOn: true,
  },
];

export default function MessageSettings() {
  const router = useRouter();
  const [toggles, setToggles] = useState(
    settingsData.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.key] = item.defaultOn;
      return acc;
    }, {})
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsHeader title="Messages settings" onBack={goBack} onDone={goBack} />
      <View style={styles.privacyHeader}>
        <Text style={styles.privacyText}>Privacy</Text>
      </View>
      {settingsData.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextColumn}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              {item.learnMore && <Text style={styles.learnMore}>Learn more</Text>}
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
  privacyHeader: {
    height: 50,
    backgroundColor: '#E7ECF0',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  privacyText: {
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
    marginBottom: 6,
  },
  learnMore: {
    fontSize: 15,
    color: '#4C9EEB',
  },
});
