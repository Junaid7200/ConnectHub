import { Link } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { ProfileAvatarProps } from '@/src/types/types';

const randomHash = (str: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

const getBackgroundColor = (name: string) => {
  if (!name) return colors[0];
  const hash = randomHash(name);
  return colors[hash % colors.length];
};

const FallbackAvatar = ({
  name,
  size = 32,
  style,
  initialsSize,
}: {
  name?: string | null;
  size?: number;
  style?: ViewStyle;
  initialsSize?: number;
}) => {
  const initials = (name || 'U').charAt(0).toUpperCase();
  const backgroundColor = getBackgroundColor(name || 'U');
  const fontSize = initialsSize ?? Math.max(12, size * 0.44);

  return (
    <View style={[styles.avatarBase, style, { backgroundColor }]}>
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
};

export default function Avatar({
  imageUrl,
  source,
  name,
  onPress,
  showNotificationDot = false,
  href,
  size = 32,
  style,
}: ProfileAvatarProps) {
  const avatarSource: ImageSourcePropType | undefined =
    source || (imageUrl ? { uri: imageUrl } : undefined);

  const wrapperStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const avatarStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const dotSize = Math.max(6, Math.min(12, size * 0.35));
  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  };

  const initialsSize = Math.max(12, size * 0.44);

  const content = (
    <View style={[styles.wrapper, wrapperStyle, style]}>
      {avatarSource ? (
        <Image source={avatarSource} style={[styles.avatarBase, avatarStyle]} resizeMode="cover" />
      ) : (
        <FallbackAvatar name={name} size={size} style={avatarStyle} initialsSize={initialsSize} />
      )}

      {showNotificationDot && <View style={[styles.dot, dotStyle]} />}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable>{content}</Pressable>
      </Link>
    );
  }

  return <Pressable>{content}</Pressable>;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: 32,
    height: 32,
    marginLeft: 4,
  },
  avatarBase: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  dot: {
    position: 'absolute',
    right: -1,
    top: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4C9EEB',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
