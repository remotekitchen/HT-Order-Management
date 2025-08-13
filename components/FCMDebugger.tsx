import messaging from "@react-native-firebase/messaging";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { registerForPushNotificationsAsync } from "../utils/fcm";

interface FCMStatus {
  isAvailable: boolean;
  hasPermission: boolean;
  isRegistered: boolean;
  currentToken: string | null;
  error: string | null;
}

// Global variable to store background FCM messages
declare global {
  var backgroundFCMLogs: Array<{ timestamp: string; message: string }>;
}

// Initialize global logs
if (typeof global.backgroundFCMLogs === "undefined") {
  global.backgroundFCMLogs = [];
}

export default function FCMDebugger() {
  const [status, setStatus] = useState<FCMStatus>({
    isAvailable: false,
    hasPermission: false,
    isRegistered: false,
    currentToken: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundLogs, setBackgroundLogs] = useState<
    Array<{ timestamp: string; message: string }>
  >([]);

  // Update background logs when component mounts
  useEffect(() => {
    if (global.backgroundFCMLogs) {
      setBackgroundLogs([...global.backgroundFCMLogs]);
    }
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      console.log("🔍 FCM Debugger: Checking status...");

      // Check if messaging is available
      const isAvailable = !!messaging;
      console.log("🔍 FCM available:", isAvailable);

      let hasPermission = false;
      let isRegistered = false;
      let currentToken = null;
      let error = null;

      if (isAvailable) {
        try {
          // Check permission
          const authStatus = await messaging().hasPermission();
          hasPermission =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          console.log(
            "🔍 Permission status:",
            authStatus,
            "Has permission:",
            hasPermission
          );

          // Check if registered
          isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
          console.log("🔍 Device registered:", isRegistered);

          // Try to get current token
          try {
            currentToken = await messaging().getToken();
            console.log("🔍 Current token available:", !!currentToken);
          } catch (tokenError: any) {
            console.error("🔍 Token error:", tokenError);
            error = `Token error: ${tokenError?.message || "Unknown"}`;
          }
        } catch (e: any) {
          console.error("🔍 Status check error:", e);
          error = `Status check error: ${e?.message || "Unknown"}`;
        }
      }

      setStatus({
        isAvailable,
        hasPermission,
        isRegistered,
        currentToken,
        error,
      });
    } catch (e: any) {
      console.error("🔍 FCM Debugger error:", e);
      setStatus((prev) => ({
        ...prev,
        error: `Debugger error: ${e?.message || "Unknown"}`,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const registerFCM = async () => {
    setIsLoading(true);
    try {
      console.log("🚀 FCM Debugger: Starting registration...");
      const token = await registerForPushNotificationsAsync();

      if (token) {
        Alert.alert(
          "🎉 FCM Registration Success!",
          `Token: ${token.substring(
            0,
            30
          )}...\n\nCheck console for full token.`,
          [{ text: "OK" }]
        );
        // Refresh status after registration
        checkStatus();
      } else {
        Alert.alert("❌ FCM Registration Failed", "Check console for details.");
      }
    } catch (e: any) {
      console.error("🚀 FCM Debugger registration error:", e);
      Alert.alert("❌ FCM Registration Error", e?.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearBackgroundLogs = () => {
    global.backgroundFCMLogs = [];
    setBackgroundLogs([]);
    Alert.alert("✅ Logs Cleared", "Background FCM logs have been cleared.");
  };

  const refreshBackgroundLogs = () => {
    if (global.backgroundFCMLogs) {
      setBackgroundLogs([...global.backgroundFCMLogs]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6">
        🔍 FCM Debugger
      </Text>

      {/* Status Section */}
      <View className="bg-gray-100 p-4 rounded-lg mb-4">
        <Text className="text-lg font-semibold mb-2">📊 FCM Status</Text>
        <Text>Available: {status.isAvailable ? "✅ Yes" : "❌ No"}</Text>
        <Text>Permission: {status.hasPermission ? "✅ Yes" : "❌ No"}</Text>
        <Text>Registered: {status.isRegistered ? "✅ Yes" : "❌ No"}</Text>
        <Text>
          Token: {status.currentToken ? "✅ Available" : "❌ Missing"}
        </Text>
        {status.error && (
          <Text className="text-red-500">Error: {status.error}</Text>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row space-x-2 mb-4">
        <TouchableOpacity
          onPress={checkStatus}
          disabled={isLoading}
          className="flex-1 bg-blue-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            {isLoading ? "Checking..." : "Check Status"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={registerFCM}
          disabled={isLoading}
          className="flex-1 bg-green-500 p-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            {isLoading ? "Registering..." : "Register FCM"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Background FCM Logs Section */}
      <View className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
        <Text className="text-lg font-semibold mb-2">
          📱 Background FCM Logs
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          These logs show FCM messages received when app is in background
        </Text>

        <View className="flex-row space-x-2 mb-3">
          <TouchableOpacity
            onPress={refreshBackgroundLogs}
            className="bg-blue-500 px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearBackgroundLogs}
            className="bg-red-500 px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">Clear</Text>
          </TouchableOpacity>
        </View>

        {backgroundLogs.length === 0 ? (
          <Text className="text-gray-500 italic">
            No background FCM messages logged yet. Place an order with app in
            background to see logs here.
          </Text>
        ) : (
          <View>
            <Text className="text-sm font-semibold mb-2">
              Total Background Messages: {backgroundLogs.length}
            </Text>
            {backgroundLogs.map((log, index) => (
              <View
                key={index}
                className="bg-white p-3 rounded-lg mb-2 border border-gray-200"
              >
                <Text className="text-xs text-gray-500 mb-1">
                  {log.timestamp}
                </Text>
                <Text className="text-sm font-mono">{log.message}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Instructions */}
      <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <Text className="text-lg font-semibold mb-2">
          📋 How to Test Background FCM
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          1. Keep this debugger open
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          2. Minimize your app (put in background)
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          3. Place a new order from another device
        </Text>
        <Text className="text-sm text-gray-700 mb-2">
          4. Check this section for background FCM logs
        </Text>
        <Text className="text-sm text-gray-700">
          5. Listen for custom sound vs device default sound
        </Text>
      </View>

      {/* Current Token Display */}
      {status.currentToken && (
        <View className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
          <Text className="text-lg font-semibold mb-2">
            🔑 Current FCM Token
          </Text>
          <Text className="text-xs font-mono bg-white p-2 rounded border">
            {status.currentToken}
          </Text>
          <Text className="text-xs text-gray-600 mt-2">
            Copy this token to your backend for testing
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
