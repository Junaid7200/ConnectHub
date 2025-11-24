import Avatar from '@/src/components/primitives/Header/avatar';
import { MediaItem, TweetCardProps } from '@/src/types/types';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { BarChart3, ChevronDown, Heart, MessageCircle, Repeat2, Upload } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Linking, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

// Simple helper to keep numbers short (e.g., 1200 -> 1.2K)
const formatCount = (value: number) => {
  if (value < 1000) return `${value}`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
};

const linkPattern = /((?:https?:\/\/|www\.)\S+|#[\w]+|@\w+)/g;
const twitterBlue = '#4C9EEB';

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
  isOwnTweet,
  onPressComment,
  hideEngagement,
  onSharePress,
  onLikeToggle,
  showActivityIcon,
}: TweetCardProps) {
  const [showRetweetSheet, setShowRetweetSheet] = useState(false);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const [thumbUri, setThumbUri] = useState<string | null>(null);

  useEffect(() => {
    const maybeGenerateThumb = async () => {
      const firstMedia = media?.[0];
      const uri = (firstMedia?.type === 'video' && (firstMedia.source as any)?.uri) || null;
      if (!uri || firstMedia?.poster) {
        setThumbUri(null);
        return;
      }
      try {
        const { getThumbnailAsync } = await import('expo-video-thumbnails');
        const result = await getThumbnailAsync(uri, { time: 0 });
        setThumbUri(result?.uri ?? null);
      } catch {
        setThumbUri(null);
      }
    };
    maybeGenerateThumb();
  }, [media]);

  const likedText =
    typeof likedBy === 'string' ? likedBy : likedBy?.length ? likedBy.join(' and ') : undefined;

  const avatarSource = avatar
    ? avatar
    : avatarUrl
      ? { uri: avatarUrl }
      : undefined;

  const verifiedUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/verified.svg')).uri,
    []
  );

  const headerMeta = retweetedBy
    ? { icon: <Repeat2 size={16} color="#657786" />, text: `${retweetedBy} Retweeted` }
    : likedText
      ? { icon: <Heart size={16} color="#657786" fill="#657786" />, text: `${likedText} liked` }
      : null;

  const handleLinkPress = useCallback((value: string) => {
    if (value.startsWith('http')) {
      Linking.openURL(value).catch(() => {});
      return;
    }
    if (value.startsWith('www.')) {
      Linking.openURL(`https://${value}`).catch(() => {});
      return;
    }
    // Mentions / hashtags placeholder for future navigation
  }, []);

  const renderTweetText = useCallback(
    (value: string) => {
      const pieces: React.ReactNode[] = [];
      let lastIndex = 0;

      value.replace(linkPattern, (match, _p1, offset) => {
        if (offset > lastIndex) {
          pieces.push(value.slice(lastIndex, offset));
        }
        pieces.push(
          <Text
            key={`${match}-${offset}`}
            style={styles.linkText}
            onPress={() => handleLinkPress(match)}
          >
            {match}
          </Text>
        );
        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < value.length) {
        pieces.push(value.slice(lastIndex));
      }

      return <Text style={styles.text}>{pieces}</Text>;
    },
    [handleLinkPress]
  );

  const renderMedia = useCallback(
    (item: MediaItem, navRouter?: ReturnType<typeof useRouter>, thumb?: string | null) => {
      if (item.type === 'image') {
        return <Image source={item.source as any} style={styles.mediaImage} />;
      }

      const nav = navRouter ?? router;
      const uri = (item.source as any)?.uri;
      if (!uri) {
        return (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>Video</Text>
          </View>
        );
      }

      return (
        <Pressable
          onPress={() => {
            nav.push({
              pathname: '/(media)/video-player',
              params: { src: uri },
            });
          }}
        >
          {item.poster || thumb ? (
            <Image source={(item.poster as any) || ({ uri: thumb! } as any)} style={styles.mediaImage} />
          ) : (
            <View style={styles.mediaImage}>
              <Text style={styles.videoPlaceholderText}>Video</Text>
            </View>
          )}
          <View style={styles.playOverlay}>
            <View style={styles.playTriangle} />
          </View>
        </Pressable>
      );
    },
    [router]
  );

  return (
    <>
      <View style={[styles.card, containerStyle]}>
        {headerMeta && (
          <View style={styles.metaRow}>
            {headerMeta.icon}
            <Text style={styles.metaText}>{headerMeta.text}</Text>
          </View>
        )}

        <View style={styles.bodyRow}>
          <View style={styles.avatarColumn}>
            <Avatar source={avatarSource} name={displayName} size={52} style={styles.avatar} />
            {showThread && (
              <>
                <View style={styles.threadLine} />
                <Avatar source={avatarSource} name={displayName} size={34} style={styles.threadAvatar} />
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

            {renderTweetText(text)}

            {media && media.length > 0 ? (
              <View style={styles.mediaWrapper}>{renderMedia(media[0], router, thumbUri)}</View>
            ) : null}

            {!hideEngagement && (
              <View style={[styles.engagementRow, showActivityIcon && styles.engagementRowWide]}>
                <EngagementItem
                  icon={<MessageCircle size={18} color="#657786" />}
                  count={counts.replies}
                  onPress={
                    onPressComment
                      ? onPressComment
                      : () =>
                        router.push({
                          pathname: '/(app)/tweet-detail',
                          params: { variant: isOwnTweet ? 'mine' : 'other' },
                        })
                  }
                />
                <EngagementItem
                  icon={<Repeat2 size={18} color="#657786" />}
                  count={counts.retweets}
                  onPress={() => setShowRetweetSheet(true)}
                />
                <EngagementItem
                  icon={<Heart size={18} color={liked ? '#CE395F' : '#657786'} fill={liked ? '#CE395F' : 'none'} />}
                  count={counts.likes + (liked ? 1 : 0)}
                  onPress={() => {
                    setLiked((prev) => {
                      const next = !prev;
                      onLikeToggle?.(next);
                      return next;
                    });
                  }}
                />
                <EngagementItem
                  icon={<Upload size={18} color="#657786" />}
                  count={counts.shares ?? 0}
                  onPress={
                    onSharePress
                      ? onSharePress
                      : async () => {
                          try {
                            await Share.share({ message: text });
                          } catch {
                            // no-op
                          }
                        }
                  }
                />
                {showActivityIcon && (
                  <EngagementItem icon={<BarChart3 size={18} color="#657786" />} />
                )}
              </View>
            )}

            {showThread && (
              <Pressable onPress={onPressThread} style={styles.threadLinkWrapper}>
                <Text style={styles.threadLink}>Show this thread</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <RetweetSheet visible={showRetweetSheet} onClose={() => setShowRetweetSheet(false)} />
    </>
  );
}

function EngagementItem({
  icon,
  count,
  onPress,
}: {
  icon: React.ReactElement;
  count?: number;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.engagementItem}>
      {icon}
      {typeof count === 'number' && <Text style={styles.engagementText}>{formatCount(count)}</Text>}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.engagementPressable} hitSlop={6}>
        {content}
      </Pressable>
    );
  }

  return content;
}

function RetweetSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const retweetCommentUri = useMemo(
    () => Asset.fromModule(require('@/assets/images/project_images/retweetWithComment.svg')).uri,
    []
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />
          <Pressable style={styles.sheetRow} onPress={onClose} android_ripple={{ color: '#E7ECF0' }}>
            <Repeat2 size={22} color="#657786" />
            <Text style={styles.sheetRowText}>Retweet</Text>
          </Pressable>
          <Pressable style={styles.sheetRow} onPress={onClose} android_ripple={{ color: '#E7ECF0' }}>
            <SvgUri uri={retweetCommentUri} width={22} height={22} />
            <Text style={styles.sheetRowText}>Retweet with comment</Text>
          </Pressable>
          <Pressable style={styles.sheetCancel} onPress={onClose}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    width: 58, // avatar (52) + right margin
    alignItems: 'center',
    marginRight: 8,
  },
  avatar: {
    marginBottom: 8,
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
  linkText: {
    color: twitterBlue,
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
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E7ECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    color: '#657786',
    fontWeight: '600',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 24, // tighter spacing
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  engagementRowWide: {
    // columnGap: 18,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  engagementPressable: {
    paddingVertical: 4,
    paddingHorizontal: 4,
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
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CED5DC',
    marginBottom: 4,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  sheetRowText: {
    marginLeft: 14,
    fontSize: 17,
    color: '#0F1419',
  },
  sheetCancel: {
    marginTop: 4,
    marginHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#E7ECF0',
  },
  sheetCancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F1419',
  },
});
