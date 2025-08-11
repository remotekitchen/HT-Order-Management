// utils/fcm.ts
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import { Alert, PermissionsAndroid, Platform } from "react-native";
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
    console.log("🚀 Starting FCM registration...");

    // Initialize Firebase first
    const firebaseInitialized = initializeFirebase();
    if (!firebaseInitialized) {
      const message = "Firebase not initialized. Check your configuration.";
      console.error("❌ FCM:", message);
      Alert.alert("Firebase Error", message);
      return null;
    }

    if (!Device.isDevice) {
      const message = "Must use a physical device for FCM.";
      console.warn("⚠️ FCM:", message);
      Alert.alert("Push Notifications", message);
      return null;
    }

    console.log("📱 Device check passed, proceeding with permissions...");

    // iOS: request notification permission
    if (Platform.OS === "ios") {
      console.log("🍎 Requesting iOS notification permission...");
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log("🍎 iOS permission status:", authStatus);

      if (!enabled) {
        const message = "Permission not granted on iOS.";
        console.warn("⚠️ FCM:", message);
        Alert.alert("Push Notifications", message);
        return null;
      }
      console.log("✅ iOS permission granted");
    }

    // Android 13+ : POST_NOTIFICATIONS runtime permission
    if (Platform.OS === "android" && Platform.Version >= 33) {
      console.log("🤖 Requesting Android POST_NOTIFICATIONS permission...");
      const granted = await PermissionsAndroid.request(
        // @ts-ignore - some RN types don't include this yet
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log("🤖 Android permission result:", granted);

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        const message = "Permission not granted on Android.";
        console.warn("⚠️ FCM:", message);
        Alert.alert("Push Notifications", message);
        return null;
      }
      console.log("✅ Android permission granted");
    }

    console.log("🔧 Registering device for remote messages...");

    // Ensure registration with FCM
    await messaging().registerDeviceForRemoteMessages();
    console.log("✅ Device registered for remote messages");

    console.log("🎯 Getting FCM token...");

    // ✅ Get FCM token
    const token = await messaging().getToken();
    console.log("🎯 Raw FCM token response:", token);

    if (!token) {
      const message = "Failed to get FCM token - token is null/undefined.";
      console.error("❌ FCM:", message);
      Alert.alert("Push Notifications", message);
      return null;
    }

    // ✅ SUCCESS! Show token in console and alert
    console.log("🎉 SUCCESS! FCM token retrieved:");
    console.log("📱 FCM Token:", token);
    console.log("🔑 Token length:", token.length);
    console.log("📋 Token preview:", token.substring(0, 20) + "...");

    // Show success alert with token preview
    Alert.alert(
      "🎉 FCM Token Retrieved!",
      `Token: ${token.substring(0, 20)}...\n\nCheck console for full token.`,
      [{ text: "OK" }]
    );

    // Optional: listen for token refreshes
    messaging().onTokenRefresh((newToken) => {
      console.log("♻️ FCM token refreshed:", newToken);
      Alert.alert(
        "🔄 FCM Token Refreshed",
        `New token: ${newToken.substring(0, 20)}...`
      );
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
    Alert.alert("❌ FCM Error", errorMessage);
    return null;
  }
}

// Set up background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("📱 Background message received:", remoteMessage);

  // Check if this is a new order notification (flexible matching)
  const notificationTitle = remoteMessage.notification?.title;
  if (
    notificationTitle &&
    (notificationTitle === "New Order Received!" ||
      notificationTitle.includes("New Order") ||
      notificationTitle.includes("Order Received") ||
      notificationTitle.toLowerCase().includes("order"))
  ) {
    console.log("🎵 New order notification detected - triggering sound...");
    console.log("📋 Notification title:", notificationTitle);
    console.log("🔊 Custom sound should play via system notification");

    // For background notifications, the custom sound is handled by the system
    // based on the FCM payload configuration. We just need to log it.
    console.log(
      "✅ Background notification processed - custom sound will play via system"
    );
  }

  return Promise.resolve();
});

// Set up foreground message handler
messaging().onMessage(async (remoteMessage) => {
  console.log("📱 Foreground message received:", remoteMessage);

  // Check if this is a new order notification (flexible matching)
  const notificationTitle = remoteMessage.notification?.title;
  if (
    notificationTitle &&
    (notificationTitle === "New Order Received!" ||
      notificationTitle.includes("New Order") ||
      notificationTitle.includes("Order Received") ||
      notificationTitle.toLowerCase().includes("order"))
  ) {
    console.log(
      "🎵 New order notification detected in foreground - triggering sound..."
    );
    console.log("📋 Notification title:", notificationTitle);

    // For foreground notifications, we can trigger custom audio playback
    try {
      const { handleFCMOrderSound } = await import("./backgroundAudioService");
      if (handleFCMOrderSound) {
        await handleFCMOrderSound();
        console.log("✅ Order sound triggered from foreground message");
      } else {
        // Fallback to old method
        const { triggerOrderSound } = await import("./orderSoundManager");
        if (triggerOrderSound) {
          triggerOrderSound();
          console.log(
            "✅ Order sound triggered from foreground message (fallback)"
          );
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
    console.log("🔍 Checking FCM status...");

    // Check if messaging is available
    if (!messaging) {
      console.error("❌ Firebase messaging not available");
      return;
    }

    // Check current permission status
    const authStatus = await messaging().hasPermission();
    console.log("🔍 Current permission status:", authStatus);

    // Check if device is registered
    const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
    console.log("🔍 Device registered for remote messages:", isRegistered);

    // Try to get current token
    try {
      const currentToken = await messaging().getToken();
      console.log(
        "🔍 Current FCM token:",
        currentToken ? "Available" : "Not available"
      );
      if (currentToken) {
        console.log("🔍 Token preview:", currentToken.substring(0, 20) + "...");
      }
    } catch (tokenError) {
      console.error("🔍 Error getting current token:", tokenError);
    }
  } catch (error) {
    console.error("🔍 FCM status check error:", error);
  }
}
