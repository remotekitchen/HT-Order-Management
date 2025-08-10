import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authenticationSlice";

export const authenticationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "api/accounts/v1/user/quick-login/",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;

          if (response.token) {
            const userData = {
              id: response.user_id,
              email: response.email,
              name: response.name,
              label: response.label,
              fcm_token: response.fcm_token,
              created_at: response.created_at,
            };

            // Store in AsyncStorage
            await AsyncStorage.setItem(
              "auth",
              JSON.stringify({
                token: response.token,
                user: userData,
              })
            );

            // Update Redux state
            dispatch(
              userLoggedIn({
                token: response.token,
                user: userData,
              })
            );
          }
        } catch (error) {
          console.error("Failed to handle login response:", error);
        }
      },
      invalidatesTags: ["ACCOUNT"],
    }),
  }),
});

export const { useLoginMutation } = authenticationApi;
