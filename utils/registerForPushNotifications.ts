// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";

// export async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== "granted") {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }
//   return token;
// }

import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import { Alert, PermissionsAndroid, Platform } from "react-native";

/**
 * Requests notification permissions (iOS + Android 13+),
 * registers the device with FCM, and returns the FCM token.
 * (Must run on a dev client build, not Expo Go.)
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  try {
    if (!Device.isDevice) {
      Alert.alert("Push Notifications", "Must use a physical device.");
      return null;
    }

    // iOS: ask for permission (Authorized or Provisional are OK)
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert("Push Notifications", "Permission not granted on iOS.");
        return null;
      }
    }

    // Android 13+ : runtime POST_NOTIFICATIONS permission
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        // newer RN types may not include this const; ignore TS if needed
        // @ts-ignore
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Push Notifications", "Permission not granted on Android.");
        return null;
      }
    }

    // Ensure this device is registered for remote messages (FCM)
    await messaging().registerDeviceForRemoteMessages();

    // ✅ Get the FCM token
    const token = await messaging().getToken();
    if (!token) {
      Alert.alert("Push Notifications", "Failed to get FCM token.");
      return null;
    }

    // Optional: listen for token refreshes
    messaging().onTokenRefresh((newToken) => {
      console.log("♻️ FCM token refreshed:", newToken);
      // TODO: send newToken to your backend if you persist tokens
    });

    console.log("📲 FCM token:", token);
    return token;
  } catch (err) {
    console.error("registerForPushNotificationsAsync error:", err);
    Alert.alert("Push Notifications", "Unexpected error while getting token.");
    return null;
  }
}
