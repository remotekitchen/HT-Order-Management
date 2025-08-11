import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

const FCM_TOKEN_KEY = "FCM_TOKEN";

export async function registerForPushNotificationsAsync() {
  // Request permission for notifications
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    throw new Error("Permission not granted for notifications!");
  }

  try {
    // Get the FCM token
    const fcmToken = await messaging().getToken();
    if (!fcmToken) {
      throw new Error("Failed to get FCM token!");
    }

    // console.log("FCM Tokenn: ", fcmToken);

    // Get the existing token from AsyncStorage
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

    if (storedToken !== fcmToken) {
      await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
      console.log("FCM Token updated in AsyncStorage.", fcmToken);

      // ✅ show alert
      // Alert.alert("FCM Token Updated", fcmToken);
    } else {
      console.log("FCM Token is the same, no update needed.", fcmToken);

      // ✅ still show the token
      // Alert.alert("FCM Token", fcmToken);
    }

    return fcmToken;
  } catch (error) {
    throw new Error("Error getting FCM token: " + error);
  }
}
