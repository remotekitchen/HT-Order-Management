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

export default function FCMDebugger() {
  const [status, setStatus] = useState<FCMStatus>({
    isAvailable: false,
    hasPermission: false,
    isRegistered: false,
    currentToken: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

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
        // Refresh status
        await checkStatus();
      } else {
        Alert.alert(
          "❌ FCM Registration Failed",
          "No token received. Check console for details."
        );
      }
    } catch (error: any) {
      console.error("❌ FCM Debugger registration error:", error);
      Alert.alert(
        "❌ FCM Registration Error",
        error?.message || "Unknown error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          🔥 FCM Debugger
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Status:
          </Text>
          <Text style={{ color: status.isAvailable ? "green" : "red" }}>
            📱 Firebase Messaging:{" "}
            {status.isAvailable ? "Available" : "Not Available"}
          </Text>
          <Text style={{ color: status.hasPermission ? "green" : "orange" }}>
            🔐 Permission: {status.hasPermission ? "Granted" : "Not Granted"}
          </Text>
          <Text style={{ color: status.isRegistered ? "green" : "orange" }}>
            📝 Device Registered: {status.isRegistered ? "Yes" : "No"}
          </Text>
          <Text style={{ color: status.currentToken ? "green" : "red" }}>
            🎯 Current Token:{" "}
            {status.currentToken ? "Available" : "Not Available"}
          </Text>
          {status.error && (
            <Text style={{ color: "red" }}>❌ Error: {status.error}</Text>
          )}
        </View>

        {status.currentToken && (
          <View
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: "#f0f8ff",
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
              🎯 FCM Token (First 50 chars):
            </Text>
            <Text
              style={{ fontSize: 12, fontFamily: "monospace", color: "#333" }}
            >
              {status.currentToken.substring(0, 50)}...
            </Text>
            <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
              Full token length: {status.currentToken.length} characters
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={checkStatus}
            disabled={isLoading}
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginRight: 8,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              {isLoading ? "Checking..." : "🔄 Check Status"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={registerFCM}
            disabled={isLoading}
            style={{
              backgroundColor: "#34C759",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginLeft: 8,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              {isLoading ? "Registering..." : "🚀 Register FCM"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff3cd",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
              color: "#856404",
            }}
          >
            💡 Debug Tips:
          </Text>
          <Text style={{ fontSize: 12, color: "#856404", lineHeight: 18 }}>
            • Make sure you're running on a physical device (not simulator)
            {"\n"}• Check that google-services.json is properly configured{"\n"}
            • Verify Firebase project has Cloud Messaging enabled{"\n"}• Check
            console logs for detailed error messages{"\n"}• Ensure app has
            notification permissions
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
