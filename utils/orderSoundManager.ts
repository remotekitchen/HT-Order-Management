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

// Export cleanup function for app lifecycle management
export const cleanupOrderSoundManager = () => {
  // No cleanup needed for this simple approach
};
