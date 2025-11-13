import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Slot />  {/* Renders current screen: login.tsx, home.tsx, etc. */}
    </SafeAreaView>
  );
}
