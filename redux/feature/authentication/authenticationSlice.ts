import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user info object
interface UserInfo {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

// Define the auth state structure
interface AuthState {
  token?: string;
  user_info?: UserInfo;
}

// Initial state
const initialState: AuthState = {
  token: undefined,
  user_info: undefined,
};

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<{ token: string; user: UserInfo }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user_info = user;

      AsyncStorage.setItem("auth", JSON.stringify({ token, user })).catch(
        (err) => console.error("Failed to save auth data:", err)
      );
    },

    userLoggedOut: (state) => {
      state.token = undefined;
      state.user_info = undefined;

      AsyncStorage.removeItem("auth").catch((err) =>
        console.error("Failed to remove auth data:", err)
      );
    },

    restoreAuthState: (
      state,
      action: PayloadAction<{ token?: string; user?: UserInfo }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user_info = user;
    },
  },
});

// Types for selectors
interface RootState {
  auth: AuthState;
}

// Selectors
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user_info;

export const { userLoggedIn, userLoggedOut, restoreAuthState } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
