import { Clock } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { GenericOrder } from "../types";
import { formatDate, getStatusStyle } from "../utils";
import SectionHeader from "./SectionHeader";

interface OrderInfoSectionProps {
  order: GenericOrder;
}

export default function OrderInfoSection({ order }: OrderInfoSectionProps) {
  const statusStyle = getStatusStyle(order.status);

  return (
    <View className="py-4 border-b border-gray-100">
      <SectionHeader
        icon={<Clock size={20} color="#F97316" />}
        title="Order Information"
      />

      <View className="bg-gray-50 rounded-lg p-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Order Date</Text>
          <Text className="text-sm font-medium text-gray-900">
            {formatDate(order.created_date)}
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Status</Text>
          <View className={`px-3 py-1 rounded-full ${statusStyle.container}`}>
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-600">Payment Method</Text>
          <Text className="text-sm font-medium text-gray-900">
            {order.payment_method}
          </Text>
        </View>
      </View>
    </View>
  );
}
