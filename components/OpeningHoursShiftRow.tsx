import { Minus } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OpeningHoursShiftRow({
  start,
  end,
  onStartChange,
  onEndChange,
  onRemove,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        onPress={onStartChange}
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: 8,
          padding: 10,
          minWidth: 70,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{start}</Text>
      </TouchableOpacity>
      <Text style={{ marginHorizontal: 8, fontSize: 16 }}>to</Text>
      <TouchableOpacity
        onPress={onEndChange}
        style={{
          backgroundColor: "#f3f4f6",
          borderRadius: 8,
          padding: 10,
          minWidth: 70,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{end}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={onRemove} style={{ marginLeft: 8 }}>
        <Minus size={22} color="#E91E63" />
      </TouchableOpacity>
    </View>
  );
}
