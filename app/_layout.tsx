import {
  restoreAuthState,
  selectToken,
} from "@/redux/feature/authentication/authenticationSlice";
import { store } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { NativeBaseProvider, extendTheme } from "native-base";
import "nativewind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import OTAUpdateModal from "../components/OTAUpdateModal";
import "../global.css";
import { cleanupOrderSoundManager } from "../utils/orderSoundManager";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifications";
import Home from "./home";
import HomeScreen from "./index";

// Import for order sound functionality
import { useGetIncomingOrdersQuery } from "@/redux/feature/order/orderApi";
import { useAudioPlayer } from "expo-audio";
import { useRef } from "react";
import { subscribeToSoundPauseState } from "../utils/orderSoundManager";

const theme = extendTheme({});

function AuthGate() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  useEffect(() => {
    const hydrateAuth = async () => {
      const authData = await AsyncStorage.getItem("auth");
      if (authData) {
        const { token, user } = JSON.parse(authData);
        if (token && user) {
          dispatch(restoreAuthState({ token, user }));
        }
      }
    };
    hydrateAuth();
  }, [dispatch]);
  return token ? <Home /> : <HomeScreen />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Development-only function to test the update modal
  const testUpdateModal = () => {
    if (__DEV__) {
      setShowUpdateModal(true);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        // TODO: send token to your backend for this user/restaurant
        // await fetch('/api/save-token', { method: 'POST', body: JSON.stringify({ token }) });
      }
    });

    // Handle notification response (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // This will bring the app to the foreground automatically
        // You can add navigation logic here if you want to deep link
      }
    );

    // Check for OTA updates
    const checkForUpdates = async () => {
      try {
        // Only check for updates in production builds
        if (Updates.isEnabled && !__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            setShowUpdateModal(true);
          }
        }
      } catch (error) {}
    };

    // Check for updates when app starts (only in production)
    if (!__DEV__) {
      checkForUpdates();

      // Set up periodic update checks (every 30 minutes) - only in production
      const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

      return () => {
        subscription.remove();
        clearInterval(updateInterval);
      };
    }

    // Development: Add test function to global for testing
    if (__DEV__) {
      (global as any).testUpdateModal = testUpdateModal;
    }

    return () => {
      subscription.remove();
      // Cleanup order sound manager when app unmounts
      cleanupOrderSoundManager();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NativeBaseProvider theme={theme}>
          <Provider store={store}>
            <StatusBar style="auto" translucent />
            {/* --- Global order sound logic start --- */}
            <GlobalOrderSoundListener />
            {/* --- Global order sound logic end --- */}
            <AuthGate />
            <Toast />
            <OTAUpdateModal
              visible={showUpdateModal}
              onUpdateComplete={() => setShowUpdateModal(false)}
            />
          </Provider>
        </NativeBaseProvider>
      </View>
    </SafeAreaProvider>
  );
}

// Move the global order sound logic into a child component so it is inside the Provider
function GlobalOrderSoundListener() {
  const { data: incomingOrdersData } = useGetIncomingOrdersQuery(undefined, {
    pollingInterval: 5000, // Poll every 5 seconds
  });
  const player = useAudioPlayer(require("../assets/sound/order_sound.mp3"));
  const intervalRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Subscribe to global sound pause state
  useEffect(() => {
    const unsubscribe = subscribeToSoundPauseState(setIsPaused);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Extract orders from the API response
    // The API returns { orders: [...], date_range: {...}, total: number }
    const orders = (incomingOrdersData as any)?.orders || [];
    const pendingOrders = orders.filter(
      (order: any) => order.status === "pending"
    );
    const hasPending = pendingOrders.length > 0;

    // Only play sound if there are pending orders AND sound is not paused
    if (hasPending && !isPaused && !intervalRef.current) {
      // Start looping sound
      (async () => {
        try {
          await player.seekTo(0);
          await player.play();
        } catch (e) {}
      })();
      intervalRef.current = setInterval(async () => {
        try {
          await player.seekTo(0);
          await player.play();
        } catch (e) {}
      }, 2000); // Play every 2 seconds (adjust to match your sound length)
    } else if ((!hasPending || isPaused) && intervalRef.current) {
      // Stop looping sound if no pending orders OR sound is paused
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      player.pause();
    }
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      player.pause();
    };
  }, [incomingOrdersData, player, isPaused]);

  return null;
}
