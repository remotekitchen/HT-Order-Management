import { ArrowLeft, CheckCircle2, Printer, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getStatusInfo(status: string) {
  switch (status) {
    case "completed":
      return {
        icon: <CheckCircle2 size={20} color="#22c55e" className="mr-2" />,
        bg: "#E6F4EA",
        title: "Order completed",
        desc: "Our rider marked the order as delivered",
        color: "#22c55e",
      };
    case "rejected":
      return {
        icon: <CheckCircle2 size={20} color="#ef4444" className="mr-2" />,
        bg: "#FEE2E2",
        title: "Order rejected",
        desc: "This order was rejected by the restaurant",
        color: "#ef4444",
      };
    default:
      return {
        icon: <CheckCircle2 size={20} color="#fbbf24" className="mr-2" />,
        bg: "#FEF3C7",
        title: status.charAt(0).toUpperCase() + status.slice(1),
        desc: "Order status: " + status,
        color: "#fbbf24",
      };
  }
}

export default function OrderDetailsModal({
  visible,
  onClose,
  order,
}: {
  visible: boolean;
  onClose: () => void;
  order: any;
}) {
  const [show, setShow] = useState(visible);
  const restaurantName = "My Restaurant";

  useEffect(() => {
    if (visible) setShow(true);
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  if (!order || !show) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const formatCurrency = (amount: number) => `৳${amount.toFixed(2)}`;
  const mainColor = "#FFA726";
  const statusInfo = getStatusInfo(order?.status || "completed");

  return (
    <Modal visible={show} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center px-2 pt-8 pb-2">
          <TouchableOpacity onPress={handleClose} className="p-2">
            <ArrowLeft size={26} color="#222" />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1 text-center">
            #{order.id}
          </Text>
          <TouchableOpacity className="p-2">
            <Printer size={24} color="#222" />
          </TouchableOpacity>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="px-4">
            <View
              className="rounded-lg px-4 py-3 mb-4"
              style={{ backgroundColor: statusInfo.bg }}
            >
              <View className="flex-row items-center gap-x-2">
                {statusInfo.icon}
                <Text
                  className="font-bold text-base"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.title}
                </Text>
              </View>
              <Text
                className="text-sm mt-1"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.desc}
              </Text>
            </View>
            <View
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 flex-row items-center justify-between mb-4"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/images/main_icon.png")}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                  <Text
                    className="text-base font-bold"
                    style={{ color: mainColor }}
                  >
                    {restaurantName}
                  </Text>
                  <Text className="text-3xl font-extrabold text-black py-3">
                    #{order.id}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {order.order_id}
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-black">
                {formatTime(order.created_date)}
              </Text>
            </View>
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 justify-center items-center">
                <User size={24} color="#888" />
              </View>
              <View className="ml-2">
                <Text
                  className="text-xs font-bold"
                  style={{ color: mainColor }}
                >
                  Customer
                </Text>
                <Text className="text-base font-bold text-black">
                  {order.customer}
                </Text>
              </View>
            </View>
            <View className="rounded-2xl bg-gray-50 px-4 py-3 mb-4">
              {order.orderitem_set &&
                order.orderitem_set.map((item: any) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between mb-1"
                  >
                    <Text className="text-lg font-bold text-black">
                      {item.quantity}x{" "}
                      <Text className="font-medium text-black text-lg">
                        {item.menu_item?.name || "-"}
                      </Text>
                    </Text>
                    <Text className="text-lg font-medium text-black">
                      {formatCurrency(
                        item.quantity * (item.menu_item?.base_price || 0)
                      )}
                    </Text>
                  </View>
                ))}
              <Text className="text-[#FFA726] text-xs font-bold mt-2">
                PLEASE DO NOT PROVIDE CUTLERY
              </Text>
              {order.checkout_note ? (
                <Text className="text-pink-600 text-xs font-bold mt-2">
                  {order.checkout_note.toUpperCase()}
                </Text>
              ) : null}
            </View>
            <View
              className="rounded-2xl bg-white px-4 py-3 mb-4"
              style={{ borderWidth: 1, borderColor: "#eee" }}
            >
              <View className="flex-row justify-between mb-1">
                <Text className="font-bold text-lg text-black">Subtotal</Text>
                <Text className="font-bold text-lg text-black">
                  {formatCurrency(order.subtotal)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-base text-black">VAT (Incl.)</Text>
                <Text className="text-base text-black">
                  {formatCurrency(order.tax)}
                </Text>
              </View>
              {order.discount > 0 && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-base text-black">Discount/Voucher</Text>
                  <Text className="text-base text-[#FFA726]">
                    - {formatCurrency(order.discount)}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between items-center mt-2">
                <Text className="font-bold text-xl text-black">Total</Text>
                <Text className="font-extrabold text-2xl text-black">
                  {formatCurrency(order.total)}
                </Text>
              </View>
            </View>
            <View className="mt-2 rounded-lg bg-gray-100 py-3 items-center">
              <Text className="font-bold text-sm text-black">
                {order.payment_method
                  ? order.payment_method.toUpperCase().replace(/_/g, " ")
                  : "PAYMENT"}
              </Text>
              <Text className="text-xs text-gray-600 mt-1">
                Paid with{" "}
                {order.payment_method
                  ? order.payment_method.replace(/_/g, " ")
                  : "Payment"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
