import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  type ViewCartResponse,
  viewCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from "../utilis/bookApi";

export interface CartState extends ViewCartResponse {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}

const initialState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    shipping: 0,
    final_total: 0,
  },
  status: "idle",
  error: null,
};

export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await viewCartApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (
    { bookId, quantity }: { bookId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await addToCartApi(bookId, quantity);
      dispatch(fetchCartAsync()); // Refetch cart to get updated state
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { itemId, quantity }: { itemId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await updateCartItemApi(itemId, quantity);
      dispatch(fetchCartAsync());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId: number, { dispatch, rejectWithValue }) => {
    try {
      await removeCartItemApi(itemId);
      dispatch(fetchCartAsync());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await clearCartApi();
      dispatch(fetchCartAsync());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle pending/rejected for mutation thunks to give user feedback
      .addCase(addToCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartItemAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeCartItemAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;