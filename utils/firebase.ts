// utils/firebase.ts
import messaging from "@react-native-firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  // Your Firebase config will be automatically loaded from google-services.json
  // This file ensures Firebase is properly initialized
};

// Initialize Firebase
export const initializeFirebase = () => {
  try {
    console.log("🔥 Initializing Firebase...");

    // Check if Firebase is already initialized
    if (messaging) {
      console.log("✅ Firebase messaging is available");
      return true;
    } else {
      console.error("❌ Firebase messaging not available");
      return false;
    }
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    return false;
  }
};

// Check Firebase status
export const checkFirebaseStatus = () => {
  try {
    const isAvailable = !!messaging;
    console.log("🔍 Firebase status check:", {
      messaging: isAvailable,
      timestamp: new Date().toISOString(),
    });
    return isAvailable;
  } catch (error) {
    console.error("🔍 Firebase status check error:", error);
    return false;
  }
};
