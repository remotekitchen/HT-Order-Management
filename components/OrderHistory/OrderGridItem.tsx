import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { OrderHistory } from "./types";

interface OrderGridItemProps {
  order: OrderHistory;
  index: number;
  onPress: () => void;
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32 - 8) / 2; // 32 for horizontal padding, 8 for gap

export default function OrderGridItem({
  order,
  index,
  onPress,
}: OrderGridItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const getMainItem = () => {
    const firstItem = order.orderitem_set[0];
    if (order.orderitem_set.length === 1) {
      return `${firstItem.quantity}x ${firstItem.menu_item.name}`;
    } else {
      const remainingCount = order.orderitem_set.length - 1;
      return `${firstItem.quantity}x ${
        firstItem.menu_item.name.length > 15
          ? firstItem.menu_item.name.substring(0, 15) + "..."
          : firstItem.menu_item.name
      } +${remainingCount}`;
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
      style={[animatedStyle, { width: cardWidth }]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <View className="p-3">
          {/* Restaurant Header */}
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <Image
                source={{ uri: order.restaurant.logo }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-sm font-semibold text-gray-900"
                numberOfLines={1}
              >
                {order.restaurant.name}
              </Text>
              <Text className="text-xs text-gray-500">
                {formatDate(order.created_date)}
              </Text>
            </View>
          </View>

          {/* Order Details */}
          <View className="mb-3">
            <Text className="text-xs text-gray-600 mb-1">
              Order #{order.order_id}
            </Text>
            <Text className="text-lg font-bold text-green-600 mb-2">
              ৳{order.total.toFixed(2)}
            </Text>

            <Text className="text-xs font-medium text-gray-700 mb-1">
              Customer
            </Text>
            <Text className="text-xs text-gray-600 mb-2" numberOfLines={1}>
              {order.user.name}
            </Text>

            <Text className="text-xs font-medium text-gray-700 mb-1">
              Items
            </Text>
            <Text className="text-xs text-gray-600" numberOfLines={2}>
              {getMainItem()}
            </Text>
          </View>

          {/* Status and Payment */}
          <View className="border-t border-gray-100 pt-3">
            <View className="flex-row justify-between items-center">
              <View
                className={`px-2 py-1 rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100"
                    : order.status === "cancelled"
                    ? "bg-red-100"
                    : "bg-yellow-100"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    order.status === "completed"
                      ? "text-green-800"
                      : order.status === "cancelled"
                      ? "text-red-800"
                      : "text-yellow-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>

              <Text className="text-xs text-blue-600 font-medium">
                Details →
              </Text>
            </View>

            <Text className="text-xs text-gray-500 mt-2">
              via {order.payment_method}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
