import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import Avatar from '@/src/components/(app)/(Nav)/avatar';
import MediaToolBar from '@/src/components/(app)/MediaToolBar';
import NewTweetHeader from '@/src/components/(app)/NewTweetHeader';

export default function NewTweet() {
  const router = useRouter();
  const [text, setText] = useState('');

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
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
        onTweet={goBack}
        tweetDisabled={!text.trim()}
        title="New Tweet"
      />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Avatar source={require('@/assets/images/project_images/p1.png')} name="You" size={37} style={styles.avatar} />
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
