import "@/app/global.css";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { clearSession, setSession } from "@/src/store/features/auth/authSlice";
import { store } from "@/src/store/store";
import { Session } from '@supabase/supabase-js';
import { router, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { supabase } from "../src/lib/supabase";

function RootLayoutNav() {
  const [session, setTheSession] = useState<Session | null>(null)
  const dispatch = useAppDispatch();

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


  return (
    <SafeAreaView className="flex-1">
      <Slot />
    </SafeAreaView>
  )
}


export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
