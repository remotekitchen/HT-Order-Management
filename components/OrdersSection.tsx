import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";
import { useGetRestaurantQuery } from "@/redux/feature/restaurant/restaurantApi";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AcceptOrderModal from "./AcceptOrderModal";
import OrderCard from "./OrderCard";
import OrderCategoryHeader from "./OrderCategoryHeader";
import OrderEmptyCard from "./OrderEmptyCard";
import OrderReadyModal from "./OrderReadyModal";

export default function OrdersSection({
  onNavigate,
}: {
  onNavigate?: (section: string) => void;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [readyModalVisible, setReadyModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use refetch from both restaurant and orders
  const { data: getRestaurants, refetch: refetchRestaurant } =
    useGetRestaurantQuery({});
  const restaurantName = getRestaurants?.results[0]?.name;
  const restaurantId = getRestaurants?.results[0]?.id;
  const { categorizedOrders, refetch: refetchOrders } =
    useRealtimeOrders(restaurantId);

  // Memoize the hasOrders check to prevent unnecessary re-renders
  const hasOrders = useMemo(() => {
    return (
      categorizedOrders.newOrders.length > 0 ||
      categorizedOrders.acceptedOrders.length > 0
    );
  }, [
    categorizedOrders.newOrders.length,
    categorizedOrders.acceptedOrders.length,
  ]);

  // Reset timer and hide empty state on orders or rerender
  useEffect(() => {
    setShowEmptyState(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!hasOrders) {
      timerRef.current = setTimeout(() => {
        setShowEmptyState(true);
      }, 15000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasOrders]);

  // Reset timer on scroll only, not on card clicks
  const handleScroll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowEmptyState(false);
    if (!hasOrders) {
      timerRef.current = setTimeout(() => {
        setShowEmptyState(true);
      }, 15000);
    }
  }, [hasOrders]);

  // Auto open AcceptOrderModal when a new order arrives
  useEffect(() => {
    if (
      categorizedOrders.newOrders.length > 0 &&
      !acceptModalVisible &&
      (!selectedOrder || selectedOrder.id !== categorizedOrders.newOrders[0].id)
    ) {
      setSelectedOrder(categorizedOrders.newOrders[0]);
      setAcceptModalVisible(true);
    }
  }, [categorizedOrders.newOrders, acceptModalVisible, selectedOrder]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchRestaurant(), refetchOrders?.()]);
    } catch {
      // handle error silently
    } finally {
      setRefreshing(false);
    }
  }, [refetchRestaurant, refetchOrders]);

  const handleReadyForDelivery = useCallback(() => {
    setReadyModalVisible(false);
    // Handle ready for delivery logic here
  }, []);

  const handleOrderPress = useCallback(
    (order: any, type: "new" | "accepted") => {
      setSelectedOrder(order);
      if (type === "new") {
        setAcceptModalVisible(true);
      } else if (type === "accepted") {
        setReadyModalVisible(true);
      }
    },
    []
  );

  // Navigation handlers for action cards
  const handleMenuPress = () => {
    onNavigate?.("menu");
  };

  const handleRecentOrdersPress = () => {
    onNavigate?.("recent");
  };

  const handlePerformancePress = () => {
    onNavigate?.("performance");
  };

  const handleSettingsPress = () => {
    onNavigate?.("settings");
  };

  // Memoize the new orders rendering to prevent unnecessary re-renders
  const newOrdersContent = useMemo(() => {
    if (categorizedOrders.newOrders.length > 0) {
      return categorizedOrders.newOrders.map((order) => (
        <TouchableOpacity
          key={order.id}
          activeOpacity={0.85}
          onPress={() => handleOrderPress(order, "new")}
        >
          <OrderCard order={order} />
        </TouchableOpacity>
      ));
    } else {
      return <OrderEmptyCard text="No new orders" />;
    }
  }, [categorizedOrders.newOrders, handleOrderPress]);

  // Memoize the accepted orders rendering
  const acceptedOrdersContent = useMemo(() => {
    if (categorizedOrders.acceptedOrders.length > 0) {
      return categorizedOrders.acceptedOrders.map((order) => (
        <TouchableOpacity
          key={order.id}
          activeOpacity={0.85}
          onPress={() => handleOrderPress(order, "accepted")}
        >
          <OrderCard order={order} accepted />
        </TouchableOpacity>
      ));
    } else {
      return <OrderEmptyCard text="No accepted orders" />;
    }
  }, [categorizedOrders.acceptedOrders, handleOrderPress]);

  return (
    <>
      <ScrollView
        className="flex-1 bg-white pt-4 px-3"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FB923C"]}
            progressBackgroundColor="#fff"
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {showEmptyState && !hasOrders ? (
          <View className="flex-1 items-center justify-center py-8">
            {/* Illustration */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center mb-4">
                <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center">
                  <Text className="text-3xl">📋</Text>
                </View>
              </View>
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              No active orders
            </Text>

            {/* Subtitle */}
            <Text className="text-gray-600 text-center mb-8 px-6">
              Use this time efficiently: Increase your profits by keeping your
              business up to date.
            </Text>

            {/* Action Cards Grid */}
            <View className="w-full px-4">
              <View className="flex-row justify-between mb-4">
                <TouchableOpacity
                  className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-orange-100"
                  style={{ elevation: 2 }}
                  onPress={handleMenuPress}
                >
                  <View className="items-center">
                    <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mb-2">
                      <Text className="text-xl">🍽️</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-800 text-center">
                      Menu
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-orange-100"
                  style={{ elevation: 2 }}
                  onPress={handleRecentOrdersPress}
                >
                  <View className="items-center">
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                      <Text className="text-xl">📊</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-800 text-center">
                      Recent Orders
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between mb-4">
                <TouchableOpacity
                  className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm border border-orange-100"
                  style={{ elevation: 2 }}
                  onPress={handlePerformancePress}
                >
                  <View className="items-center">
                    <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mb-2">
                      <Text className="text-xl">📈</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-800 text-center">
                      Performance
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm border border-orange-100"
                  style={{ elevation: 2 }}
                  onPress={handleSettingsPress}
                >
                  <View className="items-center">
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                      <Text className="text-xl">⚙️</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-800 text-center">
                      Settings
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* Top row: New & Upcoming */}
            <View className="flex-row justify-between mb-6">
              <View className="flex-1 mr-2">
                <OrderCategoryHeader
                  title="New"
                  count={categorizedOrders.newOrders.length}
                />
                {newOrdersContent}
              </View>
              <View className="flex-1 ml-2">
                <OrderCategoryHeader title="Upcoming" count={0} />
                <OrderEmptyCard text="No upcoming orders" />
              </View>
            </View>

            {/* Accepted row */}
            <View className="mb-6">
              <OrderCategoryHeader
                title="Accepted"
                count={categorizedOrders.acceptedOrders.length}
              />
              {acceptedOrdersContent}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modals */}
      <AcceptOrderModal
        visible={acceptModalVisible}
        onClose={() => setAcceptModalVisible(false)}
        order={selectedOrder}
        restaurantName={restaurantName || ""}
      />
      <OrderReadyModal
        visible={readyModalVisible}
        onClose={() => setReadyModalVisible(false)}
        order={selectedOrder}
        onReadyForDelivery={handleReadyForDelivery}
        restaurantName={restaurantName || ""}
      />
    </>
  );
}
