import { Href } from 'expo-router';
import { ImageSourcePropType, ViewStyle } from 'react-native';

export type NotificationTab = 'all' | 'mentions';

export type AllNotification = {
  id: string;
  avatar?: ImageSourcePropType;
  title: string;
  body: string;
  link?: string;
};

export type MentionNotification = {
  id: string;
  displayName: string;
  username: string;
  time: string;
  verified: boolean;
  avatar: ImageSourcePropType;
  text: string;
  likedBy: string[];
  counts: { replies: number; retweets: number; likes: number; shares: number };
  showThread: boolean;
};

export type FabProps = {
  onPress?: () => void;
  iconSource?: number; // require() module for svg
};

export type NotiAllProps = {
  avatar?: ImageSourcePropType;
  title: string;
  body: string;
  link?: string;
};

export type Engagement = {
  replies: number;
  retweets: number;
  likes: number;
  shares?: number;
};

export type TweetCardProps = {
  displayName: string;
  username: string;
  time: string;
  text: string;
  avatarUrl?: string;
  avatar?: ImageSourcePropType;
  verified?: boolean;
  likedBy?: string | string[];
  retweetedBy?: string;
  counts: Engagement;
  showThread?: boolean;
  onPressThread?: () => void;
  containerStyle?: ViewStyle;
  media?: ImageSourcePropType[];
};

export type ProfileAvatarProps = {
  imageUrl?: string | null;
  source?: ImageSourcePropType;
  name?: string | null;
  onPress?: () => void;
  showNotificationDot?: boolean;
  href?: Href;
  size?: number;
  style?: ViewStyle;
};

export type MessageCardProps = {
  avatar?: ImageSourcePropType;
  displayName: string;
  username: string;
  date: string;
  preview: string;
};

export type SettingsHeaderProps = {
  title: string;
  onBack?: () => void;
  onDone?: () => void;
};

export type MessageSearchCardProps = {
  avatar?: ImageSourcePropType;
  displayName: string;
  username: string;
  verified?: boolean;
};

export type NewTweetHeaderProps = {
  onCancel?: () => void;
  onTweet?: () => void;
  tweetDisabled?: boolean;
  title?: string;
};

export type SearchBarProps = {
  placeholder: string;
  width?: number;
  align?: 'center' | 'left';
  backgroundColor?: string;
  showFocusBorder?: boolean;
  style?: ViewStyle;
};

export type ListTab = 'subscribed' | 'member';

export type ListItem = {
  id: string;
  owner: string;
  name: string;
  description?: string;
  members: number;
  subscribers?: number;
  avatar?: ImageSourcePropType;
};
