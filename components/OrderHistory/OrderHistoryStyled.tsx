import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import RecentOrders from "../RecentOrders";
import Header from "./Header";
import { useIncomingOrders } from "./hooks";
import { mockOrderHistory } from "./mockData";
import NoIncomingOrders from "./NoIncomingOrders";
import OrderListItem from "./OrderListItem";

export default function OrderHistoryComponent() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"incoming" | "recent">("incoming");

  // Use the custom hook for incoming orders
  const {
    orders: incomingOrders,
    isLoading,
    error,
    refreshOrders,
    hasOrders,
  } = useIncomingOrders();

  // Use real incoming orders for incoming tab, mock data for recent tab
  const orders = activeTab === "incoming" ? incomingOrders : mockOrderHistory;

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "incoming") {
      await refreshOrders();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

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

  // For Incoming tab, show real data or no orders message
  return (
    <View style={styles.container}>
      <Header
        totalOrders={incomingOrders.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <View style={styles.content}>
        {!hasOrders && !isLoading ? (
          // Show no orders message when there are no incoming orders
          <NoIncomingOrders />
        ) : (
          // Show orders in list view
          <FlatList
            data={orders}
            renderItem={({ item, index }) => (
              <OrderListItem order={item} index={index} onPress={() => {}} />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#10B981"]}
                tintColor="#10B981"
              />
            }
          />
        )}
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
    paddingTop: 16,
    paddingBottom: 32,
  },
});
