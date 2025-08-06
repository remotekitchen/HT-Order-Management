import React from "react";
import { Text, View } from "react-native";

interface OrderStatusModalProps {
  visible: boolean;
  type: "accepted" | "rejected" | "ready" | "payment";
}

export default function OrderStatusModal({
  visible,
  type,
}: OrderStatusModalProps) {
  if (!visible) return null;

  const getModalConfig = () => {
    switch (type) {
      case "accepted":
        return {
          backgroundColor: "#10B981", // Green
          icon: "✓",
          title: "Accepted",
          message: "You accepted in under 20 seconds.\nKeep up the good work!",
        };
      case "rejected":
        return {
          backgroundColor: "#EF4444", // Red
          icon: "✕",
          title: "Rejected",
          message: "Order has been rejected.",
        };
      case "ready":
        return {
          backgroundColor: "#3B82F6", // Blue
          icon: "📦",
          title: "Ready for Pickup",
          message: "Order is ready for pickup!",
        };
      case "payment":
        return {
          backgroundColor: "#8B5CF6", // Purple
          icon: "💰",
          title: "Payment Received",
          message: "Payment has been received!",
        };
      default:
        return {
          backgroundColor: "#10B981",
          icon: "✓",
          title: "Success",
          message: "Action completed successfully!",
        };
    }
  };

  const config = getModalConfig();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: config.backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <View
        style={{
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 32, color: "white", marginBottom: 30 }}>
          {config.icon}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {config.title}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            opacity: 0.9,
            lineHeight: 24,
          }}
        >
          {config.message}
        </Text>
      </View>
    </View>
  );
}
