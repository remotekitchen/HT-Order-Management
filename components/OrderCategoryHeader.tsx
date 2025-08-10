import { Volume2 } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export default function OrderCategoryHeader({
  title,
  count,
  isPlaying = false, // Add sound playing indicator
}: {
  title: string;
  count: number;
  isPlaying?: boolean;
}) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 8 }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#111" }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#FB923C",
          marginLeft: 4,
        }}
      >
        {count}
      </Text>

      {/* Sound Indicator */}
      {isPlaying && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: "#fef3c7",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#f59e0b",
          }}
        >
          <Volume2 size={14} color="#f59e0b" style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 12, color: "#92400e", fontWeight: "500" }}>
            🔊
          </Text>
        </View>
      )}
    </View>
  );
}
