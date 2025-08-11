import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { OrderDetailsModalProps } from "./types";
import { getCustomerInfo, getOrderItems, getRestaurantInfo } from "./utils";

// Components
import CustomerInfoSection from "./components/CustomerInfoSection";
import ModalHeader from "./components/ModalHeader";
import OrderInfoSection from "./components/OrderInfoSection";
import OrderItemsSection from "./components/OrderItemsSection";
import OrderSummarySection from "./components/OrderSummarySection";
import RestaurantInfoSection from "./components/RestaurantInfoSection";
import SpecialInstructionsSection from "./components/SpecialInstructionsSection";

const { height: screenHeight } = Dimensions.get("window");

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

  if (!order) return null;

  const restaurantInfo = getRestaurantInfo(order);
  const customerInfo = getCustomerInfo(order);
  const orderItems = getOrderItems(order);

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
          <ModalHeader title="Order Details" onClose={onClose} />

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            <RestaurantInfoSection
              restaurantInfo={restaurantInfo}
              orderId={order.order_id}
            />

            <CustomerInfoSection customerInfo={customerInfo} />

            <OrderInfoSection order={order} />

            <OrderItemsSection orderItems={orderItems} />

            <OrderSummarySection order={order} />

            <SpecialInstructionsSection checkoutNote={order.checkout_note} />

            {/* Bottom spacing */}
            <View className="h-6" />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
