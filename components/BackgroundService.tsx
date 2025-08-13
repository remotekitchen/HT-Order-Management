import messaging from "@react-native-firebase/messaging";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform, View } from "react-native";

interface BackgroundServiceProps {
  children: React.ReactNode;
}

export default function BackgroundService({
  children,
}: BackgroundServiceProps) {
  const appState = useRef(AppState.currentState);
  const backgroundTaskRef = useRef<number | null>(null);

  // Setup notification channel for Android
  const setupNotificationChannel = async () => {
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync(
          "high_importance_channel",
          {
            name: "High Importance",
            importance: Notifications.AndroidImportance.MAX,
            sound: "order_sound.wav", // must match filename you added
            vibrationPattern: [0, 500, 500, 500],
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true, // optional
          }
        );
      } catch (error) {
        console.error(
          "❌ Background Service: Failed to create notification channel:",
          error
        );
      }
    }
  };

  useEffect(() => {
    // CRITICAL: Setup notification channel first
    setupNotificationChannel();

    // CRITICAL: Initialize global variables if they don't exist
    if (typeof (global as any).backgroundNotifications === "undefined") {
      (global as any).backgroundNotifications = [];
    }

    if (typeof (global as any).backgroundOrderReceived === "undefined") {
      (global as any).backgroundOrderReceived = false;
    }

    if (typeof (global as any).startBackgroundSoundLoop === "undefined") {
      (global as any).startBackgroundSoundLoop = false;
    }

    // Start persistent background task
    startBackgroundTask();

    // Listen for app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // CRITICAL: Set up global notification listener to catch backend responses in real-time
    if (typeof global.backgroundFCMLogs !== "undefined") {
      // Override the push method to log notifications as they arrive
      const originalPush = global.backgroundFCMLogs.push;
      global.backgroundFCMLogs.push = function (...args: any[]) {
        // Call original push method
        const result = originalPush.apply(this, args);

        // Log the new notification response immediately
        if (args.length > 0 && args[0].message) {
          try {
            const notificationData = JSON.parse(
              args[0].message.replace("📱 Background FCM received: ", "")
            );
            logBackendNotificationResponse(
              notificationData,
              "Background Service - Real-time"
            );

            // CRITICAL: Check if this is an order notification and start sound loop immediately
            if (
              notificationData.notification?.title
                ?.toLowerCase()
                .includes("order")
            ) {
              console.log(
                "🎵 Background Service: Order notification detected in real-time - starting sound loop"
              );
              (global as any).backgroundOrderReceived = true;
              (global as any).startBackgroundSoundLoop = true;

              // Start sound loop immediately
              if (!(global as any).backgroundSoundInterval) {
                startBackgroundSoundLoop();
              }
            }
          } catch (error) {
            console.log(
              "❌ Background Service: Failed to parse real-time notification:",
              error
            );
          }
        }

        return result;
      };

      console.log(
        "✅ Background Service: Real-time notification logging enabled"
      );
    }

    // CRITICAL: Set up periodic check for new notifications (fallback)
    const notificationCheckInterval = setInterval(() => {
      checkForNewNotifications();
    }, 5000); // Check every 5 seconds

    // CRITICAL: Set up direct FCM message handler for immediate response
    setupDirectFCMHandler();

    // Cleanup interval on unmount
    return () => {
      console.log("🛑 Background Service: Cleaning up...");
      subscription?.remove();
      stopBackgroundTask();
      clearInterval(notificationCheckInterval);
    };
  }, []);

  const checkForNewNotifications = () => {
    try {
      console.log("🔍 Background Service: Checking for new notifications...");

      // CRITICAL: Check global flags first
      if (
        (global as any).startBackgroundSoundLoop &&
        !(global as any).backgroundSoundInterval
      ) {
        console.log(
          "🎵 Background Service: Periodic check found global flag - starting sound loop"
        );
        startBackgroundSoundLoop();
        return;
      }

      // Check if we have new background notifications that need processing
      if (
        (global as any).backgroundNotifications &&
        (global as any).backgroundNotifications.length > 0
      ) {
        const hasUnprocessedNotifications = (
          global as any
        ).backgroundNotifications.some((n: any) => !n.processed);

        if (
          hasUnprocessedNotifications &&
          !(global as any).backgroundSoundInterval
        ) {
          startBackgroundSoundLoop();
          return;
        }
      }

      // CRITICAL: Also check if we need to start sound loop based on global flags
      if (
        (global as any).backgroundOrderReceived &&
        !(global as any).backgroundSoundInterval
      ) {
        startBackgroundSoundLoop();
        return;
      }
    } catch (error) {
      console.error(
        "❌ Background Service: Error in periodic notification check:",
        error
      );
    }
  };

  const setupDirectFCMHandler = async () => {
    try {
      const messagingModule = await import("@react-native-firebase/messaging");
      if (messagingModule.default) {
        messagingModule.default().onMessage((remoteMessage: any) => {
          // Check if this is an order notification
          if (
            remoteMessage.notification?.title?.toLowerCase().includes("order")
          ) {
            (global as any).backgroundOrderReceived = true;
            (global as any).startBackgroundSoundLoop = true;

            // Start sound loop immediately
            if (!(global as any).backgroundSoundInterval) {
              startBackgroundSoundLoop();
            }
          }
        });
        // console.log removed
      }
    } catch (error) {
      console.error(
        "⚠️ Background Service: Could not set up direct FCM handler:",
        error
      );
    }
  };

  const startBackgroundTask = async () => {
    try {
      // Register background fetch task for Expo managed workflow
      await registerBackgroundFetchTask();

      // Start background fetch
      await BackgroundFetch.registerTaskAsync("background-fcm-task", {
        minimumInterval: 15, // Minimum 15 seconds (iOS limitation)
        stopOnTerminate: false, // Continue after app is closed
        startOnBoot: true, // Start after device restart
      });

      // console.log removed
    } catch (error) {
      console.error(
        "⚠️ Background Service: Background fetch not available, using JS fallback"
      );
    }

    // Create a persistent interval that keeps the app alive (fallback)
    backgroundTaskRef.current = setInterval(() => {
      // This keeps the JavaScript thread alive
      const timestamp = new Date().toISOString();

      // Check FCM connection status
      checkFCMStatus();

      // Check if we have any pending notifications
      checkPendingNotifications();

      // CRITICAL: Check for background notifications that need sound loop
      if (
        (global as any).backgroundNotifications &&
        (global as any).backgroundNotifications.length > 0
      ) {
        const hasUnprocessedNotifications = (
          global as any
        ).backgroundNotifications.some((n: any) => !n.processed);

        if (
          hasUnprocessedNotifications &&
          !(global as any).backgroundSoundInterval
        ) {
          startBackgroundSoundLoop();
        }
      }

      // CRITICAL: Force start sound loop if flags are set but no interval
      if (
        (global as any).startBackgroundSoundLoop &&
        !(global as any).backgroundSoundInterval
      ) {
        startBackgroundSoundLoop();
      }

      // CRITICAL: Also check backgroundOrderReceived flag
      if (
        (global as any).backgroundOrderReceived &&
        !(global as any).backgroundSoundInterval
      ) {
        startBackgroundSoundLoop();
      }
    }, 30000); // Every 30 seconds

    // console.log removed
  };

  const stopBackgroundTask = () => {
    if (backgroundTaskRef.current) {
      clearInterval(backgroundTaskRef.current);
      backgroundTaskRef.current = null;
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App came to foreground

      handleAppForeground();
    } else if (
      appState.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App went to background

      handleAppBackground();
    }

    appState.current = nextAppState;
  };

  const handleAppForeground = () => {
    // Refresh FCM token if needed
    refreshFCMToken();

    // Clear any background notifications
    clearBackgroundNotifications();
  };

  const handleAppBackground = () => {
    // Ensure FCM is still listening
    ensureFCMListening();

    // Start background audio service if needed
    startBackgroundAudioService();

    // CRITICAL: Check if we need to start sound loop immediately when going to background
    if (
      (global as any).backgroundOrderReceived &&
      !(global as any).backgroundSoundInterval
    ) {
      startBackgroundSoundLoop();
    }
  };

  const checkFCMStatus = async () => {
    try {
      // Check if messaging is available
      if (!messaging) {
        // console.log removed
        return;
      }

      // Check permission status
      const authStatus = await messaging().hasPermission();

      // Check if device is registered
      const isRegistered = await messaging()
        .isDeviceRegisteredForRemoteMessages;

      // Try to get current token
      try {
        const currentToken = await messaging().getToken();
        if (currentToken) {
          // console.log removed
          console.log("🔑 Background Service: FCM Token:", currentToken);
        } else {
          // console.log removed
        }
      } catch (tokenError) {
        // console.log removed
      }
    } catch (error) {
      // console.log removed
    }
  };

  const refreshFCMToken = async () => {
    try {
      const newToken = await messaging().getToken();
      if (newToken) {
        // console.log removed
        // TODO: Send new token to your backend
      }
    } catch (error) {
      // console.log removed
    }
  };

  const ensureFCMListening = () => {
    // The background message handler is already set up in fcm.ts
    // This just ensures it's working
    // console.log removed
  };

  const startBackgroundAudioService = async () => {
    try {
      // Initialize audio session for background
      // Note: expo-av is not imported to avoid linter errors
      // Audio functionality will still work through FCM background handler
      // console.log removed
    } catch (error) {
      console.log(
        "❌ Background Service: Background audio service error:",
        error
      );
    }
  };

  // Function to log backend notification response in real-time
  const logBackendNotificationResponse = (
    notificationData: any,
    source: string = "Background Service"
  ) => {
    try {
      console.log(`🎯 ${source}: NEW BACKEND NOTIFICATION RECEIVED!`);
      console.log("=".repeat(80));
      console.log(
        `${source}: Full Notification Payload:`,
        JSON.stringify(notificationData, null, 2)
      );
      console.log("=".repeat(80));

      // Log notification section
      if (notificationData.notification) {
        console.log(`📢 ${source}: NOTIFICATION SECTION:`);
        console.log(
          `  - Title: ${notificationData.notification.title || "❌ MISSING"}`
        );
        console.log(
          `  - Body: ${notificationData.notification.body || "❌ MISSING"}`
        );
        console.log(
          `  - Sound: ${
            (notificationData.notification as any)?.sound || "❌ MISSING"
          }`
        );
        console.log(
          `  - Icon: ${notificationData.notification.icon || "❌ MISSING"}`
        );
        console.log(
          `  - Image: ${notificationData.notification.image || "❌ MISSING"}`
        );
      }

      // Log data section
      if (notificationData.data) {
        console.log(`📊 ${source}: DATA SECTION:`);
        Object.entries(notificationData.data).forEach(([key, value]) => {
          // console.log removed
        });
      }

      // Log Android specific
      if ((notificationData as any).android) {
        console.log(`🤖 ${source}: ANDROID SECTION:`);
        if ((notificationData as any).android.notification) {
          console.log(
            `  - Channel ID: ${
              (notificationData as any).android.notification.channelId ||
              "❌ MISSING"
            }`
          );
          console.log(
            `  - Sound: ${
              (notificationData as any).android.notification.sound ||
              "❌ MISSING"
            }`
          );
          console.log(
            `  - Priority: ${
              (notificationData as any).android.notification.priority ||
              "❌ MISSING"
            }`
          );
        }
      }

      // Log iOS specific
      if ((notificationData as any).apns) {
        console.log(`🍎 ${source}: iOS SECTION:`);
        if ((notificationData as any).apns.payload?.aps) {
          console.log(
            `  - Sound: ${
              (notificationData as any).apns.payload.aps.sound || "❌ MISSING"
            }`
          );
          console.log(
            `  - Badge: ${
              (notificationData as any).apns.payload.aps.badge || "❌ MISSING"
            }`
          );
        }
      }

      // Log message metadata
      console.log(`📋 ${source}: MESSAGE METADATA:`);
      console.log(
        `  - Message ID: ${notificationData.messageId || "❌ MISSING"}`
      );
      console.log(
        `  - From: ${(notificationData as any).from || "❌ MISSING"}`
      );
      console.log(
        `  - Priority: ${(notificationData as any).priority || "❌ MISSING"}`
      );
      console.log(`  - TTL: ${(notificationData as any).ttl || "❌ MISSING"}`);

      // Log timestamp
      console.log(`⏰ ${source}: Received at: ${new Date().toISOString()}`);
      console.log("=".repeat(80));
    } catch (error) {
      console.error(
        `❌ ${source}: Error logging notification response:`,
        error
      );
    }
  };

  const checkPendingNotifications = async () => {
    try {
      console.log(
        "🔍 Background Service: Checking for pending notifications..."
      );

      // Check if we have any stored background FCM logs
      if (global.backgroundFCMLogs && global.backgroundFCMLogs.length > 0) {
        console.log(
          `📱 Background Service: Found ${global.backgroundFCMLogs.length} background notifications`
        );

        // Process any unhandled notifications
        global.backgroundFCMLogs.forEach((log, index) => {
          console.log(
            `📋 Background Service: Processing notification ${index + 1}:`,
            log.message.substring(0, 100) + "..."
          );

          // CRITICAL: Log the full backend notification response
          try {
            const notificationData = JSON.parse(
              log.message.replace("📱 Background FCM received: ", "")
            );
            console.log(
              `🎯 Background Service: FULL BACKEND RESPONSE for notification ${
                index + 1
              }:`
            );
            console.log("=".repeat(80));
            console.log(
              "📱 Background Service: Notification Data:",
              JSON.stringify(notificationData, null, 2)
            );
            console.log("=".repeat(80));

            // Log specific fields for easy reading
            if (notificationData.notification) {
              console.log(
                `📢 Background Service: Title: ${
                  notificationData.notification.title || "N/A"
                }`
              );
              console.log(
                `📢 Background Service: Body: ${
                  notificationData.notification.body || "N/A"
                }`
              );
              console.log(
                `📢 Background Service: Sound: ${
                  (notificationData.notification as any)?.sound || "N/A"
                }`
              );
            }

            if (notificationData.data) {
              console.log(
                `📊 Background Service: Data fields:`,
                Object.keys(notificationData.data)
              );
              Object.entries(notificationData.data).forEach(([key, value]) => {
                console.log(`📊 Background Service: ${key}: ${value}`);
              });
            }

            // console.log removed
            console.log("=".repeat(80));
          } catch (parseError) {
            console.log(
              `❌ Background Service: Failed to parse notification ${
                index + 1
              }:`,
              parseError
            );
            console.log(`📱 Background Service: Raw message:`, log.message);
          }
        });
      } else {
        console.log("📱 Background Service: No pending notifications found");
      }

      // CRITICAL: Check if background sound loop should be started
      if ((global as any).startBackgroundSoundLoop) {
        console.log("🎵 Background Service: Starting background sound loop...");
        console.log("🔍 Background Service: Global flags status:");
        console.log(
          "  - backgroundOrderReceived:",
          (global as any).backgroundOrderReceived
        );
        console.log("  - orderChecked:", (global as any).orderChecked);
        console.log(
          "  - startBackgroundSoundLoop:",
          (global as any).startBackgroundSoundLoop
        );
        await startBackgroundSoundLoop();
      }

      // CRITICAL: Check for new background notifications that need processing
      if (
        (global as any).backgroundNotifications &&
        (global as any).backgroundNotifications.length > 0
      ) {
        console.log(
          `🎯 Background Service: Found ${
            (global as any).backgroundNotifications.length
          } background notifications to process`
        );

        // Process unprocessed notifications
        (global as any).backgroundNotifications.forEach(
          (notification: any, index: number) => {
            if (!notification.processed) {
              console.log(
                `🎵 Background Service: Processing notification ${
                  index + 1
                } for sound loop`
              );
              notification.processed = true;

              // CRITICAL: Start sound loop immediately for this notification
              if (!(global as any).backgroundSoundInterval) {
                console.log(
                  "🎵 Background Service: Starting sound loop for new notification"
                );
                startBackgroundSoundLoop();
              } else {
                console.log(
                  "🎵 Background Service: Sound loop already running"
                );
              }
            }
          }
        );
      }

      // CRITICAL: Also check if we need to start sound loop based on global flags
      if (
        (global as any).startBackgroundSoundLoop &&
        !(global as any).backgroundSoundInterval
      ) {
        console.log(
          "🎵 Background Service: Global flag detected - starting sound loop"
        );
        startBackgroundSoundLoop();
      }
    } catch (error) {
      console.log(
        "❌ Background Service: Check pending notifications error:",
        error
      );
    }
  };

  const startBackgroundSoundLoop = async () => {
    try {
      console.log(
        "🎵 Background Service: Starting persistent background sound loop..."
      );

      // Use the new repeating sound functionality
      try {
        const { startRepeatingSound } = await import(
          "../utils/backgroundAudioService"
        );
        const success = await startRepeatingSound();

        if (success) {
          console.log(
            "✅ Background Service: Repeating sound started successfully"
          );
          // Set a flag to track that we're using the new sound system
          (global as any).usingNewSoundSystem = true;
        } else {
          console.log(
            "⚠️ Background Service: Failed to start repeating sound, falling back to old system"
          );
          // Fallback to old system if new one fails
          await startOldSoundLoop();
        }
      } catch (error) {
        console.log(
          "⚠️ Background Service: New sound system failed, falling back to old system:",
          error
        );
        await startOldSoundLoop();
      }
    } catch (error) {
      console.log(
        "❌ Background Service: Failed to start background sound loop:",
        error
      );
    }
  };

  // Fallback to old sound loop system
  const startOldSoundLoop = async () => {
    try {
      console.log("🔄 Background Service: Starting fallback sound loop...");

      if (!(global as any).backgroundSoundInterval) {
        (global as any).backgroundSoundInterval = setInterval(async () => {
          try {
            // Debug logging for sound loop
            console.log(
              "🎵 Background Service: Fallback sound loop tick - checking conditions:"
            );
            console.log(
              "  - backgroundOrderReceived:",
              (global as any).backgroundOrderReceived
            );
            console.log("  - orderChecked:", (global as any).orderChecked);
            console.log(
              "  - backgroundNotifications count:",
              (global as any).backgroundNotifications?.length || 0
            );

            // Check if we should continue playing sound
            if ((global as any).backgroundOrderReceived) {
              console.log(
                "🎵 Background Service: Playing order sound in background (fallback)..."
              );

              // Trigger the order sound
              const { triggerOrderSound } = await import(
                "../utils/orderSoundManager"
              );
              if (triggerOrderSound) {
                triggerOrderSound();
              }
            }

            // CRITICAL: Also check for background notifications that need sound
            if (
              (global as any).backgroundNotifications &&
              (global as any).backgroundNotifications.length > 0
            ) {
              const hasUnprocessedNotifications = (
                global as any
              ).backgroundNotifications.some((n: any) => !n.processed);

              if (hasUnprocessedNotifications) {
                console.log(
                  "🎵 Background Service: Playing sound for unprocessed background notifications (fallback)..."
                );

                // Trigger the order sound
                const { triggerOrderSound } = await import(
                  "../utils/orderSoundManager"
                );
                if (triggerOrderSound) {
                  triggerOrderSound();
                }
              }
            }
          } catch (error) {
            console.log(
              "❌ Background Service: Error in fallback sound loop:",
              error
            );
          }
        }, 30000); // Wait 30 seconds (slightly longer than sound duration) to ensure full playback

        // console.log removed
      }
    } catch (error) {
      console.log(
        "❌ Background Service: Failed to start fallback sound loop:",
        error
      );
    }
  };

  // CRITICAL: Make the function globally available so FCM handler can call it
  (global as any).startBackgroundSoundLoop = startBackgroundSoundLoop;

  const clearBackgroundNotifications = async () => {
    try {
      console.log(
        "🧹 Background Service: Clearing background notifications..."
      );

      // Clear the background logs when app comes to foreground
      if (global.backgroundFCMLogs) {
        global.backgroundFCMLogs = [];
        // console.log removed
      }

      // CRITICAL: Stop background sound loop when app comes to foreground
      if ((global as any).backgroundSoundInterval) {
        clearInterval((global as any).backgroundSoundInterval);
        (global as any).backgroundSoundInterval = null;
        // console.log removed
      }

      // Stop the repeating sound (new system)
      if ((global as any).usingNewSoundSystem) {
        try {
          const { stopRepeatingSound } = await import(
            "../utils/backgroundAudioService"
          );
          await stopRepeatingSound();
          console.log(
            "✅ Background Service: Repeating sound stopped (new system)"
          );
          (global as any).usingNewSoundSystem = false;
        } catch (error) {
          console.log(
            "⚠️ Background Service: Could not stop repeating sound (new system):",
            error
          );
        }
      }

      // Reset background order flags
      (global as any).backgroundOrderReceived = false;
      (global as any).startBackgroundSoundLoop = false;

      // CRITICAL: Mark all background notifications as processed
      if ((global as any).backgroundNotifications) {
        (global as any).backgroundNotifications.forEach((notification: any) => {
          notification.processed = true;
        });
        console.log(
          "✅ Background Service: All background notifications marked as processed"
        );
      }

      // console.log removed
    } catch (error) {
      // console.log removed
    }
  };

  const registerBackgroundFetchTask = async () => {
    try {
      // Define the background task
      TaskManager.defineTask("background-fcm-task", async () => {
        console.log("🔄 Background Service: Background fetch task executed");

        try {
          // Check FCM status in background
          await checkFCMStatus();

          // Check for pending notifications
          await checkPendingNotifications();

          // Return success
          return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
          console.log(
            "❌ Background Service: Background fetch task error:",
            error
          );
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      // console.log removed
    } catch (error) {
      console.log(
        "❌ Background Service: Failed to define background fetch task:",
        error
      );
    }
  };

  return <View style={{ flex: 1 }}>{children}</View>;
}
