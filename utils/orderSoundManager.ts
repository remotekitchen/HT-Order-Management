import { useEffect, useState } from "react";

interface Order {
  id: number;
  status: string;
  [key: string]: any;
}

// Global sound control state
let globalSoundPaused = false;
let globalSoundPauseCallbacks: Array<(paused: boolean) => void> = [];

export const setGlobalSoundPaused = (paused: boolean) => {
  globalSoundPaused = paused;
  // Notify all listeners
  globalSoundPauseCallbacks.forEach((callback) => callback(paused));
};

export const getGlobalSoundPaused = () => globalSoundPaused;

export const subscribeToSoundPauseState = (
  callback: (paused: boolean) => void
) => {
  globalSoundPauseCallbacks.push(callback);
  return () => {
    const index = globalSoundPauseCallbacks.indexOf(callback);
    if (index > -1) {
      globalSoundPauseCallbacks.splice(index, 1);
    }
  };
};

// Simple utility functions for order sound management
export const getPendingOrdersCount = (orders: Order[]) => {
  return orders.filter((order) => order.status === "pending").length;
};

export const shouldPlaySound = (orders: Order[]) => {
  return getPendingOrdersCount(orders) > 0;
};

// React hook for using the sound manager with expo-audio
export const useOrderSoundManager = (orders: Order[]) => {
  const [soundStatus, setSoundStatus] = useState({
    isPlaying: false,
    shouldPlay: false,
    pendingOrdersCount: 0,
  });

  useEffect(() => {
    const pendingCount = getPendingOrdersCount(orders);
    const shouldPlay = pendingCount > 0;

    setSoundStatus({
      isPlaying: false, // This will be managed by the audio player
      shouldPlay,
      pendingOrdersCount: pendingCount,
    });
  }, [orders]);

  return {
    ...soundStatus,
    stopSound: () => {}, // Will be implemented by the audio player
    startSound: () => {}, // Will be implemented by the audio player
    testSound: () => {}, // Will be implemented by the audio player
  };
};

// React hook for global sound control
export const useGlobalSoundControl = () => {
  const [isPaused, setIsPaused] = useState(globalSoundPaused);

  useEffect(() => {
    const unsubscribe = subscribeToSoundPauseState(setIsPaused);
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    const newPausedState = !globalSoundPaused;
    setGlobalSoundPaused(newPausedState);
  };

  return {
    isPaused,
    toggleSound,
  };
};

// Function to trigger order sound from FCM notifications
export const triggerOrderSound = () => {
  console.log(
    "🎵 triggerOrderSound called - setting global sound state to play"
  );

  // Set global sound to not paused so the existing sound logic will play
  setGlobalSoundPaused(false);

  // Set a flag that can be checked by the sound player
  (global as any).orderSoundTriggered = true;
  console.log("🎵 Set orderSoundTriggered flag to true");

  // Also set a timestamp for when the sound was triggered
  (global as any).orderSoundTriggeredAt = Date.now();
  console.log("🎵 Set orderSoundTriggeredAt timestamp");

  // Try to play sound immediately if possible (for foreground/background)
  try {
    // Import and play sound immediately using the new service
    import("./backgroundAudioService")
      .then(({ handleFCMOrderSound }) => {
        handleFCMOrderSound();
      })
      .catch((error) => {
        console.log(
          "🎵 Background audio service not available:",
          error.message
        );
      });
  } catch (error: any) {
    console.log("🎵 Could not import background audio service:", error.message);
  }
};

// Function to check if sound was triggered by FCM
export const wasOrderSoundTriggered = () => {
  const triggered = (global as any).orderSoundTriggered || false;
  if (triggered) {
    // Reset the flag after checking
    (global as any).orderSoundTriggered = false;
    const timestamp = (global as any).orderSoundTriggeredAt || 0;
    const timeAgo = Date.now() - timestamp;
    console.log(
      `🎵 Reset orderSoundTriggered flag (was triggered ${timeAgo}ms ago)`
    );
  }
  return triggered;
};

// Function to get additional info about the last FCM trigger
export const getLastFCMTriggerInfo = () => {
  const timestamp = (global as any).orderSoundTriggeredAt || 0;
  const timeAgo = Date.now() - timestamp;
  return {
    wasTriggered: (global as any).orderSoundTriggered || false,
    timestamp,
    timeAgo,
    isRecent: timeAgo < 10000, // Consider "recent" if within 10 seconds
  };
};

// Export cleanup function for app lifecycle management
export const cleanupOrderSoundManager = () => {
  // No cleanup needed for this simple approach
};
