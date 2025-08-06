import React from "react";
import { Text, View } from "react-native";

interface OrderReadyStatusModalProps {
  visible: boolean;
}

export default function OrderReadyStatusModal({
  visible,
}: OrderReadyStatusModalProps) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: "#10B981",
          padding: 30,
          borderRadius: 20,
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={{ fontSize: 48, marginBottom: 20 }}>✅</Text>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Order Ready!
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          The order has been marked as ready for pickup.
        </Text>
      </View>
    </View>
  );
}
