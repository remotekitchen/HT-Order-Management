import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getIncomingOrders: builder.query<any[], void>({
      query: () => ({
        url: "api/billing/v1/get-orders-merchant/",
        method: "GET",
      }),
      providesTags: ["ORDERS"],
    }),
    getOrderHistory: builder.query<any[], void>({
      query: () => ({
        url: "api/billing/v1/get-orders/",
        method: "GET",
      }),
      providesTags: ["ORDERS"],
    }),
  }),
});

export const { useGetIncomingOrdersQuery, useGetOrderHistoryQuery } = orderApi;
