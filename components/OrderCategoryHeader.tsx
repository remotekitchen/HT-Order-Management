import React from "react";
import { Text, View } from "react-native";

export default function OrderCategoryHeader({
  title,
  count,
}: {
  title: string;
  count: number;
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
    </View>
  );
}
