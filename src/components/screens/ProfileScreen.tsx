import TweetCard from '@/src/components/features/Cards/TweetCard';
import Fab from '@/src/components/primitives/Fab';
import Avatar from '@/src/components/primitives/Header/avatar';
import { useAppSelector } from '@/src/hooks/useRedux';
import { supabase } from '@/src/lib/supabase';
import { Profile as ProfileType, TweetCardProps } from '@/src/types/types';
import { useFocusEffect } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';

const profileAvatar = require('@/assets/images/project_images/p1.png');


const localVideoUri = Asset.fromModule(
  require('@/assets/images/project_videos/video.mp4')
).uri;

const tweets: (TweetCardProps & { pinned?: boolean })[] = [
  {
    id: 'pinned',
    pinned: true,
    displayName: 'Pixsellz',
    username: 'pixsellz',
    time: '7/31/19',
    text: 'Scheme Constructor - your ultimate prototyping kit for all UX web and mobile app design! constructor.pixsellz.io',
    counts: { replies: 2, retweets: 12, likes: 15, shares: 1 },
    media: [{ type: 'image', source: require('@/assets/images/project_images/MediaToolBar/Media.png') }],
  },
  {
  id: 'video-1',
  displayName: 'Pixsellz',
  username: 'pixsellz',
  time: '1h',
  text: 'Check this out',
  counts: { replies: 2, retweets: 1, likes: 5, shares: 0 },
  media: [
    {
      type: 'video',
      source: { uri: localVideoUri },
      // poster: require('@/assets/images/project_images/MediaToolBar/Media.png'), // optional
    },
  ],
},
  {
    id: 'reply1',
    displayName: 'Pixsellz',
    username: 'pixsellz',
    time: '12h',
    text: '#prototyping #wireframe #uiux #ux',
    counts: { replies: 1, retweets: 1, likes: 3, shares: 0 },
  },
];

const tweetsReplies: (TweetCardProps & { pinned?: boolean })[] = tweets.map((t, idx) => ({
  ...t,
  id: `${t.id}-reply-${idx}`,
  text: idx === 0 ? `${t.text}\nReplying to someone` : t.text,
}));

const mediaTweets: (TweetCardProps & { pinned?: boolean })[] = tweets.map((t, idx) => ({
  ...t,
  id: `${t.id}-media-${idx}`,
  media: [{ type: 'image', source: require('@/assets/images/project_images/MediaToolBar/Media(2).png') }],
}));

const likedTweets: TweetCardProps[] = [
  {
    id: 'liked-1',
    displayName: 'Another User',
    username: 'another',
    time: '5h',
    text: 'Liked tweet example with no media',
    counts: { replies: 4, retweets: 1, likes: 12, shares: 1 },
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const { session: authUser } = useAppSelector((state) => state.auth);
  const userId = authUser?.id ?? null;
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'tweets' | 'replies' | 'media' | 'likes'>('tweets');
  const linkUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/Profile/Link.svg')).uri, []);
  const calendarUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/Profile/Calendar.svg')).uri,
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('tweets');
      listRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }, [])
  );

  const displayName = profile?.displayName ?? 'Pixsellz';
  const username = profile?.username ?? 'pixsellz';
  const bannerUri = profile?.bannerUrl ?? null;
  const avatarSource = profile?.avatarUrl ? { uri: profile.avatarUrl } : (profileAvatar as any);
  const bio =
    profile?.bio ??
    'Digital Goodies Team - Web & Mobile UI/UX development; Graphics; Illustrations';
  const linkText = profile?.link ?? 'pixsellz.io';
  const locationText = profile?.location ?? 'San Francisco';
  const joinedText = formatJoinedDate(profile?.createdAt);

  const handleChangeBanner = useCallback(async () => {
    if (!userId) {
      Alert.alert('Login required', 'Sign in to update your banner.');
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to pick a banner image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes defaults to Images; passing it explicitly on some SDKs miscasts the type.
      allowsMultipleSelection: false,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    try {
      setUploadingBanner(true);
      const fileExt = asset.fileName?.split('.').pop() ?? 'jpg';
      const fileName = `banner-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${userId}/${fileName}`;
      const response = await fetch(asset.uri);
      const fileBlob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, fileBlob, {
          upsert: true,
          contentType: fileBlob.type || 'image/jpeg',
        });
      if (uploadError || !uploadData?.path) {
        throw uploadError ?? new Error('Upload failed');
      }

      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(uploadData.path);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Unable to resolve banner URL');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', userId);
      if (updateError) throw updateError;

      setProfile((prev) => (prev ? { ...prev, bannerUrl: publicUrl } : prev));
    } catch (err: any) {
      Alert.alert('Banner update failed', err?.message ?? 'Please try again.');
    } finally {
      setUploadingBanner(false);
    }
  }, [userId]);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      if (!userId) return;
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, banner_url, bio, link, location, is_verified, pinned_tweet_id, created_at')
        .eq('id', userId)
        .single();
      if (!active) return;
      if (error) {
        setLoadingProfile(false);
        return;
      }
      if (data) {
        setProfile({
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bannerUrl: data.banner_url,
          bio: data.bio,
          link: data.link,
          location: data.location,
          isVerified: data.is_verified,
          pinnedTweetId: data.pinned_tweet_id,
          createdAt: data.created_at,
        });
      }
      setLoadingProfile(false);
    };
    fetchProfile();
    return () => {
      active = false;
    };
  }, [userId]);
  const pinUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/Profile/Pin.svg')).uri, []);
  const renderHeader = () => (
    <View>
      <Pressable
        style={[styles.banner, { height: 140 + insets.top, paddingTop: insets.top + 8 }]}
        onPress={handleChangeBanner}
      >
        {bannerUri ? (
          <Image source={{ uri: bannerUri }} style={StyleSheet.absoluteFillObject} />
        ) : null}
        <View style={styles.bannerOverlay} />
        <Pressable
          style={[styles.backCircle, { top: insets.top + 12 }]}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/home'))}
        >
          <ChevronLeft size={20} color="#FFFFFF" />
        </Pressable>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{displayName}</Text>
          <Text style={styles.bannerSubtitle}>
            {loadingProfile ? 'Loading profile...' : 'Tap to update banner'}
          </Text>
          {uploadingBanner && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginTop: 6 }} />}
        </View>
      </Pressable>

      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <Avatar source={avatarSource as any} name={displayName} size={86} />
          </View>
        </View>
        <Pressable style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.handle}>@{username}</Text>
        <Text style={styles.bio}>{bio}</Text>

        <View style={styles.metaRow}>
          <SvgUri uri={linkUri} width={16} height={16} />
          <Text style={styles.metaLink}> {linkText}</Text>
          <SvgUri uri={calendarUri} width={16} height={16} style={{ marginLeft: 12 }} />
          <Text style={styles.metaText}> Joined {joinedText}</Text>
        </View>

        <View style={styles.followRow}>
          <Text style={styles.followNumber}>217</Text>
          <Text style={styles.followLabel}> Following</Text>
          <Text style={[styles.followNumber, { marginLeft: 12 }]}>118</Text>
          <Text style={styles.followLabel}> Followers</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        {(['tweets', 'replies', 'media', 'likes'] as const).map((tab) => {
          const label =
            tab === 'tweets'
              ? 'Tweets'
              : tab === 'replies'
                ? 'Tweets & replies'
                : tab === 'media'
                  ? 'Media'
                  : 'Likes';
          return (
            <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]} numberOfLines={1}>
                {label}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const data =
    activeTab === 'tweets'
      ? tweets
      : activeTab === 'replies'
        ? tweetsReplies
        : activeTab === 'media'
          ? mediaTweets
          : likedTweets;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id as string}
        renderItem={({ item }) => (
          <View>
            {item.pinned && (
              <View style={styles.pinnedRow}>
                <SvgUri uri={pinUri} width={12} height={12} />
                <Text style={styles.pinnedLabel}>Pinned Tweet</Text>
              </View>
            )}
            <TweetCard {...item} hideEngagement={false} isOwnTweet={activeTab !== 'likes'} showActivityIcon={activeTab !== 'likes'} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No content yet</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <Fab onPress={() => router.push('/(New)/NewTweet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    height: 140,
    backgroundColor: '#1B1B1B',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  backCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    top: 12,
    left: 16,
  },
  backChevron: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#E1E8ED',
    fontSize: 13,
    marginTop: 2,
  },
  bannerText: {
    rowGap: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -32,
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4C9EEB',
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: '#4C9EEB',
    fontWeight: '600',
    fontSize: 15,
  },
  infoBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1419',
  },
  handle: {
    fontSize: 15,
    color: '#657786',
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLink: {
    fontSize: 15,
    color: '#4C9EEB',
    marginLeft: 4,
  },
  metaText: {
    fontSize: 15,
    color: '#657786',
    marginLeft: 4,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    marginTop: 2,
  },
  followNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  followLabel: {
    fontSize: 15,
    color: '#657786',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#687684',
    letterSpacing: -0.3,
  },
  tabTextActive: {
    color: '#4C9EEB',
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: '#4C9EEB',
    borderRadius: 999,
    marginTop: 0,
  },
  pinnedLabel: {
    color: '#687684',
    fontSize: 14,
    fontWeight: '600',
  },
  pinnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    columnGap: 6,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#657786',
  },
});

function formatJoinedDate(iso?: string | null) {
  if (!iso) return 'recently';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'recently';
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
}
