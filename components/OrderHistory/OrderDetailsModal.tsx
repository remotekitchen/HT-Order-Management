import {
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { OrderHistory } from "./types";

const { height: screenHeight } = Dimensions.get("window");

interface OrderDetailsModalProps {
  visible: boolean;
  order: OrderHistory | null;
  onClose: () => void;
}

export default function OrderDetailsModal({
  visible,
  order,
  onClose,
}: OrderDetailsModalProps) {
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 400 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(screenHeight, { duration: 400 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.orderitem_set.reduce((sum, item) => sum + item.subtotal, 0);
  };

  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          },
          overlayStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            {
              backgroundColor: "white",
              height: "85%",
              width: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 20,
            },
            modalStyle,
          ]}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 border-b border-gray-200 pb-4">
            <Text className="text-xl font-bold text-gray-900">
              Order Details
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Text className="text-gray-600 text-lg">×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Restaurant Info */}
            <View className="py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    source={{ uri: order.restaurant.logo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {order.restaurant.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Order #{order.id}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mb-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2 flex-1">
                  {order.restaurant.address}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Phone size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2">
                  {order.restaurant.phone}
                </Text>
              </View>
            </View>

            {/* Customer Info */}
            <View className="py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <User size={20} color="#F97316" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Customer Information
                </Text>
              </View>

              <View className="bg-orange-50 rounded-lg p-4">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  {order.user.first_name} {order.user.last_name}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Phone size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">
                    {order.user.phone}
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <MapPin size={16} color="#6B7280" className="mt-0.5" />
                  <Text className="text-sm text-gray-600 ml-2 flex-1">
                    {order.user.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Info */}
            <View className="py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <Clock size={20} color="#F97316" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Order Information
                </Text>
              </View>

              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Order Date</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {formatDate(order.created_date)}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Status</Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
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
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Payment Method</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {order.payment_method}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Items */}
            <View className="py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <Package size={20} color="#F97316" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Order Items
                </Text>
              </View>

              {order.orderitem_set.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row justify-between items-center py-3 ${
                    index !== order.orderitem_set.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-medium text-gray-900">
                      {item.menu_item.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-gray-900">
                      ৳{item.subtotal.toFixed(2)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      ৳{item.menu_item.base_price.toFixed(2)} each
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Calculation */}
            <View className="py-4 border-b border-gray-100">
              <View className="flex-row items-center mb-3">
                <CreditCard size={20} color="#F97316" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Order Summary
                </Text>
              </View>

              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Subtotal</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    ৳{calculateSubtotal().toFixed(2)}
                  </Text>
                </View>

                {order.tax > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-gray-600">Tax</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      ৳{order.tax.toFixed(2)}
                    </Text>
                  </View>
                )}

                {order.discount > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-gray-600">Discount</Text>
                    <Text className="text-sm font-medium text-red-600">
                      -৳{order.discount.toFixed(2)}
                    </Text>
                  </View>
                )}

                {order.delivery_fee > 0 && (
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-sm text-gray-600">Delivery Fee</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      ৳{order.delivery_fee.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="border-t border-gray-200 pt-3 mt-3">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold text-gray-900">
                      Total
                    </Text>
                    <Text className="text-lg font-bold text-green-600">
                      ৳{order.total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Additional Notes */}
            {order.checkout_note && (
              <View className="py-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </Text>
                <View className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <Text className="text-sm text-yellow-800">
                    {order.checkout_note}
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom spacing */}
            <View className="h-6" />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
