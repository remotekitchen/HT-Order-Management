import React from "react";
import { Text, View } from "react-native";
import { SectionHeaderProps } from "../types";

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center mb-3">
      {icon}
      <Text className="text-lg font-semibold text-gray-900 ml-2">{title}</Text>
    </View>
  );
}
