import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.chatchefs.com/",
    prepareHeaders: async (headers) => {
      headers.set("Content-Type", "application/json");

      try {
        const authData = await AsyncStorage.getItem("auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          const token = parsedAuth?.token;

          if (token) {
            headers.set("Authorization", `token ${token}`);
            // console.log("Authorization header set:", `token ${token}`);
          } else {
            console.log("No token found in auth data");
          }
        } else {
          console.log("No auth data found in AsyncStorage");
        }
      } catch (err) {
        console.error("Failed to load auth token:", err);
      }

      return headers;
    },
  }),
  tagTypes: ["ACCOUNT"],
  endpoints: () => ({}),
});
