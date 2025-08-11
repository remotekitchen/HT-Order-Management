import { Package } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { OrderItem } from "../types";
import { formatCurrency } from "../utils";
import SectionHeader from "./SectionHeader";

interface OrderItemsSectionProps {
  orderItems: OrderItem[];
}

export default function OrderItemsSection({
  orderItems,
}: OrderItemsSectionProps) {
  return (
    <View className="py-4 border-b border-gray-100">
      <SectionHeader
        icon={<Package size={20} color="#F97316" />}
        title="Order Items"
      />

      {orderItems.map((item, index) => (
        <View
          key={item.id}
          className={`flex-row justify-between items-center py-3 ${
            index !== orderItems.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          <View className="flex-1 mr-3">
            <Text className="text-sm font-medium text-gray-900">
              {item.name}
            </Text>
            <Text className="text-xs text-gray-500">
              Quantity: {item.quantity}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-semibold text-gray-900">
              {formatCurrency(item.subtotal)}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatCurrency(item.base_price)} each
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
