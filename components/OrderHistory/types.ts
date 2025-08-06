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
  name: string;
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

export type LayoutType = "list" | "grid";
