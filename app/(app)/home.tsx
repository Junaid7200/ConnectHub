import { supabase } from "@/src/lib/supabase";
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  }
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-bold">
        This is the (App) Home Feed
      </Text>
      <Pressable onPress={handleLogout} className="mt-4 p-2 bg-red-500 rounded">
        <Text>Log Out</Text>
      </Pressable>
    </View>
  );
}