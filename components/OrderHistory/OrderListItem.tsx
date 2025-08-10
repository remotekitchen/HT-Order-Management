import { copyToClipboard } from "@/utils/clipboard";
import { Copy } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import OrderDetailsModal from "./OrderDetailsModal";
import { OrderHistory } from "./types";

interface OrderListItemProps {
  order: OrderHistory;
  index: number;
  onPress?: () => void;
}

export default function OrderListItem({
  order,
  index,
  onPress,
}: OrderListItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    setModalVisible(true);
    if (onPress) {
      onPress();
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
      year: "numeric",
    });
  };

  const getMainItems = () => {
    if (order.orderitem_set.length === 1) {
      const item = order.orderitem_set[0];
      return `${item.quantity}x ${item.menu_item.name}`;
    } else if (order.orderitem_set.length === 2) {
      return order.orderitem_set
        .map((item) => `${item.quantity}x ${item.menu_item.name}`)
        .join(", ");
    } else {
      const firstItem = order.orderitem_set[0];
      const remainingCount = order.orderitem_set.length - 1;
      return `${firstItem.quantity}x ${firstItem.menu_item.name} +${remainingCount} more`;
    }
  };

  return (
    <>
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="bg-white mx-4 mb-3 rounded-lg shadow-sm border border-gray-100"
        >
          <View className="p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  source={{ uri: order.restaurant.logo }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-lg font-semibold text-gray-900 mr-2">
                    {order.restaurant.name}
                  </Text>
                  <TouchableOpacity
                    onPress={handleCopyOrder}
                    className="p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Copy size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-600">Order #{order.id}</Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-green-600">
                  ৳{order.total.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-500">
                  {formatDate(order.created_date)}
                </Text>
              </View>
            </View>

            <View className="border-t border-gray-100 pt-3">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </Text>
                  <Text className="text-sm font-medium text-gray-900 mb-1">
                    {order.user.first_name} {order.user.last_name}
                  </Text>
                  <Text className="text-xs text-gray-500 mb-1">
                    {order.user.phone}
                  </Text>
                  <Text className="text-xs text-gray-500" numberOfLines={2}>
                    {order.user.address}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Items
                  </Text>
                  <Text className="text-sm text-gray-600" numberOfLines={2}>
                    {getMainItems()}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-50">
                <View className="flex-row items-center">
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
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 ml-2">
                    via {order.payment_method}
                  </Text>
                </View>
                <Text className="text-xs text-blue-600 font-medium">
                  View Details →
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <OrderDetailsModal
        visible={modalVisible}
        order={order}
        onClose={handleCloseModal}
      />
    </>
  );
}
