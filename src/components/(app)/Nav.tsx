import { Asset } from 'expo-asset';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Bell, Home, Mail, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';

import Avatar from './(Nav)/avatar';
import { HomeHeaderRight, SettingsHeaderRight } from './(Nav)/icons';
import SearchHeader from './(Nav)/SearchBar';
import { useDrawer } from '../Drawer';

export default function NavTab() {
  const router = useRouter();
  const pathname = usePathname();
  const { openDrawer } = useDrawer();
  const user = { name: 'Junaid', imageUrl: null };
  const twitterLogoUri = Asset.fromModule(require('@/assets/images/project_images/Twitter_Logo.svg')).uri;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C9EEB',
        tabBarShowLabel: false,
        headerStyle: styles.header,
        headerTitleContainerStyle: styles.headerTitleContainer,
        headerLeftContainerStyle: styles.headerSideContainer,
        headerRightContainerStyle: styles.headerSideContainer,
        headerLeft: () => (
          <Pressable
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            onPress={openDrawer}
            style={styles.avatarHitbox}
          >
            <Avatar imageUrl={user.imageUrl} name={user.name} showNotificationDot />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: () => <SvgUri uri={twitterLogoUri} width={28} height={28} />,
          headerTitleAlign: 'center',
          headerRight: () => <HomeHeaderRight />,
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerTitle: () => <SearchHeader />,
          headerTitleAlign: 'center',
          headerRight: () => (
            <SettingsHeaderRight onPress={() => router.push({ pathname: '/(settings)/search', params: { from: pathname } })} />
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
          headerTitleStyle: styles.sectionTitle,
          headerTitleAlign: 'center',
          headerRight: () => (
            <SettingsHeaderRight onPress={() => router.push({ pathname: '/(settings)/notifications', params: { from: pathname } })} />
          ),
          tabBarIcon: ({ color, size, focused }): React.ReactNode => (
            <Bell color={color} size={size} fill={focused ? color : 'none'} />
          ),
          headerStyle: {
            ...styles.header,
            borderBottomColor: '#FFFFFF',
          }
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerTitleStyle: styles.sectionTitle,
          headerTitleAlign: 'center',
          headerRight: () => (
            <SettingsHeaderRight onPress={() => router.push({ pathname: '/(settings)/messages', params: { from: pathname } })} />
          ),
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Mail color={color} size={size} />
          ),
          headerStyle: {
            ...styles.header,
            borderBottomColor: '#FFFFFF',
          }
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BDC5CD',
  },
  headerTitleContainer: {
    paddingVertical: 0,
  },
  headerSideContainer: {
    minWidth: 48,
    alignItems: 'center',
  },
  avatarHitbox: {
    padding: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
});
