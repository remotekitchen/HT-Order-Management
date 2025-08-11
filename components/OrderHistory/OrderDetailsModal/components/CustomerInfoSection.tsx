import { MapPin, Phone, User } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { CustomerInfo } from "../types";
import SectionHeader from "./SectionHeader";

interface CustomerInfoSectionProps {
  customerInfo: CustomerInfo;
}

export default function CustomerInfoSection({
  customerInfo,
}: CustomerInfoSectionProps) {
  return (
    <View className="py-4 border-b border-gray-100">
      <SectionHeader
        icon={<User size={20} color="#F97316" />}
        title="Customer Information"
      />

      <View className="bg-orange-50 rounded-lg p-4">
        <Text className="text-base font-semibold text-gray-900 mb-2">
          {customerInfo.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Phone size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-2">
            {customerInfo.phone}
          </Text>
        </View>

        <View className="flex-row items-start">
          <MapPin size={16} color="#6B7280" className="mt-0.5" />
          <Text className="text-sm text-gray-600 ml-2 flex-1">
            {customerInfo.address}
          </Text>
        </View>
      </View>
    </View>
  );
}
