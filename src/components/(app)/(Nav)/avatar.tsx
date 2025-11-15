import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';


type ProfileAvatarProps = {
    imageUrl?: string | null;
    name?: string | null;
    onPress?: () => void;
    showNotificationDot?: boolean;
}

const randomHash = (str: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

// Simple color palette
const colors = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
];



const getBackgroundColor = (name: string) => {
    if (!name) return colors[0];
    const hash = randomHash(name);
    return colors[hash % colors.length];
};


const FallbackAvatar = ({name}: {name?: string | null}) => {
    const initials = (name || 'U').charAt(0).toUpperCase();
    const backgroundColor = getBackgroundColor(name || 'U');
    return (
        <View
        style={{ backgroundColor }} 
        className="w-8 h-8 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-sm">{initials}</Text>
        </View>
    )
}



export default function Avatar({imageUrl, name, onPress, showNotificationDot=false}: ProfileAvatarProps) {

    const content = (
        <View>
            {imageUrl ? (
                <Image
                source = {{uri: imageUrl}}
                className='w-8 h-8 rounded-full'/>
            ) : (
                <FallbackAvatar name={name}/>
            )}
            {/* Add notification dot here */}
            {showNotificationDot && (
                <View className="w-3 h-3 bg-[#4C9EEB] rounded-full absolute top-0 right-0 border-2 border-white" />
            )}
        </View>
    );
    if (onPress) {
        return (
            <Pressable onPress={onPress}>
                {content}
            </Pressable>
        )
    } else {
        return (
            <Link href="/profile/junaid" asChild>
                <Pressable className="ml-4">{content}</Pressable>
            </Link>
        )
    }
}