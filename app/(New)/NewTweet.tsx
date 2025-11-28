import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import MediaToolBar from '@/src/components/features/New/MediaToolBar';
import NewTweetHeader from '@/src/components/features/New/NewTweetHeader';
import Avatar from '@/src/components/primitives/Header/avatar';
import { useAppSelector } from '@/src/hooks/useRedux';
import { useCreateTweetMutation } from '@/src/store/services/tweetsApi';

export default function NewTweet() {
  const router = useRouter();
  const session = useAppSelector((state) => state.auth.session);
  const [text, setText] = useState('');
  const [createTweet, { isLoading } ] = useCreateTweetMutation();

  const avatarSource = useMemo(() => {
    const metadataAvatar = (session as any)?.user_metadata?.avatar_url as string | undefined;
    if (metadataAvatar) {
      return { uri: metadataAvatar };
    }
    return require('@/assets/images/project_images/p1.png');
  }, [session]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
    }
  };

  const handleTweet = async () => {
    const body = text.trim();
    if (!body || !session?.id || isLoading) return;
    try {
      await createTweet({ author_id: session.id, body }).unwrap();
      setText('');
      goBack();
    } catch (error) {
      console.warn('Failed to post tweet', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <NewTweetHeader
        onCancel={goBack}
        onTweet={handleTweet}
        tweetDisabled={!text.trim() || !session || isLoading}
        title="New Tweet"
      />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Avatar source={avatarSource} name="You" size={37} style={styles.avatar} />
          <TextInput
            placeholder="What's happening?"
            placeholderTextColor="#657786"
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      <MediaToolBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    minHeight: 200,
    fontSize: 18,
    color: '#0F1419',
    lineHeight: 24,
    padding: 0,
  },
});
