import { Asset } from 'expo-asset';
import {
  ChevronDown,
  Heart,
  MessageCircle,
  Repeat2,
  Upload,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SvgUri } from 'react-native-svg';

type Engagement = {
  replies: number;
  retweets: number;
  likes: number;
  shares?: number;
};

type TweetCardProps = {
  displayName: string;
  username: string;
  time: string;
  text: string;
  avatarUrl?: string;
  avatar?: ImageSourcePropType; // allow local require sources
  verified?: boolean;
  likedBy?: string | string[];
  retweetedBy?: string;
  counts: Engagement;
  showThread?: boolean;
  onPressThread?: () => void;
  containerStyle?: ViewStyle;
  media?: ImageSourcePropType[]; // optional media attachments
};

// Simple helper to keep numbers short (e.g., 1200 -> 1.2K)
const formatCount = (value: number) => {
  if (value < 1000) return `${value}`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
};

export default function TweetCard({
  displayName,
  username,
  time,
  text,
  avatarUrl,
  avatar,
  verified = false,
  likedBy,
  retweetedBy,
  counts,
  showThread = false,
  onPressThread,
  containerStyle,
  media,
}: TweetCardProps) {
  const likedText =
    typeof likedBy === 'string'
      ? likedBy
      : likedBy?.length
        ? likedBy.join(' and ')
        : undefined;

  const avatarSource: ImageSourcePropType | null = avatar
    ? avatar
    : avatarUrl
      ? { uri: avatarUrl }
      : null;

  const verifiedUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/verified.svg')).uri,
    []
  );

  const headerMeta = retweetedBy
    ? { icon: <Repeat2 size={16} color="#657786" />, text: `${retweetedBy} Retweeted` }
    : likedText
      ? { icon: <Heart size={16} color="#657786" fill="#657786" />, text: `${likedText} liked` }
      : null;

  return (
    <View style={[styles.card, containerStyle]}>
      {headerMeta && (
        <View style={styles.metaRow}>
          {headerMeta.icon}
          <Text style={styles.metaText}>{headerMeta.text}</Text>
        </View>
      )}

      <View style={styles.bodyRow}>
        <View style={styles.avatarColumn}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          {showThread && (
            <>
              <View style={styles.threadLine} />
              {avatarSource ? (
                <Image source={avatarSource} style={styles.threadAvatar} />
              ) : (
                <View style={[styles.threadAvatar, styles.avatarPlaceholder]} />
              )}
            </>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.displayName}>{displayName}</Text>
            {verified && (
              <SvgUri
                uri={verifiedUri}
                width={14}
                height={14}
                style={styles.verifiedIcon}
              />
            )}
            <Text style={styles.username}>
              {' '}
              @{username} · {time}
            </Text>
            <View style={styles.titleSpacer} />
            <ChevronDown size={16} color="#657786" />
          </View>

          <Text style={styles.text}>{text}</Text>

          {media && media.length > 0 ? (
            <View style={styles.mediaWrapper}>
              <Image source={media[0]} style={styles.mediaImage} />
            </View>
          ) : null}

          <View style={styles.engagementRow}>
            <EngagementItem icon={<MessageCircle size={18} color="#657786" />} count={counts.replies} />
            <EngagementItem icon={<Repeat2 size={18} color="#657786" />} count={counts.retweets} />
            <EngagementItem icon={<Heart size={18} color="#657786" />} count={counts.likes} />
            <EngagementItem icon={<Upload size={18} color="#657786" />} count={counts.shares ?? 0} />
          </View>

          {showThread && (
            <Pressable onPress={onPressThread} style={styles.threadLinkWrapper}>
              <Text style={styles.threadLink}>Show this thread</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function EngagementItem({
  icon,
  count,
}: {
  icon: React.ReactElement;
  count: number;
}) {
  return (
    <View style={styles.engagementItem}>
      {icon}
      <Text style={styles.engagementText}>{formatCount(count)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignSelf: 'stretch',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    columnGap: 6,
    paddingLeft: 58, // offset so it isn't directly above the avatar
  },
  metaText: {
    color: '#657786',
    fontSize: 14,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarColumn: {
    width: 58, // avatar (46) + right margin
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 8,
    backgroundColor: '#E1E8ED',
  },
  avatarPlaceholder: {
    backgroundColor: '#E1E8ED',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    columnGap: 4,
  },
  titleSpacer: {
    flex: 1,
  },
  displayName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0F1419',
    marginRight: 4,
  },
  verifiedIcon: {
    marginRight: 4,
  },
  username: {
    fontSize: 14,
    color: '#657786',
    flexShrink: 1,
    marginRight: 6,
  },
  text: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 22,
    marginTop: 4,
    marginBottom: 8,
  },
  mediaWrapper: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E1E8ED',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 28, // tighten spacing between action items
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  engagementText: {
    fontSize: 14,
    color: '#657786',
  },
  threadLinkWrapper: {
    marginTop: 8,
  },
  threadLink: {
    color: '#4C9EEB',
    fontSize: 15,
  },
  threadLine: {
    width: 2,
    flexGrow: 1,
    minHeight: 42,
    backgroundColor: '#E1E8ED',
    marginVertical: 4,
  },
  threadAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 4,
  },
});
