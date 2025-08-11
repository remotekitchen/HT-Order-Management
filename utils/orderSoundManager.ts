import { useEffect, useState } from "react";

interface Order {
  id: number;
  status: string;
  [key: string]: any;
}

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

// Export cleanup function for app lifecycle management
export const cleanupOrderSoundManager = () => {
  // No cleanup needed for this simple approach
};
