import Slider from '@react-native-community/slider';
import { useEvent } from 'expo';
import { Asset } from 'expo-asset';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Heart, MessageCircle, Pause, Play, Repeat2, Upload } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

export default function VideoPlayerScreen() {
  const { src } = useLocalSearchParams<{ src?: string }>();
  const router = useRouter();
  const player = useVideoPlayer(
    useMemo(() => ({ uri: src || '' }), [src]),
    (instance) => {
      instance.currentTime = 0;
      instance.timeUpdateEventInterval = 0.25;
      instance.play?.();
    }
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [reply, setReply] = useState('');
  const timeUpdate = useEvent(player, 'timeUpdate');
  const sourceLoad = useEvent(player, 'sourceLoad');
  const playingChange = useEvent(player, 'playingChange');
  const position = timeUpdate?.currentTime ?? 0;
  const duration = sourceLoad?.duration ?? player?.duration ?? 0;
  const crossUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/VideoPlayer/cross.svg')).uri, []);
  const minimizeUri = useMemo(() => Asset.fromModule(require('@/assets/images/project_images/VideoPlayer/Minimize.svg')).uri, []);

  useEffect(() => {
    setIsPlaying(playingChange?.isPlaying ?? false);
  }, [playingChange]);

  useEffect(() => {
    if (!src) {
      router.back();
    }
  }, [src, router]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.topIconButton} onPress={() => router.back()}>
          <SvgUri uri={crossUri} width={16} height={16} />
        </Pressable>
        <Pressable style={styles.topIconButton} onPress={() => router.back()}>
          <SvgUri uri={minimizeUri} width={16} height={16} />
        </Pressable>
      </View>

      <View style={styles.videoWrapper}>
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false}
          contentFit="contain"
          fullscreenOptions={{ enable: false }}
          allowsPictureInPicture
        />
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
          style={styles.playPause}
          hitSlop={8}
        >
          {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" />}
        </Pressable>
        <Slider
          style={{ flex: 1, marginHorizontal: 12 }}
          minimumValue={0}
          maximumValue={Math.max(duration, position, 0.0001)}
          value={position}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#6B6B6B"
          thumbTintColor="#FFFFFF"
          onSlidingComplete={(value) => {
            const target = Math.max(0, Number(value));
            player.currentTime = target;
          }}
        />
        <Text style={styles.time}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
      </View>

      <View style={styles.engagementRow}>
        <MessageCircle size={20} color="#FFFFFF" />
        <Text style={styles.engagementText}>2</Text>
        <Repeat2 size={20} color="#20BF6B" />
        <Text style={styles.engagementText}>2</Text>
        <Pressable onPress={() => setLiked((prev) => !prev)} hitSlop={8} style={styles.engagementIcon}>
          <Heart size={20} color={liked ? '#E83F6F' : '#FFFFFF'} fill={liked ? '#E83F6F' : 'none'} />
        </Pressable>
        <Text style={styles.engagementText}>6</Text>
        <Pressable
          onPress={async () => {
            try {
              await Share.share({ message: 'Check this out' });
              setShared(true);
            } catch {
              /* noop */
            }
          }}
          hitSlop={8}
          style={styles.engagementIcon}
        >
          <Upload size={20} color={shared ? '#4C9EEB' : '#FFFFFF'} />
        </Pressable>
      </View>

      <View style={styles.replyBar}>
        <TextInput
          style={styles.replyInput}
          placeholder="Tweet your reply"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={reply}
          onChangeText={setReply}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={() => setReply('')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383838',
  },
  topRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 50,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.9,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 44,
  },
  playPause: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 12,
    minWidth: 70,
    textAlign: 'right',
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#191919',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#474747',
  },
  engagementText: {
    color: '#FFFFFF',
    marginLeft: 4,
    marginRight: 12,
  },
  engagementIcon: {
    padding: 4,
  },
  replyBar: {
    paddingHorizontal: 16,
    backgroundColor: '#191919',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#474747',
  },
  replyInput: {
    height: 38,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#474747',
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#191919',
  },
  replyPlaceholder: {
    color: '#FFFFFF',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    color: '#FFFFFF',
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
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
