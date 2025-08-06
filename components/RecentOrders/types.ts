export interface Order {
  id: number;
  status: string;
  customer: string;
  order_id: string;
  total: number;
  created_date: string;
  subtotal: number;
  tax: number;
  discount: number;
  payment_method: string;
  checkout_note: string;
  orderitem_set: {
    id: number;
    quantity: number;
    menu_item: {
      name: string;
      base_price: number;
    };
  }[];
}

export type FilterType = "all" | "ongoing" | "completed" | "cancelled";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateFilter {
  mode: "last7days" | "custom";
  range?: DateRange;
}
