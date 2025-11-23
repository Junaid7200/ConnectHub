import "@/app/global.css";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { clearSession, setSession } from "@/src/store/features/auth/authSlice";
import { store } from "@/src/store/store";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform, Text, TextInput } from "react-native";
import { Provider } from "react-redux";
import { supabase } from "../src/lib/supabase";

SplashScreen.preventAutoHideAsync().catch(() => {
  // It's safe to ignore this in dev if the splash screen was already hidden.
});

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const [session, setTheSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (!fontsLoaded) return;
    if (Platform.OS === "ios") {
      // Use native SF on iOS; no global override needed.
      SplashScreen.hideAsync();
      return;
    }

    const defaultFontStyle = { fontFamily: "Inter-Regular" };
    // Types for defaultProps are deprecated in RN types; cast to keep TS happy.
    const T = Text as typeof Text & { defaultProps?: any };
    const TI = TextInput as typeof TextInput & { defaultProps?: any };

    T.defaultProps = T.defaultProps || {};
    TI.defaultProps = TI.defaultProps || {};

    T.defaultProps.style = [defaultFontStyle, T.defaultProps.style];
    TI.defaultProps.style = [defaultFontStyle, TI.defaultProps.style];

    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    let mounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setTheSession(nextSession);
      setAuthReady(true);
      if (nextSession) {
        dispatch(setSession(nextSession.user));
        router.replace('/(app)/home');
      } else {
        dispatch(clearSession());
        router.replace('/(auth)/login');
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    // <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="(New)" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    // </SafeAreaView>
  )
}


export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* <SafeAreaProvider> */}
        {/* <DrawerProvider> */}
          <RootLayoutNav />
        {/* </DrawerProvider> */}
      {/* </SafeAreaProvider> */}
    </Provider>
  );
}
