import { apiSlice } from "../api/apiSlice";

export const authenticationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "api/accounts/v1/login/email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ACCOUNT"],
    }),
  }),
});

export const { useLoginMutation } = authenticationApi;
