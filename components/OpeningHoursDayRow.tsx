import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function OpeningHoursDayRow({
  day,
  enabled,
  onToggle,
  onArrowPress,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <Switch value={enabled} onValueChange={onToggle} />
      <Text
        style={{ fontSize: 16, fontWeight: "bold", marginLeft: 12, flex: 1 }}
      >
        {day}
      </Text>
      <TouchableOpacity onPress={onArrowPress}>
        <ChevronDown size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );
}
