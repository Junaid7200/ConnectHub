import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettingRow from '@/src/components/settings/SettingRow';

const accountItems = [
  'Account',
  'Privacy and safety',
  'Notifications',
  'Content preferences',
] as const;

const generalItems = ['Display and sound', 'Data usage', 'Accessibility', 'About Twitter'] as const;

export default function SettingsPrivacy() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings and privacy</Text>
        <Text
          style={styles.headerAction}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(app)/home');
            }
          }}
        >
          Done
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.handle} />
        <View style={styles.accountLabelWrapper}>
          <Text style={styles.accountLabel}>@pixsellz</Text>
        </View>
        <View style={styles.sectionCard}>
          {accountItems.map((item, idx) => (
            <SettingRow key={item} title={item} topBorder={idx === 0} />
          ))}
        </View>

        {/* <Text style={styles.accountLabel}>General</Text> */}
        <View style={styles.accountLabelWrapper}>
          <Text style={styles.accountLabel}>General</Text>
        </View>
        <View style={styles.sectionCard}>
          {generalItems.map((item, idx) => (
            <SettingRow key={item} title={item} topBorder={idx === 0} />
          ))}
          <Text style={styles.footerNote}>
            General settings affect all of your Twitter accounts on this device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7ECF0',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141619',
  },
  headerAction: {
    position: 'absolute',
    right: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#4C9EEB',
  },
  handle: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E1E8ED',
  },
  accountLabelWrapper: {
    backgroundColor: '#E7ECF0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  accountLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B6571',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  footerNote: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#687684',
    letterSpacing: -0.15,
  },
});
