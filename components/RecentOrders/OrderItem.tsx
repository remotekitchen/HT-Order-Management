import { User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Order } from "./types";

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function OrderItem({ order }: { order: Order }) {
  const isCompleted = order.status === "completed";
  return (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <View className="flex-1">
        <Text className="text-lg font-bold">
          {formatTime(order.created_date)}
        </Text>
        <Text className="text-gray-500">
          #{order.id} {order.order_id}
        </Text>
        <View className="flex-row items-center mt-1">
          <User size={16} color="#222" className="mr-1" />
          <Text className="text-gray-500">{order.customer}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text
          className={`font-bold py-1 px-2 rounded-full ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status.toUpperCase()}
        </Text>
        <Text className="text-lg font-bold mt-1">
          ৳{order.total.toFixed(2)}
        </Text>
        <TouchableOpacity>
          <Text className="text-red-500 mt-1">Rate rider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
