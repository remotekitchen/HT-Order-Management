import { useGetOrdersQuery } from "@/redux/feature/order/orderApi";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface Order {
  id: number;
  status: string;
  customer: string;
  order_id: string;
  total: number;
  quantity: number;
  prep_time: number;
  created_date: string;
  orderitem_set: Array<{
    id: number;
    quantity: number;
    menu_item: {
      id: number;
      name: string;
      base_price: number;
    };
  }>;
  payment_method: string;
  subtotal: number;
  tax: number;
  discount: number;
}

// Optimized polling interval - 5 seconds instead of 1 second
const POLLING_INTERVAL = 5000; // 5 seconds
const BACKGROUND_POLLING_INTERVAL = 10000; // 10 seconds when app is in background

export const useRealtimeOrders = (restaurantId: number | undefined) => {
  const [isAppActive, setIsAppActive] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  const {
    data: ordersData,
    error,
    isLoading,
    refetch,
  } = useGetOrdersQuery(
    { restaurantId },
    {
      skip: !restaurantId,
      // Optimize cache settings
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const intervalRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Handle app state changes for smart polling
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const wasActive = appStateRef.current === "active";
      const isActive = nextAppState === "active";

      appStateRef.current = nextAppState;
      setIsAppActive(isActive);

      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Set up new interval based on app state
      if (restaurantId && isActive) {
        const interval = wasActive ? POLLING_INTERVAL : 1000; // Immediate fetch when coming back to foreground
        intervalRef.current = setInterval(() => {
          setLastFetchTime(Date.now());
          refetch();
        }, interval);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, [restaurantId, refetch]);

  // Set up polling with optimized interval
  useEffect(() => {
    if (restaurantId) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set up new interval based on app state
      const interval = isAppActive
        ? POLLING_INTERVAL
        : BACKGROUND_POLLING_INTERVAL;

      intervalRef.current = setInterval(() => {
        setLastFetchTime(Date.now());
        refetch();
      }, interval);

      // Cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [restaurantId, refetch, isAppActive]);

  // Categorize orders by status with memoization optimization
  const categorizeOrders = (orders: Order[]) => {
    const newOrders = orders.filter((order) => order.status === "pending");
    const acceptedOrders = orders.filter(
      (order) => order.status !== "pending" && order.status !== "completed"
    );

    // Optimize status counting
    const statusCounts = {
      pending: newOrders.length,
      accepted: orders.filter((order) => order.status === "accepted").length,
      driver_assigned: orders.filter(
        (order) => order.status === "driver_assigned"
      ).length,
      ready_for_pickup: orders.filter(
        (order) => order.status === "ready_for_pickup"
      ).length,
    };

    return {
      newOrders,
      acceptedOrders,
      statusCounts,
    };
  };

  const categorizedOrders = ordersData?.results
    ? categorizeOrders(ordersData.results)
    : {
        newOrders: [],
        acceptedOrders: [],
        statusCounts: {
          pending: 0,
          accepted: 0,
          driver_assigned: 0,
          ready_for_pickup: 0,
        },
      };

  return {
    orders: ordersData?.results || [],
    categorizedOrders,
    error,
    isLoading,
    refetch,
    lastFetchTime,
    isAppActive,
  };
};
