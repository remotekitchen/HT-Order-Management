import { useCreatePushNotificationTokenMutation } from "@/redux/feature/pushNotification/pushNotificationApi";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/feature/authentication/authenticationSlice";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";

// Define types based on your authentication structure
interface UserInfo {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface NotificationContextType {
  fcmToken: string | null;
  notification: any;
  error: any;
  handleNotificationNavigation: (data: NotificationData) => void;
}

interface NotificationData {
  screen?: string;
  id?: string | number;
  click_action?: string;
  [key: string]: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  // console.log(fcmToken, "get-fcm token");
  const [notification, setNotification] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const user = useSelector(selectUser) as UserInfo | undefined;
  const router = useRouter();

  const [createPushNotificationToken] =
    useCreatePushNotificationTokenMutation();

  // Helper function to handle notification routing
  const handleNotificationNavigation = (data: NotificationData) => {
    if (data?.screen && data?.id) {
      console.log(`Navigating to: ${data.screen}/${data.id}`);
      router.push(`/${data.screen}/${data.id}` as any);
    } else if (data?.screen) {
      console.log(`Navigating to: ${data.screen}`);
      router.push(`/${data.screen}` as any);
    } else if (data?.click_action) {
      // Handle web URLs or other actions as needed
      console.log(`External URL: ${data.click_action}`);
      // You might want to open this in a webview or external browser
    }
  };

  // ✅ Register push notification token
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      async (token) => {
        if (token) {
          setFcmToken(token);
          if (user?.id) {
            try {
              const response = await createPushNotificationToken({
                token,
                user: user.id,
                device_type: "android",
              }).unwrap();
              // console.log(
              //   JSON.stringify(response, null, 2),
              //   "get-responseeeee"
              // );
              console.log("FCM Token successfully sent to the backend", token);
            } catch (err) {
              console.error("Error sending FCM token to the backend:", err);
            }
          }
        }
      },
      (err) => setError(err)
    );

    // ✅ Handle foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log(
          "FCM Notification Received (Foreground): ",
          JSON.stringify(remoteMessage, null, 2)
        );
        setNotification(remoteMessage);
        // Alert.alert("New Notification", remoteMessage.notification?.title);
      }
    );

    // ✅ Handle background notification clicks
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
          "Notification opened from background:",
          JSON.stringify(remoteMessage, null, 2)
        );

        // Handle navigation based on data
        if (remoteMessage?.data) {
          handleNotificationNavigation(remoteMessage.data);
        }
      });

    // ✅ Check if the app was opened from a notification (quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification opened from quit state:", remoteMessage);

          // Handle navigation based on data
          if (remoteMessage?.data) {
            handleNotificationNavigation(remoteMessage.data);
          }
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, [fcmToken, user]);

  // ✅ Handle Background & Quit-State Messages
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "📩 Background Notification Received:",
        JSON.stringify(remoteMessage, null, 2)
      );

      // ✅ Show local notification manually (Fix for notifications not appearing when app is closed)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || "New Notification",
          body: remoteMessage.notification?.body || "You have a new message",
          sound: true,
          data: remoteMessage.data,
        },
        trigger: null, // Show immediately
      });
    });

    // Handle local notification clicks (for notifications we manually schedule)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Local notification clicked with data:", data);

        // Handle navigation
        if (data) {
          handleNotificationNavigation(data);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // ✅ Check and alert if notifications are blocked
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== "granted") {
        const { status: requestStatus } =
          await Notifications.requestPermissionsAsync();
        if (requestStatus !== "granted") {
          // Show alert with 'Go to Setting' button
          Alert.alert(
            "📵 Notifications are disabled",
            "Please enable them in your device settings to stay updated.",
            [
              {
                text: "Go to Setting",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
        }
      }
    };

    checkNotificationPermission();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        fcmToken,
        notification,
        error,
        // Expose the navigation handler in case you want to trigger it manually
        handleNotificationNavigation,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
