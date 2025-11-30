// app/_layout.tsx
// @TODO update required
import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import {
  Stack,
  router,
  useSegments,
  SplashScreen,
  useRootNavigationState,
} from "expo-router";
// 1. Import SafeAreaView and StyleSheet
import { StyleSheet } from "react-native";
import { store, RootState } from "@/store/store";
import { theme } from "@/lib/theme";
import { fetchAllBookings } from "@/store/bookingSlice";
import { fetchAdminDashboard } from "@/store/adminSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { restoreUserSession } from "@/store/userSlice";
import { useAppDispatch } from "@/store/hooks";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { currentUser, isRestoringSession } = useSelector(
    (state: RootState) => state.user
  );
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const [isNavigationReady, setNavigationReady] = useState(false);
  useEffect(() => {
    dispatch(restoreUserSession());
  }, [dispatch]);

  useEffect(() => {
    if (navigationState?.key) {
      setNavigationReady(true);
    }
  }, [navigationState?.key]);

  useEffect(() => {
    if (!isNavigationReady) {
      // console.log('Waiting for router/navigator...'); // Keep logs if needed
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    let shouldHideSplash = true;

    if (currentUser && inAuthGroup) {
      router.replace("/(tabs)/home");
      shouldHideSplash = false;
    } else if (!currentUser && !inAuthGroup) {
      router.replace("/(auth)/login");
      shouldHideSplash = false;
    } else if (currentUser && !inAuthGroup) {
      dispatch(fetchAllBookings());
      dispatch(fetchAdminDashboard());
    }

    if (shouldHideSplash) {
      SplashScreen.hideAsync();
    }
  }, [currentUser, segments, isNavigationReady, dispatch]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // 2. Wrap the Providers with SafeAreaView
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PaperProvider theme={theme}>
          <RootLayoutNav />
        </PaperProvider>
      </ReduxProvider>
    </SafeAreaView>
  );
}

// 3. Add styles for SafeAreaView
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
