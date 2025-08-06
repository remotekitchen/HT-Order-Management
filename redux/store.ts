import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./feature/api/apiSlice";
import authReducer from "./feature/authentication/authenticationSlice";

// Add your reducers here
const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// TS types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
