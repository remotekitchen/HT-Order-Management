// Generic order interface that can handle both order types
export interface GenericOrder {
  id: number;
  order_id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  delivery_fee?: number;
  payment_method: string;
  checkout_note?: string;
  created_date: string;

  // Restaurant info (either direct or nested)
  restaurant?: {
    id: number;
    name: string;
    logo: string;
    address: string;
    phone: string;
  };
  restaurant_name?: string;
  restaurant_logo?: string;
  restaurant_address?: string;
  restaurant_phone?: string;

  // User info (either direct or nested)
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
  };
  customer?: string;
  customer_phone?: string;
  customer_address?: string;

  // Order items
  orderitem_set?: {
    id: number;
    quantity: number;
    menu_item: {
      name: string;
      base_price: number;
    };
    subtotal?: number;
  }[];
  items?: {
    id: number;
    quantity: number;
    name: string;
    base_price: number;
  }[];
}

export interface OrderDetailsModalProps {
  visible: boolean;
  order: GenericOrder | null;
  onClose: () => void;
}

export interface RestaurantInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  name: string;
  base_price: number;
  subtotal: number;
}

export interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}
