import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import FilterDropdown from "./FilterDropdown";
import { useRecentOrders } from "./hooks";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderList from "./OrderList";
import Tabs from "./Tabs";

function SkeletonLoader() {
  return (
    <View className="px-4 pb-4 flex-1 justify-center">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View
          key={i}
          className="flex-row items-center p-4 mb-2 bg-gray-100 rounded-lg"
        >
          <View className="w-10 h-10 bg-gray-300 rounded-full mr-4" />
          <View className="flex-1">
            <View className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
            <View className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
            <View className="h-3 bg-gray-200 rounded w-1/4" />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function RecentOrders() {
  const {
    orders,
    orderCounts,
    isLoading,
    error,
    dateFilter,
    setDateFilter,
    filter,
    setFilter,
    refetch,
  } = useRecentOrders();

  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = orders.filter(
    (order: any) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.order_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrderPress = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {}
    setRefreshing(false);
  };

  // Calculate completed orders and total amount
  const completedOrders = orders.filter(
    (order: any) => order.status === "completed"
  );
  const completedCount = completedOrders.length;
  const completedTotal = completedOrders.reduce(
    (sum: number, order: any) => sum + (order.total || 0),
    0
  );
  // Show exact amount with two decimals
  const formatTotal = (amount: number) => amount.toFixed(2);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <View className="p-4">
          <Tabs dateFilter={dateFilter} setDateFilter={setDateFilter} />
        </View>
        <SkeletonLoader />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading orders.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Tabs dateFilter={dateFilter} setDateFilter={setDateFilter} />
      </View>
      <View className="px-4 pb-4">
        <View className="flex-row items-center mb-3 border border-gray-300 rounded-lg bg-gray-50 px-2">
          <Search size={20} color="#222" className="mr-2" />
          <TextInput
            className="flex-1 px-2 py-2 text-black"
            placeholder="Search By Customer Name or Order ID"
            placeholderTextColor="#222"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FilterDropdown
          filter={filter}
          setFilter={setFilter}
          orderCounts={orderCounts}
        />
        {/* Completed summary row */}
        <View className="flex-row items-center mt-4 mb-2">
          <Text className="text-base font-semibold text-gray-700">
            Completed{" "}
          </Text>
          <Text className="text-base font-extrabold text-blue-600">
            {completedCount}
          </Text>
          <Text className="text-base font-semibold text-gray-700 ml-1"> (</Text>
          <Text className="text-base font-extrabold text-green-600">
            ৳{formatTotal(completedTotal)}
          </Text>
          <Text className="text-base font-semibold text-gray-700">)</Text>
        </View>
      </View>
      <OrderList
        orders={filteredOrders}
        onOrderPress={handleOrderPress}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <OrderDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        order={selectedOrder}
      />
    </View>
  );
}
