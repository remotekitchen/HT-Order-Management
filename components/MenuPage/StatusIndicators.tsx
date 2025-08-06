import React from "react";
import { Text, View } from "react-native";

export default function StatusIndicators() {
  const indicators = [
    { color: "#34D399", text: "Available" },
    { color: "#FCD34D", text: "Unavailable Today" },
    { color: "#D1D5DB", text: "Out of Stock" },
  ];

  return (
    <View style={{ paddingHorizontal: 18, paddingBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {indicators.map((indicator, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: indicator.color,
              }}
            />
            <Text style={{ fontSize: 12, color: "#666" }}>
              {indicator.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
