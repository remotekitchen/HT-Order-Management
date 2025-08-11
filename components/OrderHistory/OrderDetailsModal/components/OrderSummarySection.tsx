import { CreditCard } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { GenericOrder } from "../types";
import { calculateSubtotal, formatCurrency } from "../utils";
import SectionHeader from "./SectionHeader";

interface OrderSummarySectionProps {
  order: GenericOrder;
}

export default function OrderSummarySection({
  order,
}: OrderSummarySectionProps) {
  const subtotal = calculateSubtotal(order);

  return (
    <View className="py-4 border-b border-gray-100">
      <SectionHeader
        icon={<CreditCard size={20} color="#F97316" />}
        title="Order Summary"
      />

      <View className="bg-gray-50 rounded-lg p-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">Subtotal</Text>
          <Text className="text-sm font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </Text>
        </View>

        {order.tax > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Tax</Text>
            <Text className="text-sm font-medium text-gray-900">
              {formatCurrency(order.tax)}
            </Text>
          </View>
        )}

        {order.discount > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Discount</Text>
            <Text className="text-sm font-medium text-red-600">
              -{formatCurrency(order.discount)}
            </Text>
          </View>
        )}

        {order.delivery_fee && order.delivery_fee > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Delivery Fee</Text>
            <Text className="text-sm font-medium text-gray-900">
              {formatCurrency(order.delivery_fee)}
            </Text>
          </View>
        )}

        <View className="border-t border-gray-200 pt-3 mt-3">
          <View className="flex-row justify-between">
            <Text className="text-lg font-semibold text-gray-900">Total</Text>
            <Text className="text-lg font-bold text-green-600">
              {formatCurrency(order.total)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
