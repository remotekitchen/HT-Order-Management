import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import RecentOrders from "../RecentOrders";
import Header from "./Header";
import { mockOrderHistory } from "./mockData";
import OrderListItem from "./OrderListItem";
import { OrderHistory } from "./types";

export default function OrderHistoryComponent() {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<OrderHistory[]>(mockOrderHistory);
  const [activeTab, setActiveTab] = useState<"incoming" | "recent">("incoming");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
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

  const handleTabChange = (tab: "incoming" | "recent") => {
    setActiveTab(tab);
  };

  // If Recent Orders tab is selected, show the RecentOrders component
  if (activeTab === "recent") {
    return (
      <View style={styles.container}>
        <Header
          totalOrders={orders.length}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <RecentOrders />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <Header
        totalOrders={orders.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={styles.listContainer} layout={Layout.springify()}>
          <FlatList
            data={orders}
            renderItem={renderListItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
});
