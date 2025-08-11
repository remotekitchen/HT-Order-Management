import React from "react";
import { Text, View } from "react-native";

interface SpecialInstructionsSectionProps {
  checkoutNote?: string;
}

export default function SpecialInstructionsSection({
  checkoutNote,
}: SpecialInstructionsSectionProps) {
  if (!checkoutNote) return null;

  return (
    <View className="py-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        Special Instructions
      </Text>
      <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <Text className="text-sm text-yellow-800">{checkoutNote}</Text>
      </View>
    </View>
  );
}
