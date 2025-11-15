import { Tabs } from 'expo-router';
import { Bell, Home, Mail, Search } from 'lucide-react-native';
import React from 'react';
import { Image } from 'react-native';

// Import your components from their new paths
import Avatar from './(Nav)/avatar';
import {
    HomeHeaderRight,
    SettingsHeaderRight,
} from './(Nav)/icons';
import SearchHeader from './(Nav)/SearchBar';




export default function NavTab() {
  // Placeholder user data
  const user = {
    name: 'Junaid',
    imageUrl: null, // Set a URL here to test with a real image
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C9EEB',
        tabBarShowLabel: true,
        headerLeft: () => (
          <Avatar
            imageUrl={user.imageUrl}
            name={user.name}
            showNotificationDot={true}
            // Add onPress prop if you want to open a drawer menu
            // onPress={() => console.log('Open drawer')}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/project_images/Twitter_Logo.png')} 
              className="w-7 h-7"
              resizeMode="contain"
            />
          ),
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
          headerRight: () => <SettingsHeaderRight />,
        headerTitleContainerStyle: { 
      flex: 1,  // Take up all available space
      paddingHorizontal: 0, // Remove default padding
    },
        // headerTitleContainerStyle: { left: 56, right: 56 },
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Search color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'left',
          headerRight: () => <SettingsHeaderRight />,
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Bell color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'left',
          headerRight: () => <SettingsHeaderRight />,
          tabBarIcon: ({ color, size }): React.ReactNode => (
            <Mail color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}