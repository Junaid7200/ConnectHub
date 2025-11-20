import "@/app/global.css";
import { DrawerProvider } from "@/src/components/Drawer";
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
  const [session, setTheSession] = useState<Session | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  });
  const dispatch = useAppDispatch();

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
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   console.log("Getting initial session:", session);
    //   setTheSession(session)
    //   if (session) {
    //     console.log("Initial session:", session);
    //     dispatch(setSession(session.user))
    //     console.log("this is the user in redux now:", session.user)
    //     router.replace('/(app)/home');
    //   }
    //   else {
    //     console.log("there was no session: ", session);
    //     router.replace('/(auth)/login');
    //   }
    // })
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("Auth state changed:", _event, session);
      setTheSession(session)
      if (session) {
        dispatch(setSession(session.user))
        // console.log("onAuthStateChange just triggered, new value in redux is: ", session.user)
        router.replace('/(app)/home');
      }
      else {
        dispatch(clearSession())
        router.replace('/(auth)/login');
      }
    })
  }, [])

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
      <DrawerProvider>
        <RootLayoutNav />
      </DrawerProvider>
    </Provider>
  );
}
