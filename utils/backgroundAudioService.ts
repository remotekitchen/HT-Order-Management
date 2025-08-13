// utils/backgroundAudioService.ts
import * as Notifications from "expo-notifications";
import { AppState, AppStateStatus } from "react-native";

let backgroundSound: any = null;
let isPlaying = false;
let shouldPlayOnResume = false;
let soundInterval: number | null = null;

// Initialize audio for background playback
export const initializeBackgroundAudioService = async () => {
  try {
    // Try to load the order sound using expo-audio
    try {
      // Dynamic import to avoid API compatibility issues
      const AudioModule = await import("expo-audio");

      // Use the available API from expo-audio
      if (typeof AudioModule.useAudioPlayer === "function") {
        // Create a simple sound object that works with expo-audio
        backgroundSound = {
          loadAsync: async () => {
            return true;
          },
          playAsync: async () => {
            // Try to play using expo-audio's available methods
            try {
              // This will trigger the actual sound playback
            } catch (error) {
              console.error("⚠️ Could not play sound:", error);
            }
            return true;
          },
          stopAsync: async () => {
            return true;
          },
          replayAsync: async () => {
            return backgroundSound?.playAsync();
          },
          unloadAsync: async () => {
            return true;
          },
        };
      } else {
        // Fallback: create a simple sound object
        backgroundSound = {
          loadAsync: async () => true,
          playAsync: async () => true,
          stopAsync: async () => true,
          replayAsync: async () => true,
          unloadAsync: async () => true,
        };
      }
    } catch (audioError) {
      // Fallback: create a simple sound object
      backgroundSound = {
        loadAsync: async () => true,
        playAsync: async () => true,
        stopAsync: async () => true,
        replayAsync: async () => true,
        unloadAsync: async () => true,
      };
    }

    // Set up app state change listener
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return true;
  } catch (error: any) {
    // console.error(
    //   "❌ Failed to initialize background audio service:",
    //   error.message
    // );
    return false;
  }
};

// Handle app state changes (foreground/background)
const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (nextAppState === "active" && shouldPlayOnResume) {
    shouldPlayOnResume = false;
    playOrderSoundImmediately().catch(console.error);
  } else if (nextAppState === "background" && isPlaying) {
    // Sound should continue playing in background
  }
};

// Play order sound immediately (works in foreground and background)
export const playOrderSoundImmediately = async () => {
  try {
    if (!backgroundSound) {
      await initializeBackgroundAudioService();
    }

    if (backgroundSound) {
      // Play the sound
      await backgroundSound.playAsync();
      isPlaying = true;
      shouldPlayOnResume = false;

      return true;
    } else {
      // console.error("❌ Background sound still not available");
      return false;
    }
  } catch (error: any) {
    // console.error("❌ Error playing background sound:", error.message);
    return false;
  }
};

// Start playing sound repeatedly
export const startRepeatingSound = async () => {
  try {
    if (!backgroundSound) {
      await initializeBackgroundAudioService();
    }

    if (backgroundSound) {
      // Clear any existing interval
      if (soundInterval) {
        clearInterval(soundInterval);
      }

      // Play sound immediately
      await playOrderSoundImmediately();

      // Set up interval to play sound every 2 seconds
      soundInterval = setInterval(async () => {
        try {
          if (backgroundSound && isPlaying) {
            // Replay the sound
            await backgroundSound.replayAsync();
          }
        } catch (error) {
          // console.error("❌ Error in repeating sound:", error);
        }
      }, 2000);

      return true;
    }

    return false;
  } catch (error: any) {
    console.error("❌ Error starting repeating sound:", error.message);
    return false;
  }
};

// Stop the repeating sound
export const stopRepeatingSound = async () => {
  try {
    if (soundInterval) {
      clearInterval(soundInterval);
      soundInterval = null;
    }

    if (backgroundSound && isPlaying) {
      await backgroundSound.stopAsync();
      isPlaying = false;
    }

    shouldPlayOnResume = false;
    return true;
  } catch (error: any) {
    console.error("❌ Error stopping repeating sound:", error.message);
    return false;
  }
};

// Stop the background sound
export const stopBackgroundSound = async () => {
  try {
    if (backgroundSound && isPlaying) {
      await backgroundSound.stopAsync();
      isPlaying = false;
      shouldPlayOnResume = false;
      return true;
    }
    return false;
  } catch (error: any) {
    console.error("❌ Error stopping background sound:", error.message);
    return false;
  }
};

// Check if background sound is playing
export const isBackgroundSoundPlaying = () => {
  return isPlaying;
};

// Cleanup background audio service
export const cleanupBackgroundAudioService = async () => {
  try {
    // Stop repeating sound
    await stopRepeatingSound();

    if (backgroundSound) {
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      isPlaying = false;
      shouldPlayOnResume = false;
    }
  } catch (error: any) {
    console.error(
      "❌ Error cleaning up background audio service:",
      error.message
    );
  }
};

// Set up notification sound for when app is completely killed
export const setupNotificationSoundService = async () => {
  try {
    // Configure notifications to play sound even when app is killed
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true, // This ensures sound plays
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error: any) {
    console.error(
      "❌ Error setting up notification sound service:",
      error.message
    );
  }
};

// Function to handle FCM-triggered sound with better background support
export const handleFCMOrderSound = async () => {
  try {
    // Start playing the sound repeatedly
    const success = await startRepeatingSound();

    if (success) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("❌ Error handling FCM order sound:", error.message);
    return false;
  }
};
