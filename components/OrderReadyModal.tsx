import {
  useReadyForPickupMutation,
  useReceivedPaymentMutation,
} from "@/redux/feature/order/orderApi";
import { ArrowLeft, Printer } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderStatusModal from "./OrderAcceptedModal";

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
  checkout_note?: string;
  dropoff_contact_first_name?: string;
  dropoff_contact_last_name?: string;
}

export default function OrderReadyModal({
  visible,
  onClose,
  order,
  onReadyForDelivery,
  restaurantName,
}: {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  onReadyForDelivery: () => void;
  restaurantName: string;
}) {
  // Don't render if order is null
  if (!order) {
    return null;
  }

  // Calculate the accepted time in ms
  const acceptedTime = new Date(order.created_date).getTime();
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<any>(null);

  // Update every minute
  useEffect(() => {
    if (visible) {
      setNow(Date.now()); // reset on open
      intervalRef.current = setInterval(() => {
        setNow(Date.now());
      }, 60000); // update every minute
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  // Calculate remaining minutes
  const elapsedMinutes = Math.floor((now - acceptedTime) / 60000);
  const remaining = order.prep_time - elapsedMinutes;
  const isLate = remaining < 0;
  const [mins] = useState(order.prep_time); // Always use the accepted prep_time, do not allow editing
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [readyForPickup, { isLoading: isReady, isSuccess }] =
    useReadyForPickupMutation();
  const [
    receivedPayment,
    { isLoading: isReceiving, isSuccess: isPaymentSuccess },
  ] = useReceivedPaymentMutation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleReadyForDelivery = async () => {
    setLoading(true);
    try {
      await readyForPickup({
        orderId: order.id,
        status: "ready_for_pickup",
      }).unwrap();
      setShowStatusModal(true);
      setTimeout(() => {
        setShowStatusModal(false);
        setLoading(false);
        onReadyForDelivery();
      }, 2000);
    } catch (error) {
      setLoading(false);
      // Optionally show error
    }
  };

  const handlePaymentReceived = async () => {
    setLoading(true);
    try {
      await receivedPayment({
        orderId: order.id,
        status: "completed",
      }).unwrap();
      setShowPaymentModal(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setLoading(false);
        onClose(); // Go back after modal
      }, 2000);
    } catch (error) {
      setLoading(false);
      // Optionally show error
    }
  };

  // Calculate total items
  const totalItems = order.orderitem_set.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return `BDT${amount.toFixed(2)}`;
  };

  // Get customer name
  const customerName =
    order.dropoff_contact_first_name && order.dropoff_contact_last_name
      ? `${order.dropoff_contact_first_name} ${order.dropoff_contact_last_name}`
      : order.customer;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View className="flex-1 bg-white justify-start items-stretch">
        <View className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-2">
              <TouchableOpacity onPress={onClose} className="p-1">
                <ArrowLeft size={28} color="#222" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-x-3">
                <Printer size={22} color="#FB923C" className="mr-2" />
                <Text className="text-[#FB923C] font-bold text-lg">Modify</Text>
              </View>
            </View>
            {/* Order Card - Info and Minutes Selector in a row */}
            <View className="bg-white rounded-2xl mx-3 my-2 p-5 border border-[#eee] shadow-sm flex-row items-center justify-between">
              {/* Left: Order Info */}
              <View className="flex-1 min-w-[120px]">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={require("../assets/images/main_icon.png")}
                    className="w-7 h-7 mr-2 rounded-full"
                  />
                  <Text className="text-[#FB923C] font-bold text-base">
                    {restaurantName}
                  </Text>
                </View>
                <Text className="font-bold text-2xl mb-1">#{order.id}</Text>
                {/* <Text className="text-gray-500 text-base mb-1">
                  {order.order_id}
                </Text> */}
                <View className="flex-row items-center">
                  <Text className="text-pink-600 bg-pink-100 rounded-full px-3 py-1 text-xs font-bold overflow-hidden">
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              {/* Right: Minutes Selector */}
              <View className="relative items-center justify-center ml-2 mr-5">
                <View
                  className={`w-24 h-24 rounded-full border flex-col items-center justify-center ${
                    isLate
                      ? "border-red-500 bg-red-100"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-bold text-2xl mt-4 ${
                      isLate ? "text-red-600" : "text-black"
                    }`}
                  >
                    {remaining}
                  </Text>
                  <Text
                    className={`text-xs mb-4 ${
                      isLate ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    mins
                  </Text>
                </View>
                {/* - Button (disabled) */}
                <TouchableOpacity
                  disabled={true}
                  style={{ opacity: 0.3 }}
                  className="absolute left-[-22px] top-[50%] -translate-y-1/2 w-11 h-11 bg-white rounded-full items-center justify-center shadow border border-gray-200"
                >
                  <Text className="text-2xl text-gray-700">-</Text>
                </TouchableOpacity>
                {/* + Button (disabled) */}
                <TouchableOpacity
                  disabled={true}
                  style={{ opacity: 0.3 }}
                  className="absolute right-[-22px] top-[50%] -translate-y-1/2 w-11 h-11 bg-white rounded-full items-center justify-center shadow border border-gray-200"
                >
                  <Text className="text-2xl text-gray-700">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer and Rider Information Section */}
            <View className="mx-3 my-2">
              {/* Customer Section */}
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-3">
                  <Text className="text-gray-600 text-lg">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[#E91E63] font-bold text-sm">
                    Customer
                  </Text>
                  <Text className="font-bold text-base text-gray-800">
                    {customerName}
                  </Text>
                </View>
              </View>

              {/* Rider Section */}
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-3">
                  <Text className="text-gray-600 text-lg">🚴</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[#E91E63] font-bold text-sm">
                    Riders
                  </Text>
                  <Text className="text-gray-600 text-base">
                    Rider on the way...
                  </Text>
                </View>
              </View>

              {/* Divider Line */}
              <View className="h-px bg-gray-300 mt-3" />
            </View>

            {/* Items Section - Updated to match screenshot */}
            <View className="mx-3 my-2">
              <View className="mb-3">
                {order.orderitem_set.map((item, index) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between items-center mb-1"
                  >
                    <Text className="font-bold text-base text-gray-800">
                      {item.quantity} x {item.menu_item.name}
                    </Text>
                    <Text className="font-bold text-base text-gray-800">
                      {formatCurrency(
                        item.quantity * item.menu_item.base_price
                      )}
                    </Text>
                  </View>
                ))}
                {order.checkout_note && (
                  <Text className="text-[#E91E63] text-sm font-bold mt-2">
                    {order.checkout_note}
                  </Text>
                )}
              </View>

              {/* Divider */}
              <View className="h-px bg-gray-300 my-3" />

              {/* Price Breakdown */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-base text-gray-800">
                    Subtotal
                  </Text>
                  <Text className="font-bold text-base text-gray-800">
                    {formatCurrency(order.subtotal)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-800">VAT (Incl.)</Text>
                  <Text className="text-base text-gray-800">
                    {formatCurrency(order.tax)}
                  </Text>
                </View>
                {order.discount > 0 && (
                  <>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <Text className="text-base text-gray-800">
                          Discount/Voucher
                        </Text>
                        <Text className="text-base text-gray-800 ml-1">⌃</Text>
                      </View>
                      <Text className="text-base text-gray-800">
                        -{formatCurrency(order.discount)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center ml-4">
                      <Text className="text-sm text-gray-600">
                        Funded by you
                      </Text>
                      <Text className="text-sm text-gray-600">
                        -{formatCurrency(order.discount)}
                      </Text>
                    </View>
                  </>
                )}
                <View className="flex-row justify-between items-center mt-3">
                  <Text className="font-bold text-lg text-gray-800">Total</Text>
                  <Text className="font-bold text-xl text-gray-800">
                    {formatCurrency(order.total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View className="mx-3 my-2">
              <View className="bg-green-100 rounded-lg py-3">
                <Text className="text-center text-base text-gray-800">
                  {order.payment_method === "cash"
                    ? "Cash On Delivery"
                    : order.payment_method.toUpperCase()}
                </Text>
              </View>
            </View>
          </ScrollView>
          {/* Ready for Delivery Button */}
          <View className="p-5 bg-white border-t border-[#eee]">
            {order.status === "accepted" ||
            order.status === "driver_assigned" ? (
              <TouchableOpacity
                onPress={handleReadyForDelivery}
                disabled={loading || isReady}
                className="bg-green-500 rounded-xl py-5 flex-row items-center justify-center px-5"
                style={{ opacity: loading || isReady ? 0.7 : 1 }}
              >
                {loading || isReady ? (
                  <ActivityIndicator color="#fff" className="mr-2" />
                ) : null}
                <Text className="text-white font-bold text-xl flex-1 text-center">
                  Ready for Pickup
                </Text>
                <Text className="text-white font-bold text-base ml-3">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handlePaymentReceived}
                disabled={loading || isReceiving}
                className="bg-blue-700 rounded-xl py-5 flex-row items-center justify-center px-5"
                style={{ opacity: loading || isReceiving ? 0.7 : 1 }}
              >
                {loading || isReceiving ? (
                  <ActivityIndicator color="#fff" className="mr-2" />
                ) : null}
                <Text className="text-white font-bold text-xl flex-1 text-center">
                  Payment Received
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Show Status Modals */}
          <OrderStatusModal visible={showStatusModal} type="ready" />
          <OrderStatusModal visible={showPaymentModal} type="payment" />
        </View>
      </View>
    </Modal>
  );
}
