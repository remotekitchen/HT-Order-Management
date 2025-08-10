import { OrderHistory } from "./types";

export const mockOrderHistory: OrderHistory[] = [
  {
    id: 1,
    order_id: "ORD-2024-001",
    status: "completed",
    restaurant: {
      id: 1,
      name: "Spice Garden Restaurant",
      logo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop&crop=center",
      address: "123 Main Street, Dhaka 1212",
      phone: "+880 1712-345678",
      email: "contact@spicegarden.com",
    },
    user: {
      id: 1,
      first_name: "Ahmed",
      last_name: "Hassan",
      name: "Ahmed Hassan",
      phone: "+880 1987-654321",
      email: "ahmed.hassan@email.com",
      address: "House 45, Road 12, Gulshan-2, Dhaka",
      location: {
        latitude: 23.7808875,
        longitude: 90.4267327,
        address: "House 45, Road 12, Gulshan-2, Dhaka",
      },
    },
    orderitem_set: [
      {
        id: 1,
        quantity: 4,
        menu_item: {
          id: 1,
          name: "Chicken Biryani",
          base_price: 74.5,
          image:
            "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=200&h=200&fit=crop",
        },
        subtotal: 298,
      },
      {
        id: 2,
        quantity: 2,
        menu_item: {
          id: 2,
          name: "Mutton Curry",
          base_price: 85,
          image:
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop",
        },
        subtotal: 170,
      },
    ],
    subtotal: 468,
    tax: 23.4,
    discount: 50,
    delivery_fee: 25,
    total: 466.4,
    payment_method: "Cash on Delivery",
    checkout_note: "Please ring the bell twice",
    created_date: "2024-01-15T14:30:00Z",
    completed_date: "2024-01-15T15:45:00Z",
  },
  {
    id: 2,
    order_id: "ORD-2024-002",
    status: "pending",
    restaurant: {
      id: 2,
      name: "Royal Thai Kitchen",
      logo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop&crop=center",
      address: "456 Commercial Avenue, Dhaka 1200",
      phone: "+880 1811-987654",
      email: "info@royalthai.com",
    },
    user: {
      id: 2,
      first_name: "Fatima",
      last_name: "Rahman",
      name: "Fatima Rahman",
      phone: "+880 1999-123456",
      email: "fatima.rahman@email.com",
      address: "Apartment 7B, Building 23, Banani, Dhaka",
      location: {
        latitude: 23.7937,
        longitude: 90.4066,
        address: "Apartment 7B, Building 23, Banani, Dhaka",
      },
    },
    orderitem_set: [
      {
        id: 3,
        quantity: 1,
        menu_item: {
          id: 3,
          name: "Pad Thai",
          base_price: 120,
          image:
            "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&h=200&fit=crop",
        },
        subtotal: 120,
      },
      {
        id: 4,
        quantity: 2,
        menu_item: {
          id: 4,
          name: "Green Curry",
          base_price: 95,
          image:
            "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&h=200&fit=crop",
        },
        subtotal: 190,
      },
      {
        id: 5,
        quantity: 1,
        menu_item: {
          id: 5,
          name: "Mango Sticky Rice",
          base_price: 45,
          image:
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop",
        },
        subtotal: 45,
      },
    ],
    subtotal: 355,
    tax: 17.75,
    discount: 0,
    delivery_fee: 30,
    total: 402.75,
    payment_method: "Credit Card",
    checkout_note: "Extra spicy for the curry please",
    created_date: "2024-01-16T12:15:00Z",
    completed_date: undefined,
  },
  {
    id: 3,
    order_id: "ORD-2024-003",
    status: "processing",
    restaurant: {
      id: 3,
      name: "Khulna Food Court",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=center",
      address: "07, Road, House no. 100, Sonadanga 1st Phase, Khulna",
      phone: "+880 1911-111111",
      email: "info@khulnafood.com",
    },
    user: {
      id: 3,
      first_name: "Rahim",
      last_name: "Khan",
      name: "Rahim Khan",
      phone: "+880 1999-999999",
      email: "rahim.khan@email.com",
      address: "Outer Bypass Road, Khulna",
      location: {
        latitude: 22.8456,
        longitude: 89.5403,
        address: "Outer Bypass Road, Khulna",
      },
    },
    orderitem_set: [
      {
        id: 6,
        quantity: 2,
        menu_item: {
          id: 6,
          name: "Beef Burger",
          base_price: 150,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
        },
        subtotal: 300,
      },
      {
        id: 7,
        quantity: 1,
        menu_item: {
          id: 7,
          name: "French Fries",
          base_price: 80,
          image:
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
        },
        subtotal: 80,
      },
    ],
    subtotal: 380,
    tax: 19,
    discount: 0,
    delivery_fee: 40,
    total: 439,
    payment_method: "Cash on Delivery",
    checkout_note: "Please deliver to the main gate",
    created_date: "2024-01-17T18:30:00Z",
    completed_date: undefined,
  },
];
