import { Asset } from 'expo-asset';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Bell, ChevronLeft, Home, Mail, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { useDrawer } from '../Drawer';
import Avatar from './(Nav)/avatar';
import { HomeHeaderRight, SettingsHeaderRight } from './(Nav)/icons';
import SearchHeader from './(Nav)/SearchBar';

function CustomHeader({
  title,
  right,
  left,
  borderColor = '#BDC5CD',
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  left?: React.ReactNode;
  borderColor?: string;
}) {
  return (
    <View style={[styles.customHeader, { borderBottomColor: borderColor }]}>
      <View style={styles.customHeaderTopPad} />
      <View style={styles.customHeaderRow}>
        <View style={styles.customHeaderSide}>{left}</View>
        <View style={styles.customHeaderCenter}>{title}</View>
        <View style={styles.customHeaderSide}>{right}</View>
      </View>
    </View>
  );
}

export default function NavTab() {
  const router = useRouter();
  const pathname = usePathname();
  const { openDrawer } = useDrawer();
  const user = { name: 'Junaid', imageUrl: null };
  const twitterLogoUri = Asset.fromModule(require('@/assets/images/project_images/Twitter_Logo.svg')).uri;
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C9EEB',
        tabBarShowLabel: false,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          header: () => (
            <CustomHeader
              left={
                <Pressable
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  onPress={openDrawer}
                  style={styles.avatarHitbox}
                >
                  <Avatar imageUrl={user.imageUrl} name={user.name} showNotificationDot />
                </Pressable>
              }
              title={<SvgUri uri={twitterLogoUri} width={28} height={28} />}
              right={<HomeHeaderRight />}
            />
          ),
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          header: () => (
            <CustomHeader
              left={
                <Pressable
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  onPress={openDrawer}
                  style={styles.avatarHitbox}
                >
                  <Avatar imageUrl={user.imageUrl} name={user.name} showNotificationDot />
                </Pressable>
              }
              title={<SearchHeader />}
              right={
                <SettingsHeaderRight
                  onPress={() => router.push({ pathname: '/(settings)/search', params: { from: pathname } })}
                />
              }
            />
          ),
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Search color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          header: () => (
            <CustomHeader
              left={
                <Pressable
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  onPress={openDrawer}
                  style={styles.avatarHitbox}
                >
                  <Avatar imageUrl={user.imageUrl} name={user.name} showNotificationDot />
                </Pressable>
              }
              title={<Text style={styles.sectionTitle}>Notifications</Text>}
              right={
                <SettingsHeaderRight
                  onPress={() => router.push({ pathname: '/(settings)/notifications', params: { from: pathname } })}
                />
              }
              borderColor="transparent"
            />
          ),
          tabBarIcon: ({ color, size, focused }): React.ReactNode => (
            <Bell color={color} size={size} fill={focused ? color : 'none'} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          header: () => (
            <CustomHeader
              left={
                <Pressable
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  onPress={openDrawer}
                  style={styles.avatarHitbox}
                >
                  <Avatar imageUrl={user.imageUrl} name={user.name} showNotificationDot />
                </Pressable>
              }
              title={<Text style={styles.sectionTitle}>Messages</Text>}
              right={
                <SettingsHeaderRight
                  onPress={() => router.push({ pathname: '/(settings)/messages', params: { from: pathname } })}
                />
              }
              borderColor="transparent"
            />
          ),
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Mail color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="lists"
        options={{
          href: null,
          title: 'Lists',
          headerTitle: 'Lists',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Pressable hitSlop={8} style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={22} color="#4C9EEB" />
            </Pressable>
          ),
          headerRight: () => null,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: 'transparent',
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="tweet-detail"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  avatarHitbox: {
    padding: 10,
  },
  backButton: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  customHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  customHeaderTopPad: {
    height: 60,
  },
  customHeaderRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  customHeaderSide: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
