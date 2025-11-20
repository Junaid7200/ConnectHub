import { Asset } from 'expo-asset';
import { MoreHorizontal } from 'lucide-react-native';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useRouter } from 'expo-router';

import Avatar from '@/src/components/(app)/(Nav)/avatar';

type DrawerContextValue = {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
};

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  const drawerWidth = width * 0.82;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [isOpen, progress]);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const drawerTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-drawerWidth, 0],
  });

  const contentTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, drawerWidth * 0.4],
  });

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.25],
  });

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, toggleDrawer, isOpen }}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              transform: [{ translateX: drawerTranslate }],
            },
          ]}
        >
          <DrawerContent />
        </Animated.View>

        <Animated.View style={{ flex: 1, transform: [{ translateX: contentTranslate }] }}>
          {children}
        </Animated.View>

        <Animated.View
          pointerEvents={isOpen ? 'auto' : 'none'}
          style={[styles.overlay, { opacity: overlayOpacity }]}
        >
          <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
        </Animated.View>
      </View>
    </DrawerContext.Provider>
  );
}

function DrawerContent() {
  const router = useRouter();
  const { closeDrawer } = useDrawer();
  const bulbUri = Asset.fromModule(require('@/assets/images/project_images/bulb.svg')).uri;
  const qrUri = Asset.fromModule(require('@/assets/images/project_images/QRCode.svg')).uri;
  const profileUri = Asset.fromModule(require('@/assets/images/project_images/Drawer/profile.svg')).uri;
  const listsUri = Asset.fromModule(require('@/assets/images/project_images/Drawer/lists.svg')).uri;
  const topicsUri = Asset.fromModule(require('@/assets/images/project_images/Drawer/topics.svg')).uri;
  const bookmarksUri = Asset.fromModule(require('@/assets/images/project_images/Drawer/bookmark.svg')).uri;
  const momentsUri = Asset.fromModule(require('@/assets/images/project_images/Drawer/Moments.svg')).uri;

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.headerRow}>
        <Avatar source={require('@/assets/images/project_images/p1.png')} name="Pixsellz" size={55} />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.moreCircle}>
            <MoreHorizontal size={20} color="#4C9EEB" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.name}>Pixsellz</Text>
      <Text style={styles.handle}>@pixsellz</Text>

      <View style={styles.statsRow}>
        <Text style={styles.statNumber}>216 </Text>
        <Text style={styles.statLabel}>Following  </Text>
        <Text style={styles.statNumber}>117 </Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>

      <View style={styles.menu}>
        <Pressable
          style={styles.menuRow}
          onPress={() => {
            router.push('/(app)/profile');
            closeDrawer();
          }}
        >
          <SvgUri uri={profileUri} width={24} height={24} />
          <Text style={styles.menuLabel}>Profile</Text>
        </Pressable>
        <Pressable
          style={styles.menuRow}
          onPress={() => {
            router.push('/(app)/lists');
            closeDrawer();
          }}
        >
          <SvgUri uri={listsUri} width={24} height={24} />
          <Text style={styles.menuLabel}>Lists</Text>
        </Pressable>
        <View style={styles.menuRow}>
          <SvgUri uri={topicsUri} width={24} height={24} />
          <Text style={styles.menuLabel}>Topics</Text>
        </View>
        <View style={styles.menuRow}>
          <SvgUri uri={bookmarksUri} width={24} height={24} />
          <Text style={styles.menuLabel}>Bookmarks</Text>
        </View>
        <View style={styles.menuRow}>
          <SvgUri uri={momentsUri} width={24} height={24} />
          <Text style={styles.menuLabel}>Moments</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Settings and privacy</Text>
        <Text style={[styles.sectionText, { marginTop: 8 }]}>Help Center</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <SvgUri uri={bulbUri} width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <SvgUri uri={qrUri} width={24} height={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    zIndex: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4C9EEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  handle: {
    fontSize: 15,
    color: '#657786',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  statLabel: {
    fontSize: 15,
    color: '#657786',
  },
  menu: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E1E8ED',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
    paddingVertical: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: '#0F1419',
  },
  section: {
    paddingVertical: 16,
    gap: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#0F1419',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
});
