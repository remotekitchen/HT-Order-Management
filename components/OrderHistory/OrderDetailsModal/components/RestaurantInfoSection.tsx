import { MapPin, Phone } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";
import { RestaurantInfo } from "../types";

interface RestaurantInfoSectionProps {
  restaurantInfo: RestaurantInfo;
  orderId: string;
}

export default function RestaurantInfoSection({
  restaurantInfo,
  orderId,
}: RestaurantInfoSectionProps) {
  return (
    <View className="py-4 border-b border-gray-100">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image
            source={{ uri: restaurantInfo.logo }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {restaurantInfo.name}
          </Text>
          <Text className="text-sm text-gray-600">Order #{orderId}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <MapPin size={16} color="#6B7280" />
        <Text className="text-sm text-gray-600 ml-2 flex-1">
          {restaurantInfo.address}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Phone size={16} color="#6B7280" />
        <Text className="text-sm text-gray-600 ml-2">
          {restaurantInfo.phone}
        </Text>
      </View>
    </View>
  );
}
