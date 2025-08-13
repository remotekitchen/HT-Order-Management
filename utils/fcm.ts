// utils/fcm.ts
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import { PermissionsAndroid, Platform } from "react-native";
import { initializeFirebase } from "./firebase";

/**
 * Requests notification permissions (iOS + Android 13+),
 * registers the device with FCM, and returns the FCM token.
 * Must run on an EAS dev client (not Expo Go).
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  try {
    // Initialize Firebase first
    const firebaseInitialized = initializeFirebase();
    if (!firebaseInitialized) {
      const message = "Firebase not initialized. Check your configuration.";
      console.error("❌ FCM:", message);
      return null;
    }

    if (!Device.isDevice) {
      const message = "Must use a physical device for FCM.";
      console.warn("⚠️ FCM:", message);
      return null;
    }

    // iOS: request notification permission
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        const message = "Permission not granted on iOS.";
        console.warn("⚠️ FCM:", message);
        return null;
      }
    }

    // Android 13+ : POST_NOTIFICATIONS runtime permission
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        // @ts-ignore - some RN types don't include this yet
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        const message = "Permission not granted on Android.";
        console.warn("⚠️ FCM:", message);
        return null;
      }
    }

    // Ensure registration with FCM
    await messaging().registerDeviceForRemoteMessages();

    // ✅ Get FCM token
    const token = await messaging().getToken();

    if (!token) {
      const message = "Failed to get FCM token - token is null/undefined.";
      console.error("❌ FCM:", message);
      return null;
    }

    // Optional: listen for token refreshes
    messaging().onTokenRefresh((newToken) => {
      // TODO: send newToken to your backend if you persist tokens
    });

    return token;
  } catch (err: any) {
    console.error("❌ FCM registration error:", err);
    console.error("❌ Error details:", {
      message: err?.message || "Unknown error",
      code: err?.code || "No code",
      stack: err?.stack || "No stack",
    });

    const errorMessage = `FCM registration failed: ${
      err?.message || "Unknown error"
    }`;
    console.error("❌ FCM Error:", errorMessage);
    return null;
  }
}

// Set up background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Check if this is a new order notification (flexible matching)
  const notificationTitle = remoteMessage.notification?.title;
  if (
    notificationTitle &&
    (notificationTitle === "New Order Received!" ||
      notificationTitle.includes("New Order") ||
      notificationTitle.includes("Order Received") ||
      notificationTitle.toLowerCase().includes("order"))
  ) {
    // For background notifications, the custom sound is handled by the system
    // based on the FCM payload configuration.
  }

  return Promise.resolve();
});

// Set up foreground message handler
messaging().onMessage(async (remoteMessage) => {
  // Check if this is a new order notification (flexible matching)
  const notificationTitle = remoteMessage.notification?.title;
  if (
    notificationTitle &&
    (notificationTitle === "New Order Received!" ||
      notificationTitle.includes("New Order") ||
      notificationTitle.includes("Order Received") ||
      notificationTitle.toLowerCase().includes("order"))
  ) {
    // For foreground notifications, we can trigger custom audio playback
    try {
      const { handleFCMOrderSound } = await import("./backgroundAudioService");
      if (handleFCMOrderSound) {
        await handleFCMOrderSound();
      } else {
        // Fallback to old method
        const { triggerOrderSound } = await import("./orderSoundManager");
        if (triggerOrderSound) {
          triggerOrderSound();
        }
      }
    } catch (error) {
      console.error("❌ Error triggering order sound from foreground:", error);
    }
  }
});

// Additional utility function to manually check FCM status
export async function checkFCMStatus(): Promise<void> {
  try {
    // Check if messaging is available
    if (!messaging) {
      console.error("❌ Firebase messaging not available");
      return;
    }

    // Check current permission status
    const authStatus = await messaging().hasPermission();

    // Check if device is registered
    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;

    // Try to get current token
    try {
      const currentToken = await messaging().getToken();
    } catch (tokenError) {
      console.error("🔍 Error getting current token:", tokenError);
    }
  } catch (error) {
    console.error("🔍 FCM status check error:", error);
  }
}
