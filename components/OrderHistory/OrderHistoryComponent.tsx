import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Header from "./Header";
import { mockOrderHistory } from "./mockData";
import OrderGridItem from "./OrderGridItem";
import OrderListItem from "./OrderListItem";
import { LayoutType, OrderHistory } from "./types";

export default function OrderHistoryComponent() {
  const [layoutType, setLayoutType] = useState<LayoutType>("list");
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<OrderHistory[]>(mockOrderHistory);

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

  const handleLayoutChange = (type: LayoutType) => {
    if (type === "list") {
      gridOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => {
        setLayoutType(type);
        listOpacity.value = withTiming(1, { duration: 300 });
      }, 200);
    } else {
      listOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => {
        setLayoutType(type);
        gridOpacity.value = withTiming(1, { duration: 300 });
      }, 200);
    }
  };

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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sticky Header */}
      {/* @ts-ignore */}
      <Header layoutType={layoutType} onLayoutChange={handleLayoutChange} />

      {/* Content */}
      <View className="flex-1">
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
      </View>
    </View>
  );
}
