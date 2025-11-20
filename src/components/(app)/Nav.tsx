import { Asset } from 'expo-asset';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Bell, ChevronLeft, Home, Mail, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { useDrawer } from '../Drawer';
import Avatar from './(Nav)/avatar';
import { HomeHeaderRight, SettingsHeaderRight } from './(Nav)/icons';
import SearchHeader from './(Nav)/SearchBar';

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
            ...styles.header,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            shadowColor: 'transparent',
          },
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
  backButton: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
});
