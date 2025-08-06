import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import OrderItem from "./OrderItem";
import { Order } from "./types";

interface OrderListProps {
  orders: Order[];
  onOrderPress?: (order: Order) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function OrderList({
  orders,
  onOrderPress,
  refreshing,
  onRefresh,
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500">No orders found.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) =>
        onOrderPress ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onOrderPress(item)}
          >
            <OrderItem order={item} />
          </TouchableOpacity>
        ) : (
          <OrderItem order={item} />
        )
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
