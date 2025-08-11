import { render, screen } from "@testing-library/react-native";
import React from "react";
import { OrderDetailsModal } from "../index";
import { GenericOrder } from "../types";

// Mock the individual components for testing
jest.mock("../components/RestaurantInfoSection", () => {
  return function MockRestaurantInfoSection() {
    return <div data-testid="restaurant-info">Restaurant Info</div>;
  };
});

jest.mock("../components/CustomerInfoSection", () => {
  return function MockCustomerInfoSection() {
    return <div data-testid="customer-info">Customer Info</div>;
  };
});

jest.mock("../components/OrderInfoSection", () => {
  return function MockOrderInfoSection() {
    return <div data-testid="order-info">Order Info</div>;
  };
});

jest.mock("../components/OrderItemsSection", () => {
  return function MockOrderItemsSection() {
    return <div data-testid="order-items">Order Items</div>;
  };
});

jest.mock("../components/OrderSummarySection", () => {
  return function MockOrderSummarySection() {
    return <div data-testid="order-summary">Order Summary</div>;
  };
});

jest.mock("../components/SpecialInstructionsSection", () => {
  return function MockSpecialInstructionsSection() {
    return <div data-testid="special-instructions">Special Instructions</div>;
  };
});

const mockOrder: GenericOrder = {
  id: 1,
  order_id: "ORD-001",
  status: "completed",
  total: 25.5,
  subtotal: 20.0,
  tax: 3.0,
  discount: 2.5,
  payment_method: "Credit Card",
  created_date: "2024-01-01T10:00:00Z",
  restaurant_name: "Test Restaurant",
  restaurant_logo: "https://example.com/logo.png",
  restaurant_address: "123 Test St",
  restaurant_phone: "555-0123",
  customer: "John Doe",
  customer_phone: "555-0124",
  customer_address: "456 Customer Ave",
  items: [
    {
      id: 1,
      quantity: 2,
      name: "Test Item",
      base_price: 10.0,
    },
  ],
};

describe("OrderDetailsModal", () => {
  it("renders without crashing", () => {
    render(
      <OrderDetailsModal visible={true} order={mockOrder} onClose={() => {}} />
    );
  });

  it("renders all sections when order is provided", () => {
    render(
      <OrderDetailsModal visible={true} order={mockOrder} onClose={() => {}} />
    );

    expect(screen.getByTestId("restaurant-info")).toBeTruthy();
    expect(screen.getByTestId("customer-info")).toBeTruthy();
    expect(screen.getByTestId("order-info")).toBeTruthy();
    expect(screen.getByTestId("order-items")).toBeTruthy();
    expect(screen.getByTestId("order-summary")).toBeTruthy();
    expect(screen.getByTestId("special-instructions")).toBeTruthy();
  });

  it("does not render when order is null", () => {
    const { container } = render(
      <OrderDetailsModal visible={true} order={null} onClose={() => {}} />
    );

    expect(container.children).toHaveLength(0);
  });
});
