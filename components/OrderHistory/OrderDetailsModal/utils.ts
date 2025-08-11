import { CustomerInfo, GenericOrder, OrderItem, RestaurantInfo } from "./types";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateSubtotal = (order: GenericOrder): number => {
  if (order.orderitem_set) {
    return order.orderitem_set.reduce(
      (sum, item) => sum + (item.subtotal || 0),
      0
    );
  }

  if (order.items) {
    return order.items.reduce(
      (sum, item) => sum + item.base_price * item.quantity,
      0
    );
  }

  return order.subtotal || 0;
};

export const getRestaurantInfo = (order: GenericOrder): RestaurantInfo => {
  if (order.restaurant) {
    return {
      name: order.restaurant.name,
      logo: order.restaurant.logo,
      address: order.restaurant.address,
      phone: order.restaurant.phone,
    };
  }

  return {
    name: order.restaurant_name || "Restaurant",
    logo: order.restaurant_logo || "https://via.placeholder.com/100",
    address: order.restaurant_address || "Address not available",
    phone: order.restaurant_phone || "Phone not available",
  };
};

export const getCustomerInfo = (order: GenericOrder): CustomerInfo => {
  if (order.user) {
    return {
      name: `${order.user.first_name} ${order.user.last_name}`,
      phone: order.user.phone,
      address: order.user.address,
    };
  }

  return {
    name: order.customer || "Customer",
    phone: order.customer_phone || "Phone not available",
    address: order.customer_address || "Address not available",
  };
};

export const getOrderItems = (order: GenericOrder): OrderItem[] => {
  if (order.orderitem_set) {
    return order.orderitem_set.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.menu_item.name,
      base_price: item.menu_item.base_price,
      subtotal: item.subtotal || item.menu_item.base_price * item.quantity,
    }));
  }

  if (order.items) {
    return order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      name: item.name,
      base_price: item.base_price,
      subtotal: item.base_price * item.quantity,
    }));
  }

  return [];
};

export const getStatusStyle = (status: string) => {
  const statusStyles = {
    completed: {
      container: "bg-green-100",
      text: "text-green-800",
    },
    cancelled: {
      container: "bg-red-100",
      text: "text-red-800",
    },
    default: {
      container: "bg-yellow-100",
      text: "text-yellow-800",
    },
  };

  return (
    statusStyles[status as keyof typeof statusStyles] || statusStyles.default
  );
};

export const formatCurrency = (amount: number): string => {
  return `৳${amount.toFixed(2)}`;
};
