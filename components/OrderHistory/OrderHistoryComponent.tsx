import { useOrderSoundManager } from "@/utils/orderSoundManager";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import RecentOrders from "../RecentOrders";
import Header from "./Header";
import { useIncomingOrders } from "./hooks";
import { mockOrderHistory } from "./mockData";
import NoIncomingOrders from "./NoIncomingOrders";
import OrderGridItem from "./OrderGridItem";
import OrderListItem from "./OrderListItem";
import PollingStatus from "./PollingStatus";
import { LayoutType, OrderHistory } from "./types";

export default function OrderHistoryComponent() {
  const [layoutType, setLayoutType] = useState<LayoutType>("list");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"incoming" | "recent">("incoming");

  // Use the custom hook for incoming orders
  const {
    orders: incomingOrders,
    isLoading,
    error,
    isFetching,
    refreshOrders,
    hasOrders,
    isPolling,
    pausePolling,
    resumePolling,
    lastUpdateTime,
  } = useIncomingOrders();

  // Integrate order sound manager for incoming orders
  const { isPlaying, pendingOrdersCount, stopSound } =
    useOrderSoundManager(incomingOrders);

  // Use real incoming orders for incoming tab, mock data for recent tab
  const orders = activeTab === "incoming" ? incomingOrders : mockOrderHistory;

  // Calculate the correct total orders based on active tab
  const getTotalOrders = () => {
    if (activeTab === "incoming") {
      return incomingOrders.length;
    } else {
      // For recent tab, return 0 since we'll show the RecentOrders component
      // which has its own data and counts
      return 0;
    }
  };

  const listOpacity = useSharedValue(1);
  const gridOpacity = useSharedValue(0);

  const listStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [
        {
          translateX: withTiming(layoutType === "list" ? 0 : -20, {
            duration: 300,
          }),
        },
      ],
    };
  });

  const gridStyle = useAnimatedStyle(() => {
    return {
      opacity: gridOpacity.value,
      transform: [
        {
          translateX: withTiming(layoutType === "grid" ? 0 : 20, {
            duration: 300,
          }),
        },
      ],
    };
  });

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayoutType(newLayout);
    if (newLayout === "list") {
      listOpacity.value = withTiming(1, { duration: 300 });
      gridOpacity.value = withTiming(0, { duration: 300 });
    } else {
      listOpacity.value = withTiming(0, { duration: 300 });
      gridOpacity.value = withTiming(1, { duration: 300 });
    }
  };

  const handleTabChange = (tab: "incoming" | "recent") => {
    setActiveTab(tab);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "incoming") {
      await refreshOrders();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderListItem = ({
    item,
    index,
  }: {
    item: OrderHistory;
    index: number;
  }) => (
    <OrderListItem
      order={item}
      index={index}
      onPress={() => {}} // Empty function since we're removing modal functionality
    />
  );

  const renderGridItem = ({
    item,
    index,
  }: {
    item: OrderHistory;
    index: number;
  }) => (
    <OrderGridItem
      order={item}
      index={index}
      onPress={() => {}} // Empty function since we're removing modal functionality
    />
  );

  // Show RecentOrders component when recent tab is active
  if (activeTab === "recent") {
    return (
      <View className="flex-1 bg-white">
        <Header
          totalOrders={0} // RecentOrders will show its own count
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <RecentOrders />
      </View>
    );
  }

  // For Incoming tab, show real data or no orders message
  return (
    <View className="flex-1 bg-gray-50">
      {/* Sticky Header */}
      <Header
        totalOrders={getTotalOrders()}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutType={layoutType}
        onLayoutChange={handleLayoutChange}
        isPlaying={isPlaying}
        onStopSound={stopSound}
      />

      {/* Polling Status Bar */}
      <PollingStatus
        isPolling={isPolling}
        isFetching={isFetching}
        onPausePolling={pausePolling}
        onResumePolling={resumePolling}
        onRefresh={refreshOrders}
        lastUpdateTime={lastUpdateTime}
      />

      {/* Content */}
      <View className="flex-1">
        {!hasOrders && !isLoading ? (
          // Show no orders message when there are no incoming orders
          <NoIncomingOrders />
        ) : (
          // Show orders in list or grid view
          <>
            {layoutType === "list" ? (
              <Animated.View
                style={[listStyle, { flex: 1 }]}
                layout={Layout.springify()}
              >
                <FlatList
                  data={orders}
                  renderItem={renderListItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={["#10B981"]}
                      tintColor="#10B981"
                    />
                  }
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={[gridStyle, { flex: 1 }]}
                layout={Layout.springify()}
              >
                <FlatList
                  data={orders}
                  renderItem={renderGridItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                  }}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={["#10B981"]}
                      tintColor="#10B981"
                    />
                  }
                />
              </Animated.View>
            )}
          </>
        )}
      </View>
    </View>
  );
}
