import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../slice/bookSlice";
import authReducer from "../slice/authSlice";

export const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {books: BooksState}
export type AppDispatch = typeof store.dispatch;
