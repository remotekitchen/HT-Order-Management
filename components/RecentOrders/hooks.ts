import { useGetOrderHistoryQuery } from "@/redux/feature/order/orderApi";
import { useMemo, useState } from "react";
import { DateFilter, FilterType, Order } from "./types";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const useRecentOrders = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    mode: "last7days",
  });
  const [filter, setFilter] = useState<FilterType>("all");

  // Calculate date range for API
  const getDateRange = () => {
    if (dateFilter.mode === "last7days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      const range = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };
      // console.log("Last 7 days range:", {
      //   startDate: startDate.toISOString(),
      //   endDate: endDate.toISOString(),
      //   formattedRange: range,
      // });
      return range;
    } else if (dateFilter.mode === "custom" && dateFilter.range) {
      const range = {
        start_date: dateFilter.range.startDate,
        end_date: dateFilter.range.endDate,
      };
      // console.log("Custom date range:", range);
      return range;
    }
    // Default to last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    const range = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    };
    // console.log("Default range (last 7 days):", {
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    //   formattedRange: range,
    // });
    return range;
  };

  const dateRange = getDateRange();

  // Debug: Log the date range being sent to API
  // console.log("Date range for API:", dateRange);

  // Use the API query with date parameters
  const {
    data: apiOrders,
    isLoading,
    error,
    refetch,
  } = useGetOrderHistoryQuery([dateRange.start_date, dateRange.end_date]);

  // Debug: Log API call details
  // console.log("API Call details:", {
  //   dateRange,
  //   isLoading,
  //   error,
  //   hasData: !!apiOrders,
  //   dataType: typeof apiOrders,
  //   isArray: Array.isArray(apiOrders),
  //   dataKeys:
  //     apiOrders && typeof apiOrders === "object"
  //       ? Object.keys(apiOrders)
  //       : "N/A",
  // });

  // Transform API orders to match the expected format
  const transformedOrders = useMemo(() => {
    if (!apiOrders) return [];

    // Debug: Log the API response structure
    console.log("API Response structure:", JSON.stringify(apiOrders, null, 2));

    // Handle the actual API response structure
    let ordersArray: any[] = [];
    if (
      apiOrders &&
      typeof apiOrders === "object" &&
      "orders" in apiOrders &&
      Array.isArray((apiOrders as any).orders)
    ) {
      // API returns { orders: [...], date_range: {...}, total: number }
      ordersArray = (apiOrders as any).orders;
    } else if (Array.isArray(apiOrders)) {
      // Fallback: direct array (for backward compatibility)
      ordersArray = apiOrders;
    }

    if (ordersArray.length === 0) {
      console.log("No orders found in API response");
      return [];
    }

    // Debug: Log the first order to see the structure
    console.log(
      "First order structure:",
      JSON.stringify(ordersArray[0], null, 2)
    );

    return ordersArray.map((apiOrder: any) => {
      // Map API status to component status
      const mapStatus = (apiStatus: string) => {
        const status = apiStatus?.toLowerCase();
        if (status === "completed" || status === "delivered")
          return "completed";
        if (status === "cancelled" || status === "rejected") return "cancelled";
        if (
          status === "pending" ||
          status === "accepted" ||
          status === "preparing" ||
          status === "ready"
        )
          return "ongoing";
        return "ongoing"; // default to ongoing for unknown statuses
      };

      return {
        id: apiOrder.id,
        status: mapStatus(apiOrder.status),
        customer:
          `${apiOrder.user?.first_name || ""} ${
            apiOrder.user?.last_name || ""
          }`.trim() || "Customer",
        order_id: apiOrder.order_id,
        total: apiOrder.total || 0,
        created_date: apiOrder.receive_date || apiOrder.created_date,
        subtotal:
          (apiOrder.total || 0) -
          (apiOrder.tax || 0) -
          (apiOrder.delivery_fee || 0),
        tax: apiOrder.tax || 0,
        discount: apiOrder.discount || 0,
        payment_method: apiOrder.payment_method || "unknown",
        checkout_note: apiOrder.checkout_note || "",
        // Restaurant info
        restaurant_name: apiOrder.restaurant?.name || "Restaurant",
        restaurant_logo:
          apiOrder.restaurant?.logo || "https://via.placeholder.com/100",
        restaurant_address:
          apiOrder.restaurant?.location || "Address not available",
        restaurant_phone: apiOrder.restaurant?.phone || "Phone not available",
        // Customer details
        customer_phone: apiOrder.user?.phone || "Phone not available",
        customer_address:
          apiOrder.dropoff_address_details?.full_address ||
          apiOrder.pickup_address_details?.full_address ||
          "Address not available",
        orderitem_set: (apiOrder.items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          menu_item: {
            name: item.name,
            base_price: item.base_price || 0,
          },
        })),
      };
    });
  }, [apiOrders]);

  const filteredOrders = useMemo(() => {
    let orders = transformedOrders;

    // Debug: Log the transformed orders
    console.log("Transformed orders count:", orders.length);
    if (orders.length > 0) {
      console.log("First transformed order:", orders[0]);
    }

    // Apply status filter
    if (filter !== "all") {
      if (filter === "ongoing") {
        orders = orders.filter(
          (order: Order) =>
            order.status !== "completed" && order.status !== "cancelled"
        );
      } else {
        orders = orders.filter((order: Order) => order.status === filter);
      }
    }

    console.log("Filtered orders count:", orders.length);
    return orders;
  }, [transformedOrders, filter]);

  const orderCounts = useMemo(() => {
    const orders = transformedOrders;
    return {
      all: orders.length,
      ongoing: orders.filter(
        (order: Order) =>
          order.status !== "completed" && order.status !== "cancelled"
      ).length,
      completed: orders.filter((order: Order) => order.status === "completed")
        .length,
      cancelled: orders.filter((order: Order) => order.status === "cancelled")
        .length,
    };
  }, [transformedOrders]);

  return {
    orders: filteredOrders,
    isLoading,
    error,
    dateFilter,
    setDateFilter,
    filter,
    setFilter,
    refetch,
  };
};
