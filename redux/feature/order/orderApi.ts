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
    getOrderHistory: builder.query<any[], [string, string]>({
      query: ([start_date, end_date]) => ({
        url: `api/billing/v1/get-orders/?date=custom&start_date=${start_date}&end_date=${end_date}`,
        method: "GET",
      }),
      providesTags: ["ORDERS"],
    }),
  }),
});

export const { useGetIncomingOrdersQuery, useGetOrderHistoryQuery } = orderApi;
