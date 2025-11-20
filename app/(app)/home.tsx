import TweetCard from '@/src/components/(app)/TweetCard';
import Fab from '@/src/components/Fab';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { FlatList, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tweets = Array.from({ length: 4 }).map((_, idx) => ({
    id: `tweet-${idx}`,
    displayName: 'Martha Craig',
    username: 'craig_love',
    time: '12h',
    verified: true,
    avatar: require('@/assets/images/project_images/p1.png'),
    text: 'UXR/UX: You can only bring one item to a remote island to assist your research of native use of tools and usability. What do you bring? #TellMeAboutYou',
    likedBy: ['Kieron Dotson', 'Zack John'],
    counts: { replies: 28, retweets: 5, likes: 21, shares: 2 },
    showThread: true,
    isOwnTweet: idx === 0,
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* flatList gives a built-in scroller, it is basically the .map thing we do in react. 
      it also has a keyExtracter thing for the whole "assign id to each div" in react. 
      renderItem is a prop in it that accepts a callback and tells what to render against each item*/}
      <FlatList
        style={{ flex: 1 }}
        data={tweets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TweetCard
            displayName={item.displayName}
            username={item.username}
            time={item.time}
            verified={item.verified}
            avatar={item.avatar}
            text={item.text}
            likedBy={item.likedBy}
            counts={item.counts}
            showThread={item.showThread}
            isOwnTweet={item.isOwnTweet}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <Fab onPress={() => router.push('/(New)/NewTweet')} />
    </View>
  );
}
