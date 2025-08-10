import { copyToClipboard } from "@/utils/clipboard";
import { Copy } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
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

  const handleCopyOrder = async () => {
    try {
      // Format the order data exactly as requested
      const orderData = `Customer Name: ${order.user.first_name} ${
        order.user.last_name
      }
Customer Phone: ${order.user.phone}
Address: ${order.user.address}
Total Amount: ${order.total}
Item: ${order.orderitem_set
        .map((item) => `${item.quantity}x ${item.menu_item.name}`)
        .join(", ")}`;

      // Try to copy to clipboard
      const success = await copyToClipboard(orderData);

      if (success) {
        // Show success toast message
        Toast.show({
          type: "success",
          text1: "Order copied!",
          text2: "Order details copied to clipboard",
          position: "bottom",
          visibilityTime: 2000,
        });
      } else {
        // Show the data in an alert so user can manually copy
        Alert.alert("Order Details - Copy Manually", orderData, [
          {
            text: "OK",
            style: "default",
          },
        ]);

        Toast.show({
          type: "info",
          text1: "Data displayed",
          text2: "Order details shown above - copy manually",
          position: "bottom",
          visibilityTime: 3000,
        });

        console.log("Order data ready to copy:", orderData);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Copy failed",
        text2: "Could not copy order details",
        position: "bottom",
        visibilityTime: 2000,
      });
    }
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
              <View className="flex-row items-center">
                <Text
                  className="text-sm font-semibold text-gray-900 mr-2"
                  numberOfLines={1}
                >
                  {order.restaurant.name}
                </Text>
                <TouchableOpacity
                  onPress={handleCopyOrder}
                  className="p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Copy size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500">
                {formatDate(order.created_date)}
              </Text>
            </View>
          </View>

          {/* Order Details */}
          <View className="mb-3">
            <Text className="text-xs text-gray-600 mb-1">
              Order #{order.id}
            </Text>
            <Text className="text-lg font-bold text-green-600 mb-2">
              ৳{order.total.toFixed(2)}
            </Text>

            <Text className="text-xs font-medium text-gray-700 mb-1">
              Customer
            </Text>
            <Text
              className="text-xs font-medium text-gray-900 mb-1"
              numberOfLines={1}
            >
              {order.user.first_name} {order.user.last_name}
            </Text>
            <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
              {order.user.phone}
            </Text>
            <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
              {order.user.address}
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
