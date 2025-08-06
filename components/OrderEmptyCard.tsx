import React from "react";
import { Text, View } from "react-native";

export default function OrderEmptyCard({ text }: { text: string }) {
  return (
    <View
      style={{
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 18,
        minWidth: 140,
        minHeight: 80,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#222", fontSize: 16, textAlign: "center" }}>
        {text}
      </Text>
    </View>
  );
}
