export interface Restaurant {
  id: number;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string; // Keep for backward compatibility
  phone: string;
  email: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface OrderItem {
  id: number;
  quantity: number;
  menu_item: {
    id: number;
    name: string;
    base_price: number;
    image?: string;
  };
  subtotal: number;
}

export interface OrderHistory {
  id: number;
  order_id: string;
  status: string;
  restaurant: Restaurant;
  user: User;
  orderitem_set: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  checkout_note?: string;
  created_date: string;
  completed_date?: string;
}

// New types for API response
export interface ApiOrderItem {
  id: number;
  order_id: number;
  quantity: number;
  menu_item_id: number;
  name: string;
  base_price: number;
  virtual_price: number;
  original_price: number;
  modifiers: any[];
  created_date: string;
  modified_date: string;
}

export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_blocked: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  date_of_birth: string | null;
  reward_points: number;
  direct_order_only: boolean;
  agree: boolean;
  uid: string | null;
  is_sales: boolean;
  super_power: boolean;
  is_get_600: boolean;
  hotel_admin: boolean;
  order_count_total_rk: number;
  address: string | null;
  role: string;
}

export interface ApiRestaurant {
  id: number;
  name: string;
  location: string | null;
  phone: string;
  email: string;
  logo: string;
  avatar_image: string | null;
  banner_images: string[];
  total_sales: number;
  delivery_fee: number;
  discount_percentage: number;
  accept_scheduled_order: boolean;
  is_remote_Kitchen: boolean;
  store_type: string;
  timezone: string;
  bag_price: number;
  utensil_price: number;
  order_methods: string[];
  payment_methods: string[];
  payment_methods_pickup: string[];
  service_fee: number;
  use_delivery_inflation: boolean;
  auto_accept_orders: boolean;
  voucher_restriction: boolean;
  boosted_total_sales_count: number;
  boosted_monthly_sales_count: number;
  boosted_average_ticket_size: number;
  priority: number;
}

export interface ApiOrder {
  id: number;
  order_id: string;
  user_id: number;
  restaurant_id: number;
  status: string;
  order_method: string;
  payment_method: string;
  total: number;
  tax: number;
  delivery_fee: number;
  original_delivery_fee: number;
  discount: number;
  special_discount: number | null;
  special_discount_reason: string | null;
  stripe_fee: number;
  service_fee_restaurant: number | null;
  service_fee_chatchefs: number | null;
  ht_delivery_fee_expense: number | null;
  customer_delivery_fee_absorb: number | null;
  admin_received_cash: number;
  bag_fee: number;
  utensil_fee: number;
  tips: number;
  receive_date: string;
  lucky_flip_gift: any | null;
  user: ApiUser;
  restaurant: ApiRestaurant;
  items: ApiOrderItem[];
  // Updated address detail fields to match actual API response
  dropoff_address_details?: {
    id: number;
    label: string;
    full_address: string;
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    lat: number | null;
    lng: number | null;
    business_name: string;
    is_default: boolean | null;
  };
  pickup_address_details?: {
    id: number;
    label: string;
    full_address: string;
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    lat: number | null;
    lng: number | null;
    business_name: string;
    is_default: boolean | null;
  };
}

export interface ApiIncomingOrdersResponse {
  date_range: {
    start: string;
    end: string;
  };
  orders: ApiOrder[];
  total: number;
}

export type LayoutType = "list" | "grid";
