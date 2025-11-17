import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type ProfileAvatarProps = {
  imageUrl?: string | null;
  name?: string | null;
  onPress?: () => void;
  showNotificationDot?: boolean;
};

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

const FallbackAvatar = ({ name }: { name?: string | null }) => {
  const initials = (name || 'U').charAt(0).toUpperCase();
  const backgroundColor = getBackgroundColor(name || 'U');

  return (
    <View style={[styles.avatarBase, { backgroundColor }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

export default function Avatar({
  imageUrl,
  name,
  onPress,
  showNotificationDot = false,
}: ProfileAvatarProps) {
  const content = (
    <View style={styles.wrapper}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.avatarBase} resizeMode="cover" />
      ) : (
        <FallbackAvatar name={name} />
      )}

      {showNotificationDot && <View style={styles.dot} />}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return (
    <Link href="/profile/junaid" asChild>
      <Pressable>{content}</Pressable>
    </Link>
  );
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
