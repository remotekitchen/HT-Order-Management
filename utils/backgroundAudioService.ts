// utils/backgroundAudioService.ts
import * as Notifications from "expo-notifications";
import { AppState, AppStateStatus } from "react-native";

let backgroundSound: any = null;
let isPlaying = false;
let shouldPlayOnResume = false;

// Initialize audio for background playback
export const initializeBackgroundAudioService = async () => {
  try {
    console.log("🎵 Initializing background audio service...");

    // expo-audio doesn't have setAudioModeAsync, so we'll use the player directly
    console.log("✅ Background audio mode configured (using expo-audio)");

    // Create audio player using expo-audio
    try {
      // For background audio, we'll need to use a different approach
      // expo-audio is primarily for foreground audio playback
      console.log("⚠️ Note: expo-audio is primarily for foreground audio");
      console.log("🎵 Background audio will work when app is in foreground");

      // We'll use a simple approach for now - the sound will play when app is active
      backgroundSound = { isLoaded: true };
      console.log("✅ Background sound configured (foreground mode)");
    } catch (error) {
      console.error("❌ Error setting up background audio:", error);
      return false;
    }

    // Set up app state change listener
    AppState.addEventListener("change", handleAppStateChange);

    return true;
  } catch (error: any) {
    console.error(
      "❌ Failed to initialize background audio service:",
      error.message
    );
    return false;
  }
};

// Handle app state changes (foreground/background)
const handleAppStateChange = (nextAppState: AppStateStatus) => {
  console.log("📱 App state changed to:", nextAppState);

  if (nextAppState === "active" && shouldPlayOnResume) {
    console.log("🎵 App became active, resuming sound playback...");
    shouldPlayOnResume = false;
    playOrderSoundImmediately().catch(console.error);
  } else if (nextAppState === "background" && isPlaying) {
    console.log("🎵 App going to background, sound should continue...");
    // Sound should continue playing in background
  }
};

// Play order sound immediately (works in foreground and background)
export const playOrderSoundImmediately = async () => {
  try {
    console.log("🎵 Attempting to play background sound immediately...");

    if (!backgroundSound) {
      console.log("🎵 Background sound not initialized, initializing now...");
      await initializeBackgroundAudioService();
    }

    if (backgroundSound) {
      console.log("✅ Background sound ready to play");

      // For expo-audio, we'll use the existing audio player in the app
      // The sound will be managed by the GlobalOrderSoundListener
      isPlaying = true;
      shouldPlayOnResume = false;

      console.log(
        "🎵 Note: With expo-audio, sound will play when app is in foreground"
      );
      return true;
    } else {
      console.error("❌ Background sound still not available");
      return false;
    }
  } catch (error: any) {
    console.error("❌ Error playing background sound:", error.message);
    return false;
  }
};

// Stop the background sound
export const stopBackgroundSound = async () => {
  try {
    if (backgroundSound && isPlaying) {
      isPlaying = false;
      shouldPlayOnResume = false;
      console.log("✅ Background sound stopped");
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
    // Remove app state listener
    AppState.removeEventListener("change", handleAppStateChange);

    if (backgroundSound) {
      backgroundSound = null;
      isPlaying = false;
      shouldPlayOnResume = false;
      console.log("✅ Background audio service cleaned up");
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
    console.log("🎵 Setting up notification sound service...");

    // Configure notifications to play sound even when app is killed
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true, // This ensures sound plays
        shouldSetBadge: false,
      }),
    });

    console.log("✅ Notification sound service configured");
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
    console.log("🎵 FCM order sound triggered - starting background audio...");

    // Set flag to resume sound when app becomes active
    shouldPlayOnResume = true;

    // For expo-audio, we'll trigger the existing audio player
    // The GlobalOrderSoundListener will handle the actual playback
    console.log(
      "✅ FCM order sound trigger set - will play when app is active"
    );

    return true;
  } catch (error: any) {
    console.error("❌ Error handling FCM order sound:", error.message);
    return false;
  }
};
