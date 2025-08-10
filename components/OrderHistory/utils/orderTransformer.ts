import { ApiOrder, OrderHistory } from "../types";

/**
 * Transforms API order data to the existing OrderHistory format
 * This maintains backward compatibility with existing components
 */
export const transformApiOrderToOrderHistory = (
  apiOrder: ApiOrder
): OrderHistory => {
  // Use actual first_name and last_name from API response
  const firstName = apiOrder.user.first_name || "";
  const lastName = apiOrder.user.last_name || "";

  // Get the primary address - prefer dropoff address, fallback to user address
  // Priority: full_address > street_name > "Address not available"
  let primaryAddress = "Address not available";

  if (apiOrder.dropoff_address_details) {
    if (
      apiOrder.dropoff_address_details.full_address &&
      apiOrder.dropoff_address_details.full_address.trim() !== ""
    ) {
      primaryAddress = apiOrder.dropoff_address_details.full_address;
    } else if (
      apiOrder.dropoff_address_details.street_name &&
      apiOrder.dropoff_address_details.street_name.trim() !== ""
    ) {
      primaryAddress = apiOrder.dropoff_address_details.street_name;
    }
  } else if (apiOrder.user.address && apiOrder.user.address.trim() !== "") {
    primaryAddress = apiOrder.user.address;
  }

  // Get restaurant address - prefer pickup address details, fallback to restaurant location
  // Priority: pickup_address_details.full_address > pickup_address_details.street_name > restaurant.location > "Address not available"
  let restaurantAddress = "Address not available";

  if (apiOrder.pickup_address_details) {
    if (
      apiOrder.pickup_address_details.full_address &&
      apiOrder.pickup_address_details.full_address.trim() !== ""
    ) {
      restaurantAddress = apiOrder.pickup_address_details.full_address;
    } else if (
      apiOrder.pickup_address_details.street_name &&
      apiOrder.pickup_address_details.street_name.trim() !== ""
    ) {
      restaurantAddress = apiOrder.pickup_address_details.street_name;
    }
  } else if (
    apiOrder.restaurant.location &&
    apiOrder.restaurant.location.trim() !== ""
  ) {
    restaurantAddress = apiOrder.restaurant.location;
  }

  return {
    id: apiOrder.id,
    order_id: apiOrder.order_id,
    status: apiOrder.status,
    restaurant: {
      id: apiOrder.restaurant.id,
      name: apiOrder.restaurant.name,
      logo: apiOrder.restaurant.logo,
      address: restaurantAddress,
      phone: apiOrder.restaurant.phone,
      email: apiOrder.restaurant.email,
    },
    user: {
      id: apiOrder.user.id,
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim() || "User", // Keep for backward compatibility
      phone: apiOrder.user.phone, // Use user phone since address details don't have phone
      email: apiOrder.user.email,
      address: primaryAddress,
      location: {
        latitude: 0, // API doesn't provide coordinates
        longitude: 0,
        address: primaryAddress,
      },
    },
    orderitem_set: apiOrder.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      menu_item: {
        id: item.menu_item_id,
        name: item.name,
        base_price: item.base_price,
        image: undefined, // API doesn't provide item images
      },
      subtotal: item.base_price * item.quantity,
    })),
    subtotal: apiOrder.total - apiOrder.tax - apiOrder.delivery_fee,
    tax: apiOrder.tax,
    discount: apiOrder.discount,
    delivery_fee: apiOrder.delivery_fee,
    total: apiOrder.total,
    payment_method:
      apiOrder.payment_method === "cash"
        ? "Cash on Delivery"
        : apiOrder.payment_method,
    checkout_note: undefined, // API doesn't provide checkout notes
    created_date: apiOrder.receive_date,
    completed_date: undefined, // API doesn't provide completion date
  };
};

/**
 * Transforms an array of API orders to OrderHistory format
 */
export const transformApiOrdersToOrderHistory = (
  apiOrders: ApiOrder[]
): OrderHistory[] => {
  return apiOrders.map(transformApiOrderToOrderHistory);
};
