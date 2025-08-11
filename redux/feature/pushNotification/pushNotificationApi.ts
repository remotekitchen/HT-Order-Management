import { apiSlice } from "../api/apiSlice";

export const pushNotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPushNotificationToken: builder.mutation({
      query: (data) => ({
        url: `api/firebase/v1/fcm-tokens/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatePushNotificationTokenMutation } = pushNotificationApi;
