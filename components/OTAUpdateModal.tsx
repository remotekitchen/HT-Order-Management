import * as Updates from "expo-updates";
import { Download, RefreshCw } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

interface OTAUpdateModalProps {
  visible: boolean;
  onUpdateComplete?: () => void;
}

export default function OTAUpdateModal({
  visible,
  onUpdateComplete,
}: OTAUpdateModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // Check if we're in development mode
      if (__DEV__) {
        Alert.alert(
          "Development Mode",
          "OTA updates are not available in development builds. This feature will work in production builds.",
          [{ text: "OK" }]
        );
        return;
      }

      // Check for updates
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        // Download and apply the update
        await Updates.fetchUpdateAsync();

        // Reload the app with the new update
        await Updates.reloadAsync();
      } else {
        Alert.alert("No Update", "No new updates available.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert(
        "Update Failed",
        "Failed to update the app. Please try again later."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          {/* Update Icon */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#2563eb",
                borderRadius: 50,
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Download size={32} color="#fff" />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#111",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            New Update Available
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: 32,
            }}
          >
            A new version of the app is available. Please update to get the
            latest features and improvements.
          </Text>

          {/* Update Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              opacity: isUpdating ? 0.7 : 1,
            }}
            onPress={handleUpdate}
            disabled={isUpdating}
            activeOpacity={0.8}
          >
            {isUpdating ? (
              <RefreshCw size={20} color="#fff" style={{ opacity: 0.8 }} />
            ) : (
              <Download size={20} color="#fff" />
            )}
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {isUpdating ? "Updating..." : "Update Now"}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text
            style={{
              fontSize: 12,
              color: "#999",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            The app will restart automatically after the update
          </Text>
        </View>
      </View>
    </Modal>
  );
}
