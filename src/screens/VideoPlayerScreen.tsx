import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { X, Repeat2, Heart, MessageCircle, Upload, Play, Pause } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

export default function VideoPlayerScreen() {
  const { src } = useLocalSearchParams<{ src?: string }>();
  const router = useRouter();
  const player = useVideoPlayer(
    useMemo(() => ({ uri: src || '' }), [src]),
    (instance) => {
      (instance as any)?.seek?.(0);
      (instance as any)?.play?.();
    }
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const timeUpdate = useEvent(player, 'timeUpdate');
  const statusChange = useEvent(player, 'statusChange');
  const playingChange = useEvent(player, 'playingChange');
  const position = timeUpdate?.currentTime ?? 0;
  const duration =
    (statusChange && (statusChange as any).duration !== undefined ? (statusChange as any).duration : 0) ?? 0;

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
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <X size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Repeat2 size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.videoWrapper}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
          allowsFullscreen
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
        >
          {isPlaying ? <Pause size={18} color="#FFFFFF" /> : <Play size={18} color="#FFFFFF" />}
        </Pressable>
        <Slider
          style={{ flex: 1, marginHorizontal: 12 }}
          minimumValue={0}
          maximumValue={Math.max(duration, 0.0001)}
          value={position}
          minimumTrackTintColor="#4C9EEB"
          maximumTrackTintColor="#cccccc"
          thumbTintColor="#FFFFFF"
          onSlidingComplete={(value) => {
            const target = Math.max(0, Number(value));
            const seekable = player as any;
            if (seekable?.seek) {
              seekable.seek(target);
            } else if (seekable?.seekTo) {
              seekable.seekTo(target);
            } else if (seekable?.setPositionAsync) {
              seekable.setPositionAsync(target);
            }
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
        <Heart size={20} color="#E83F6F" />
        <Text style={styles.engagementText}>6</Text>
        <Upload size={20} color="#FFFFFF" />
      </View>

      <View style={styles.replyBar}>
        <View style={styles.replyInput}>
          <Text style={styles.replyPlaceholder}>Tweet your reply</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playPause: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4C9EEB',
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  engagementText: {
    color: '#FFFFFF',
    marginLeft: 4,
    marginRight: 12,
  },
  replyBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  replyInput: {
    height: 38,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
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
