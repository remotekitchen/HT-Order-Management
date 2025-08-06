import React from "react";
import { Text, View } from "react-native";

export default function SimpleTest() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Recent Orders
      </Text>
      <View className="bg-white p-4 rounded-lg shadow-sm">
        <Text className="text-lg font-semibold text-gray-900">Test Order</Text>
        <Text className="text-gray-600">This is a simple test component</Text>
      </View>
    </View>
  );
}
