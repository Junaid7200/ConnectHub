import { Stack } from 'expo-router';

export default function NewLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="NewTweet" />
      <Stack.Screen name="newMsg" />
    </Stack>
  );
}
