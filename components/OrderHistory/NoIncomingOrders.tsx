import { Package } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export default function NoIncomingOrders() {
  return (
    <View className="flex-1 justify-center items-center px-8 py-16">
      {/* Icon */}
      <View className="w-20 h-20 bg-orange-100 rounded-full justify-center items-center mb-6">
        <Package size={32} color="#f97316" />
      </View>

      {/* Title */}
      <Text className="text-xl font-semibold text-gray-900 text-center mb-3">
        No Incoming Orders
      </Text>

      {/* Description */}
      <Text className="text-base text-gray-600 text-center leading-6 mb-8">
        Great news! All orders have been processed.{"\n"}
        New orders will appear here automatically.
      </Text>

      {/* Decorative element */}
      <View className="w-16 h-1 bg-orange-200 rounded-full" />
    </View>
  );
}
