import { useGetIncomingOrdersQuery } from "@/redux/feature/order/orderApi";
import { useEffect, useState } from "react";
import { OrderHistory } from "../types";
import { transformApiOrdersToOrderHistory } from "../utils";

export const useIncomingOrders = () => {
  const [transformedOrders, setTransformedOrders] = useState<OrderHistory[]>(
    []
  );
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetIncomingOrdersQuery(undefined, {
    // Poll every 5 seconds for real-time updates
    pollingInterval: isPolling ? 5000 : 0,
    // Keep the data fresh and refetch when component becomes visible
    refetchOnMountOrArgChange: true,
    // Refetch when the app comes back to foreground
    refetchOnFocus: true,
    // Refetch when reconnecting to the internet
    refetchOnReconnect: true,
    // Skip polling when the component is not visible
    skip: false,
  });

  useEffect(() => {
    if (
      apiResponse &&
      "orders" in apiResponse &&
      Array.isArray(apiResponse.orders)
    ) {
      try {
        const transformed = transformApiOrdersToOrderHistory(
          apiResponse.orders
        );
        setTransformedOrders(transformed);

        const timestamp = new Date().toISOString();
        setLastUpdateTime(timestamp);
      } catch (transformError) {
        console.error("Error transforming orders:", transformError);
        setTransformedOrders([]);
      }
    } else {
      setTransformedOrders([]);
    }
  }, [apiResponse, isPolling]);

  // Log polling status changes
  useEffect(() => {
    const timestamp = new Date().toISOString();
    // Polling status changed
  }, [isPolling]);

  const refreshOrders = () => {
    refetch();
  };

  const pausePolling = () => {
    setIsPolling(false);
  };

  const resumePolling = () => {
    setIsPolling(true);
  };

  const togglePolling = () => {
    setIsPolling(!isPolling);
  };

  return {
    orders: transformedOrders,
    isLoading,
    error,
    isFetching,
    refreshOrders,
    hasOrders: transformedOrders.length > 0,
    isPolling,
    pausePolling,
    resumePolling,
    togglePolling,
    lastUpdateTime,
  };
};
