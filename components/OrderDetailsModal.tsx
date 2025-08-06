import { ArrowLeft, Printer } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
}

export default function OrderDetailsModal({
  visible,
  onClose,
  order,
  onAccept,
}: {
  visible: boolean;
  onClose: () => void;
  order: Order;
  onAccept: () => void;
}) {
  const [mins, setMins] = useState(order.prep_time);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 3000));
    setLoading(false);
    onAccept();
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
                    source={require("../assets/images/icon.png")}
                    className="w-7 h-7 mr-2 rounded-full"
                  />
                  <Text className="text-[#FB923C] font-bold text-base">
                    Test restaurant
                  </Text>
                </View>
                <Text className="font-bold text-2xl mb-1">#{order.id}</Text>
                <Text className="text-gray-500 text-base mb-1">
                  {order.order_id}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-pink-600 bg-pink-100 rounded-full px-3 py-1 text-xs font-bold overflow-hidden">
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              {/* Right: Minutes Selector */}
              <View className="relative items-center justify-center ml-2 mr-5">
                <View className="w-24 h-24 bg-gray-100 rounded-full border border-gray-200 flex-col items-center justify-center">
                  <Text className="font-bold text-2xl text-black mt-4">
                    {mins}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-4">mins</Text>
                </View>
                {/* - Button */}
                <TouchableOpacity
                  onPress={() => setMins(Math.max(1, mins - 1))}
                  className="absolute left-[-22px] top-[40%] -translate-y-1/2 w-11 h-11 bg-white rounded-full items-center justify-center shadow border border-gray-200"
                  style={{ elevation: 3 }}
                >
                  <Text className="text-2xl text-gray-700">-</Text>
                </TouchableOpacity>
                {/* + Button */}
                <TouchableOpacity
                  onPress={() => setMins(mins + 1)}
                  className="absolute right-[-22px] top-[40%] -translate-y-1/2 w-11 h-11 bg-white rounded-full items-center justify-center shadow border border-gray-200"
                  style={{ elevation: 3 }}
                >
                  <Text className="text-2xl text-gray-700">+</Text>
                </TouchableOpacity>
              </View>
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
          {/* Accept Order Button */}
          <View className="p-5 bg-white border-t border-[#eee]">
            <TouchableOpacity
              onPress={handleAccept}
              disabled={loading}
              className="bg-green-500 rounded-xl py-5 flex-row items-center justify-center px-5"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" className="mr-2" />
              ) : null}
              <Text className="text-white font-bold text-xl flex-1 text-center">
                Accept Order
              </Text>
              <Text className="text-white font-bold text-base ml-3">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
