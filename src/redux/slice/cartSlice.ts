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

const GUEST_CART_KEY = "guest_cart";

const getGuestCart = (): CartState => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    if (!data) return { items: [], summary: { subtotal: 0, shipping: 0, final_total: 0 }, status: "idle", error: null };
    return JSON.parse(data);
  } catch {
    return { items: [], summary: { subtotal: 0, shipping: 0, final_total: 0 }, status: "idle", error: null };
  }
};

const saveGuestCart = (cart: CartState) => {
  try {
    // Recalculate summary
    let subtotal = 0;
    cart.items.forEach((item) => {
      subtotal += item.effective_price * item.quantity;
    });
    cart.summary.subtotal = subtotal;
    cart.summary.final_total = subtotal + cart.summary.shipping;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {}
};


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
      const token = localStorage.getItem("auth_access");
      if (!token) {
        const cart = getGuestCart();
        return { items: cart.items, summary: cart.summary };
      }
      const response = await viewCartApi(); // Returns CartDetailsResponse
      
      // Map to ViewCartResponse structure for compatibility
      return {
        items: response.items.map(item => ({
            item_id: item.item_id,
            book_id: item.book_id,
            book_name: item.book_name,
            slug: item.slug,
            cover_image_url: item.cover_image_url,
            price: item.price,
            discount_price: item.discount_price,
            offer_price: item.offer_price,
            effective_price: item.effective_price,
            quantity: item.quantity,
            stock: item.stock,
            in_stock: item.in_stock,
            total: item.total
        })),
        summary: {
            subtotal: response.subtotal,
            shipping: response.shipping,
            tax: response.tax,
            final_total: response.total
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (
    { bookId, quantity, book }: { bookId: number; quantity: number; book?: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("auth_access");
      if (!token) {
        const cart = getGuestCart();
        const existingItemIndex = cart.items.findIndex(
          (i) => i.book_id === bookId
        );
        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          if (!book) {
            return rejectWithValue("Book details missing for guest cart");
          }
          cart.items.push({
            item_id: Date.now(),
            book_id: bookId,
            book_name: book.title || book.book_name,
            slug: book.slug,
            cover_image_url: book.cover_image_url || book.imageUrl,
            price: book.price || 0,
            discount_price: null,
            offer_price: null,
            effective_price: book.price || book.effective_price || 0,
            quantity: quantity,
            stock: 100, // Default for guest
            in_stock: true,
            total: (book.price || book.effective_price || 0) * quantity,
          });
        }
        saveGuestCart(cart);
        dispatch(fetchCartAsync());
        return;
      }

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
      const token = localStorage.getItem("auth_access");
      if (!token) {
        const cart = getGuestCart();
        const itemIndex = cart.items.findIndex((i) => i.item_id === itemId);
        if (itemIndex > -1) {
          if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          } else {
            cart.items[itemIndex].quantity = quantity;
          }
          saveGuestCart(cart);
          dispatch(fetchCartAsync());
        }
        return;
      }
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
      const token = localStorage.getItem("auth_access");
      if (!token) {
        const cart = getGuestCart();
        cart.items = cart.items.filter((i) => i.item_id !== itemId);
        saveGuestCart(cart);
        dispatch(fetchCartAsync());
        return;
      }
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
      const token = localStorage.getItem("auth_access");
      if (!token) {
        localStorage.removeItem(GUEST_CART_KEY);
        dispatch(fetchCartAsync());
        return;
      }
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