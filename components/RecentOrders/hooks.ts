import { useMemo, useState } from "react";
import { DateFilter, FilterType, Order } from "./types";

// Static demo data
const staticOrders: Order[] = [
  {
    id: 1,
    status: "completed",
    customer: "John Doe",
    order_id: "HTD001",
    total: 850.5,
    created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    subtotal: 785.5,
    tax: 65.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "No onions please",
    orderitem_set: [
      {
        id: 1,
        quantity: 2,
        menu_item: { name: "Chicken Biryani", base_price: 350.0 },
      },
      {
        id: 2,
        quantity: 1,
        menu_item: { name: "Beef Curry", base_price: 85.5 },
      },
    ],
  },
  {
    id: 2,
    status: "completed",
    customer: "Sarah Johnson",
    order_id: "HTD002",
    total: 1200.75,
    created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    subtotal: 1100.75,
    tax: 100.0,
    discount: 0,
    payment_method: "bkash",
    checkout_note: "",
    orderitem_set: [
      {
        id: 3,
        quantity: 3,
        menu_item: { name: "Mutton Curry", base_price: 180.0 },
      },
      {
        id: 4,
        quantity: 2,
        menu_item: { name: "Plain Rice", base_price: 280.25 },
      },
    ],
  },
  {
    id: 3,
    status: "ongoing",
    customer: "Mike Wilson",
    order_id: "HTD003",
    total: 675.25,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    subtotal: 625.25,
    tax: 50.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "Extra spicy",
    orderitem_set: [
      {
        id: 5,
        quantity: 1,
        menu_item: { name: "Fish Curry", base_price: 425.25 },
      },
      {
        id: 6,
        quantity: 1,
        menu_item: { name: "Mixed Vegetables", base_price: 200.0 },
      },
    ],
  },
  {
    id: 4,
    status: "completed",
    customer: "Emily Davis",
    order_id: "HTD004",
    total: 950.0,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    subtotal: 880.0,
    tax: 70.0,
    discount: 0,
    payment_method: "nagad",
    checkout_note: "",
    orderitem_set: [
      {
        id: 7,
        quantity: 2,
        menu_item: { name: "Chicken Tikka", base_price: 290.0 },
      },
      {
        id: 8,
        quantity: 1,
        menu_item: { name: "Naan Bread", base_price: 300.0 },
      },
    ],
  },
  {
    id: 5,
    status: "cancelled",
    customer: "Robert Brown",
    order_id: "HTD005",
    total: 420.5,
    created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    subtotal: 390.5,
    tax: 30.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "",
    orderitem_set: [
      {
        id: 9,
        quantity: 1,
        menu_item: { name: "Chicken Fried Rice", base_price: 390.5 },
      },
    ],
  },
  {
    id: 6,
    status: "completed",
    customer: "Lisa Anderson",
    order_id: "HTD006",
    total: 1150.25,
    created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    subtotal: 1050.25,
    tax: 100.0,
    discount: 0,
    payment_method: "bkash",
    checkout_note: "Medium spice level",
    orderitem_set: [
      {
        id: 10,
        quantity: 2,
        menu_item: { name: "Beef Biryani", base_price: 400.0 },
      },
      {
        id: 11,
        quantity: 1,
        menu_item: { name: "Chicken Roast", base_price: 250.25 },
      },
    ],
  },
  {
    id: 7,
    status: "ongoing",
    customer: "David Miller",
    order_id: "HTD007",
    total: 780.0,
    created_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    subtotal: 720.0,
    tax: 60.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "",
    orderitem_set: [
      {
        id: 12,
        quantity: 2,
        menu_item: { name: "Prawn Curry", base_price: 360.0 },
      },
    ],
  },
  {
    id: 8,
    status: "completed",
    customer: "Jessica Garcia",
    order_id: "HTD008",
    total: 560.75,
    created_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    subtotal: 515.75,
    tax: 45.0,
    discount: 0,
    payment_method: "nagad",
    checkout_note: "Less oil",
    orderitem_set: [
      {
        id: 13,
        quantity: 1,
        menu_item: { name: "Vegetable Biryani", base_price: 315.75 },
      },
      {
        id: 14,
        quantity: 1,
        menu_item: { name: "Dal Curry", base_price: 200.0 },
      },
    ],
  },
  {
    id: 9,
    status: "completed",
    customer: "Chris Martinez",
    order_id: "HTD009",
    total: 890.5,
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    subtotal: 820.5,
    tax: 70.0,
    discount: 0,
    payment_method: "bkash",
    checkout_note: "",
    orderitem_set: [
      {
        id: 15,
        quantity: 1,
        menu_item: { name: "Mixed Grill", base_price: 520.5 },
      },
      {
        id: 16,
        quantity: 1,
        menu_item: { name: "Kheer", base_price: 300.0 },
      },
    ],
  },
  {
    id: 10,
    status: "ongoing",
    customer: "Amanda White",
    order_id: "HTD010",
    total: 1350.0,
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    subtotal: 1250.0,
    tax: 100.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "Extra rice",
    orderitem_set: [
      {
        id: 17,
        quantity: 3,
        menu_item: { name: "Hilsha Fish Curry", base_price: 400.0 },
      },
      {
        id: 18,
        quantity: 2,
        menu_item: { name: "Basmati Rice", base_price: 225.0 },
      },
    ],
  },
  {
    id: 11,
    status: "completed",
    customer: "Kevin Taylor",
    order_id: "HTD011",
    total: 720.25,
    created_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    subtotal: 665.25,
    tax: 55.0,
    discount: 0,
    payment_method: "nagad",
    checkout_note: "",
    orderitem_set: [
      {
        id: 19,
        quantity: 2,
        menu_item: { name: "Chicken Karahi", base_price: 280.0 },
      },
      {
        id: 20,
        quantity: 1,
        menu_item: { name: "Garlic Naan", base_price: 105.25 },
      },
    ],
  },
  {
    id: 12,
    status: "cancelled",
    customer: "Michelle Lee",
    order_id: "HTD012",
    total: 450.0,
    created_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    subtotal: 415.0,
    tax: 35.0,
    discount: 0,
    payment_method: "bkash",
    checkout_note: "",
    orderitem_set: [
      {
        id: 21,
        quantity: 1,
        menu_item: { name: "Chicken Sandwich", base_price: 215.0 },
      },
      {
        id: 22,
        quantity: 1,
        menu_item: { name: "French Fries", base_price: 200.0 },
      },
    ],
  },
  {
    id: 13,
    status: "completed",
    customer: "Ryan Thompson",
    order_id: "HTD013",
    total: 990.75,
    created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    subtotal: 915.75,
    tax: 75.0,
    discount: 0,
    payment_method: "cash_on_delivery",
    checkout_note: "Well done",
    orderitem_set: [
      {
        id: 23,
        quantity: 2,
        menu_item: { name: "Beef Steak", base_price: 350.0 },
      },
      {
        id: 24,
        quantity: 1,
        menu_item: { name: "Mashed Potato", base_price: 215.75 },
      },
    ],
  },
  {
    id: 14,
    status: "completed",
    customer: "Nicole Clark",
    order_id: "HTD014",
    total: 635.5,
    created_date: new Date(
      Date.now() - 0.5 * 24 * 60 * 60 * 1000
    ).toISOString(), // 12 hours ago
    subtotal: 585.5,
    tax: 50.0,
    discount: 0,
    payment_method: "nagad",
    checkout_note: "No cilantro",
    orderitem_set: [
      {
        id: 25,
        quantity: 1,
        menu_item: { name: "Thai Green Curry", base_price: 385.5 },
      },
      {
        id: 26,
        quantity: 1,
        menu_item: { name: "Jasmine Rice", base_price: 200.0 },
      },
    ],
  },
  {
    id: 15,
    status: "ongoing",
    customer: "Brandon Lewis",
    order_id: "HTD015",
    total: 825.0,
    created_date: new Date(
      Date.now() - 0.2 * 24 * 60 * 60 * 1000
    ).toISOString(), // 5 hours ago
    subtotal: 760.0,
    tax: 65.0,
    discount: 0,
    payment_method: "bkash",
    checkout_note: "",
    orderitem_set: [
      {
        id: 27,
        quantity: 2,
        menu_item: { name: "Lamb Chops", base_price: 380.0 },
      },
    ],
  },
];

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const useRecentOrders = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    mode: "last7days",
  });
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredOrders = useMemo(() => {
    let orders = staticOrders;

    // Apply date filter
    if (dateFilter.mode === "last7days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.created_date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } else if (dateFilter.mode === "custom" && dateFilter.range) {
      const startDate = new Date(dateFilter.range.startDate);
      const endDate = new Date(dateFilter.range.endDate);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.created_date);
        return orderDate >= startDate && orderDate <= endDate;
      });
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

    return orders;
  }, [dateFilter, filter]);

  const orderCounts = useMemo(() => {
    let orders = staticOrders;

    // Apply date filter for counts
    if (dateFilter.mode === "last7days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.created_date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } else if (dateFilter.mode === "custom" && dateFilter.range) {
      const startDate = new Date(dateFilter.range.startDate);
      const endDate = new Date(dateFilter.range.endDate);

      orders = orders.filter((order) => {
        const orderDate = new Date(order.created_date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

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
  }, [dateFilter]);

  const refetch = async () => {
    // Mock refetch for static data
    return Promise.resolve();
  };

  return {
    orders: filteredOrders,
    orderCounts,
    isLoading: false,
    error: null,
    dateFilter,
    setDateFilter,
    filter,
    setFilter,
    refetch,
  };
};
