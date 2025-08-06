import { Bike } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";

interface OrderItem {
  id: number;
  quantity: number;
  menu_item: {
    id: number;
    name: string;
    base_price: number;
  };
}

interface Order {
  id: number;
  status: string;
  customer: string;
  order_id: string;
  total: number;
  quantity: number;
  prep_time: number;
  created_date: string;
  orderitem_set: OrderItem[];
  payment_method: string;
  subtotal: number;
  tax: number;
  discount: number;
}

export default function OrderCard({
  order,
  accepted = false,
}: {
  order: Order;
  accepted?: boolean;
}) {
  // Memoize expensive calculations
  const totalItems = useMemo(() => {
    return order.orderitem_set.reduce((sum, item) => sum + item.quantity, 0);
  }, [order.orderitem_set]);

  // Memoize currency formatting
  const formatCurrency = useMemo(() => {
    return (amount: number) => {
      return `BDT${amount.toFixed(2)}`;
    };
  }, []);

  // Move hooks outside conditional - always call them
  const acceptedTime = accepted ? new Date(order.created_date).getTime() : 0;
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (accepted && order.status !== "completed") {
      setNow(Date.now());
      // Update every minute instead of every second for better performance
      intervalRef.current = setInterval(() => {
        setNow(Date.now());
      }, 60000); // 60 seconds
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [accepted, order.status, order.created_date]);

  if (accepted) {
    if (order.status === "completed") {
      return null;
    }
    const isReady = order.status === "ready_for_pickup";
    let statusLabel = "";
    let statusClass = "";
    if (isReady) {
      statusLabel = "READY";
      statusClass = "bg-green-100 text-green-600";
    } else {
      statusLabel = "ACCEPTED";
      statusClass = "bg-pink-100 text-pink-600";
    }

    const elapsedMinutes = Math.floor((now - acceptedTime) / 60000);
    const remaining = order.prep_time - elapsedMinutes;
    const isLate = remaining < 0;

    return (
      <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg font-bold text-gray-900 mr-2">
                #{order.id}
              </Text>
              <Text
                className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass}`}
              >
                {statusLabel}
              </Text>
            </View>
            <Text className="text-sm text-gray-500 mb-1">
              {order.order_id} • {totalItems} item{totalItems !== 1 ? "s" : ""}
            </Text>
            {isReady ? (
              <Text className="text-sm text-gray-700 font-semibold">
                {formatCurrency(order.total)}
              </Text>
            ) : (
              <View className="flex-row items-center">
                <Bike size={14} color="#000" />
                <Text className="text-sm text-gray-700 ml-1">
                  Rider is on the way
                </Text>
              </View>
            )}
          </View>
          {!isReady && (
            <View className="items-end">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#32CD32",
                  borderWidth: 2,
                  borderColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  {Math.max(0, remaining)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  // New order design with yellow/orange background
  return (
    <View className="bg-orange-500 rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">#{order.id}</Text>
          <Text className="text-sm text-orange-100">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </Text>
          <Text className="text-sm text-orange-100 mt-1">
            {order.prep_time} mins
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold bg-white text-orange-500 px-2 py-1 rounded-full">
            NEW
          </Text>
          <Text className="text-lg font-bold text-white mt-1">
            {formatCurrency(order.total)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Bike size={16} color="white" />
          <Text className="text-sm text-orange-100 ml-1">
            {order.payment_method === "cash" ? "Cash" : "Online"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-orange-100">
            Prep: {order.prep_time}m
          </Text>
        </View>
      </View>
    </View>
  );
}

// Memoize the formatTime function
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
