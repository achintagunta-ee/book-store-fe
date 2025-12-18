import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  logoutApi,
  getCurrentUserApi,
  updateUserProfileApi,
  forgotPasswordApi,
  resetPasswordApi,
  type RegisterData,
  type UserProfile,
  type AddressData,
  saveAddressApi,
  getAddressSummaryApi,
  listAddressesApi,
  confirmOrderApi,
  placeOrderApi,
  getOrderConfirmationApi,
  completePaymentApi,
  trackOrderApi,
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  type AddressItem,
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
  checkWishlistStatusApi,
  getWishlistCountApi,
  type WishlistItem,
  getOrderHistoryApi,
  getOrderDetailsApi,
  type OrderHistoryItem,
  type OrderDetailResponse,
  type AddressSummaryResponse,
  type ConfirmOrderResponse,
  getAdminPaymentsApi,
  getAdminPaymentByIdApi,
  type AdminPaymentsParams,
  type AdminPaymentsResponse,
  type AdminPaymentDetail,
  downloadInvoiceApi,
  viewOrderInvoiceApi,
  getInvoiceApi,
  getPaymentReceiptApi,
  type ViewInvoiceResponse,
  type PaymentReceiptResponse,
  getAdminOrdersApi,
  getAdminOrderDetailsApi,
  type AdminOrdersResponse,
  type AdminOrderDetail,
  type AdminOrdersParams,
  notifyCustomerApi,
} from "../utilis/authApi";

const PROFILE_KEY = "user_profile";

function saveTokens(access: string, refresh: string) {
  try {
    localStorage.setItem(TOKEN_KEYS.access, access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
  } catch {
    // no-op: storage might be unavailable
  }
}

function clearTokensAndProfile() {
  try {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    localStorage.removeItem(PROFILE_KEY);
  } catch {}
}

function loadTokens(): { access: string | null; refresh: string | null } {
  try {
    return {
      access: localStorage.getItem(TOKEN_KEYS.access),
      refresh: localStorage.getItem(TOKEN_KEYS.refresh),
    };
  } catch {
    return { access: null, refresh: null };
  }
}

function loadUserProfile(): UserProfile | null {
  try {
    const profileData = localStorage.getItem(PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
  } catch {
    return null;
  }
}

function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

const TOKEN_KEYS = {
  access: "auth_access",
  refresh: "auth_refresh",
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  profileStatus: "idle" | "loading" | "succeeded" | "failed";
  profileError: string | null;
  addresses: AddressItem[];
  addressStatus: "idle" | "loading" | "succeeded" | "failed";
  addressError: string | null;
  wishlist: WishlistItem[];
  wishlistStatus: "idle" | "loading" | "succeeded" | "failed";
  wishlistError: string | null;
  wishlistCount: number;
  orderHistory: OrderHistoryItem[];
  orderHistoryStatus: "idle" | "loading" | "succeeded" | "failed";
  orderHistoryError: string | null;
  currentOrder: OrderDetailResponse | null;
  currentOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  currentOrderError: string | null;
  checkoutOrder: OrderDetailResponse | null;
  checkoutOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  checkoutOrderError: string | null;
  addressSummary: AddressSummaryResponse | null;
  addressSummaryStatus: "idle" | "loading" | "succeeded" | "failed";
  confirmOrderData: ConfirmOrderResponse | null;
  confirmOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  adminPayments: AdminPaymentsResponse | null;
  adminPaymentsStatus: "idle" | "loading" | "succeeded" | "failed";
  adminPaymentsError: string | null;
  adminPaymentDetail: AdminPaymentDetail | null;
  adminPaymentDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  adminPaymentDetailError: string | null;
  invoice: ViewInvoiceResponse | null;
  invoiceStatus: "idle" | "loading" | "succeeded" | "failed";
  invoiceError: string | null;
  receipt: PaymentReceiptResponse | null;
  receiptStatus: "idle" | "loading" | "succeeded" | "failed";
  receiptError: string | null;
  adminOrders: AdminOrdersResponse | null;
  adminOrdersStatus: "idle" | "loading" | "succeeded" | "failed";
  adminOrdersError: string | null;
  adminOrderDetail: AdminOrderDetail | null;
  adminOrderDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  adminOrderDetailError: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  status: "idle",
  error: null,
  profileStatus: "idle",
  profileError: null,
  addresses: [],
  addressStatus: "idle",
  addressError: null,
  wishlist: [],
  wishlistStatus: "idle",
  wishlistError: null,
  wishlistCount: 0,
  orderHistory: [],
  orderHistoryStatus: "idle",
  orderHistoryError: null,
  currentOrder: null,
  currentOrderStatus: "idle",
  currentOrderError: null,
  checkoutOrder: null,
  checkoutOrderStatus: "idle",
  checkoutOrderError: null,
  addressSummary: null,
  addressSummaryStatus: "idle",
  confirmOrderData: null,
  confirmOrderStatus: "idle",
  adminPayments: null,
  adminPaymentsStatus: "idle",
  adminPaymentsError: null,
  adminPaymentDetail: null,
  adminPaymentDetailStatus: "idle",
  adminPaymentDetailError: null,
  invoice: null,
  invoiceStatus: "idle",
  invoiceError: null,
  receipt: null,
  receiptStatus: "idle",
  receiptError: null,
  adminOrders: null,
  adminOrdersStatus: "idle",
  adminOrdersError: null,
  adminOrderDetail: null,
  adminOrderDetailStatus: "idle",
  adminOrderDetailError: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await loginApi(email, password);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Login failed");
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const data = await registerApi(registerData);
      // Registration is successful, but we don't log the user in automatically.
      // The response can be used to show a success message.
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Registration failed");
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUserApi();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch user");
      }
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const updateUserProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: FormData, { rejectWithValue }) => {
    try {
      const data = await updateUserProfileApi(profileData);
      return data.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update profile");
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    // We can call the backend logout, but the main logic is clearing client-side data.
    await logoutApi();
  } catch (error: unknown) {
    // Even if the API call fails, we should still log the user out on the client.
    console.error(
      "Logout API call failed, but logging out client-side.",
      error
    );
  }
});

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await forgotPasswordApi(email);
      return data; // Return the full response { message, reset_code, expires_in }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to send reset link");
      }
      return rejectWithValue("Failed to send reset link");
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      code,
      new_password,
    }: {
      email: string;
      code: string;
      new_password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await resetPasswordApi(email, code, new_password);
      return data.message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to reset password");
      }
      return rejectWithValue("Failed to reset password");
    }
  }
);

export const saveAddressThunk = createAsyncThunk(
  "checkout/saveAddress",
  async (addressData: AddressData, { rejectWithValue }) => {
    try {
      const data = await saveAddressApi(addressData);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to save address");
      }
      return rejectWithValue("Failed to save address");
    }
  }
);

export const getAddressSummaryThunk = createAsyncThunk(
  "checkout/getAddressSummary",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAddressSummaryApi();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get address summary"
        );
      }
      return rejectWithValue("Failed to get address summary");
    }
  }
);

export const listAddressesThunk = createAsyncThunk(
  "checkout/listAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await listAddressesApi();
      return data;
    } catch (error: unknown) {
      return rejectWithValue("Failed to list addresses");
    }
  }
);

export const confirmOrderThunk = createAsyncThunk(
  "checkout/confirmOrder",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const data = await confirmOrderApi(addressId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to confirm order");
      }
      return rejectWithValue("Failed to confirm order");
    }
  }
);

export const placeOrderThunk = createAsyncThunk(
  "checkout/placeOrder",
  async (addressId: number, { rejectWithValue }) => {
    try {
      const data = await placeOrderApi(addressId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to place order");
      }
      return rejectWithValue("Failed to place order");
    }
  }
);

export const completePaymentThunk = createAsyncThunk(
  "checkout/completePayment",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const data = await completePaymentApi(orderId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to complete payment");
      }
      return rejectWithValue("Failed to complete payment");
    }
  }
);

export const getOrderConfirmationThunk = createAsyncThunk(
  "checkout/getOrderConfirmation",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const data = await getOrderConfirmationApi(orderId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get order confirmation"
        );
      }
      return rejectWithValue("Failed to get order confirmation");
    }
  }
);

export const trackOrderThunk = createAsyncThunk(
  "checkout/trackOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await trackOrderApi(orderId);
    } catch (error: unknown) {
      return rejectWithValue("Failed to track order");
    }
  }
);

export const downloadInvoiceThunk = createAsyncThunk(
  "checkout/downloadInvoice",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await downloadInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to download invoice");
      }
      return rejectWithValue("Failed to download invoice");
    }
  }
);

export const viewOrderInvoiceThunk = createAsyncThunk(
  "checkout/viewInvoice",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await viewOrderInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to view invoice");
      }
      return rejectWithValue("Failed to view invoice");
    }
  }
);

export const getAddressesThunk = createAsyncThunk(
  "auth/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      return await getAddressesApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch addresses");
      }
      return rejectWithValue("Failed to fetch addresses");
    }
  }
);

export const addAddressThunk = createAsyncThunk(
  "auth/addAddress",
  async (data: AddressData, { rejectWithValue }) => {
    try {
      const res = await addAddressApi(data);
      const id = res.address_id || res.id;
      if (!id) {
        throw new Error("Failed to retrieve address ID");
      }
      // Construct the address object to add to state immediately
      return {
        id,
        ...data,
        full_name: `${data.first_name} ${data.last_name}`,
      } as AddressItem;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to add address");
      }
      return rejectWithValue("Failed to add address");
    }
  }
);

export const updateAddressThunk = createAsyncThunk(
  "auth/updateAddress",
  async (
    { id, data }: { id: number; data: AddressData },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateAddressApi(id, data);
      return res.address;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update address");
      }
      return rejectWithValue("Failed to update address");
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  "auth/deleteAddress",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteAddressApi(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to delete address");
      }
      return rejectWithValue("Failed to delete address");
    }
  }
);

export const getWishlistThunk = createAsyncThunk(
  "wishlist/get",
  async (_, { rejectWithValue }) => {
    try {
      return await getWishlistApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch wishlist");
      }
      return rejectWithValue("Failed to fetch wishlist");
    }
  }
);

export const addToWishlistThunk = createAsyncThunk(
  "wishlist/add",
  async (bookId: number, { rejectWithValue }) => {
    try {
      const res = await addToWishlistApi(bookId);
      return res;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to add to wishlist");
      }
      return rejectWithValue("Failed to add to wishlist");
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  "wishlist/remove",
  async (bookId: number, { rejectWithValue }) => {
    try {
      await removeFromWishlistApi(bookId);
      return bookId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to remove from wishlist"
        );
      }
      return rejectWithValue("Failed to remove from wishlist");
    }
  }
);

export const checkWishlistStatusThunk = createAsyncThunk(
  "wishlist/status",
  async (bookId: number, { rejectWithValue }) => {
    try {
      return await checkWishlistStatusApi(bookId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to check wishlist status"
        );
      }
      return rejectWithValue("Failed to check wishlist status");
    }
  }
);

export const getWishlistCountThunk = createAsyncThunk(
  "wishlist/count",
  async (_, { rejectWithValue }) => {
    try {
      return await getWishlistCountApi();
    } catch (error: unknown) {
      return rejectWithValue("Failed to get wishlist count");
    }
  }
);

export const getOrderHistoryThunk = createAsyncThunk(
  "auth/getOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrderHistoryApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch order history"
        );
      }
      return rejectWithValue("Failed to fetch order history");
    }
  }
);

export const getOrderDetailsThunk = createAsyncThunk(
  "auth/getOrderDetails",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getOrderDetailsApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch order details"
        );
      }
      return rejectWithValue("Failed to fetch order details");
    }
  }
);

export const getAdminPaymentsThunk = createAsyncThunk(
  "admin/getPayments",
  async (params: AdminPaymentsParams, { rejectWithValue }) => {
    try {
      return await getAdminPaymentsApi(params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch payments");
      }
      return rejectWithValue("Failed to fetch payments");
    }
  }
);

export const getAdminPaymentByIdThunk = createAsyncThunk(
  "admin/getPaymentById",
  async (paymentId: number, { rejectWithValue }) => {
    try {
      return await getAdminPaymentByIdApi(paymentId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch payment details"
        );
      }
      return rejectWithValue("Failed to fetch payment details");
    }
  }
);

export const getInvoiceThunk = createAsyncThunk(
  "admin/getInvoice",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch invoice");
      }
      return rejectWithValue("Failed to fetch invoice");
    }
  }
);

export const getPaymentReceiptThunk = createAsyncThunk(
  "admin/getPaymentReceipt",
  async (paymentId: number, { rejectWithValue }) => {
    try {
      return await getPaymentReceiptApi(paymentId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch receipt");
      }
      return rejectWithValue("Failed to fetch receipt");
    }
  }
);

export const getAdminOrdersThunk = createAsyncThunk(
  "admin/getOrders",
  async (params: AdminOrdersParams, { rejectWithValue }) => {
    try {
      return await getAdminOrdersApi(params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch orders");
      }
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

export const notifyCustomerThunk = createAsyncThunk(
  "admin/notifyCustomer",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await notifyCustomerApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to notify customer");
      }
      return rejectWithValue("Failed to notify customer");
    }
  }
);

export const getAdminOrderDetailsThunk = createAsyncThunk(
  "admin/getOrderDetails",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getAdminOrderDetailsApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch order details");
      }
      return rejectWithValue("Failed to fetch order details");
    }
  }
);

// checkWishlistStatusThunk is typically used in components locally,
// but can be added here if needed for global state tracking.
// For now, we focus on the list management.

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      const { access, refresh } = loadTokens();
      const profile = loadUserProfile();

      console.log("Hydrating from storage:", {
        access: !!access,
        profile: !!profile,
      });

      state.accessToken = access;
      state.refreshToken = refresh;

      if (profile) {
        state.userProfile = profile;
        state.profileStatus = "succeeded";
      } else if (access) {
        // Have token but no profile - will trigger fetch
        state.profileStatus = "idle";
      }
    },
    logout(state) {
      clearTokensAndProfile();
      state.accessToken = null;
      state.refreshToken = null;
      state.userProfile = null;
      state.status = "idle";
      state.profileStatus = "idle";
    },
    clearError(state) {
      state.error = null;
    },
    clearProfileError(state) {
      state.profileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.access_token;
        state.refreshToken = null; // API does not provide a refresh token
        state.profileStatus = "idle"; // Set to idle to trigger profile fetch
        saveTokens(action.payload.access_token, ""); // Storing empty string for refresh token
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Login failed";
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = "succeeded"; // Or 'idle' if you prefer, as it's just a success message
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Registration failed";
      })
      // Get Current User
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.profileStatus = "loading";
        state.profileError = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.userProfile = action.payload;
        saveUserProfile(action.payload);
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.profileError =
          (action.payload as string) || "Failed to fetch profile";
        // If fetching profile fails, we should log the user out as the token is likely invalid.
        clearTokensAndProfile();
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Update User Profile
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        saveUserProfile(action.payload);
      })
      // We don't need to handle pending/fulfilled/rejected for forgot/reset password
      // in the main slice state, as this is typically handled with local component
      // state and toasts for user feedback. Adding them here could cause
      // unintended side effects on the global 'status' and 'error' fields.
      // .addCase(forgotPasswordThunk.fulfilled, (state, action) => { ... })
      // .addCase(resetPasswordThunk.fulfilled, (state, action) => { ... })

      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        clearTokensAndProfile();
        state.accessToken = null;
        state.refreshToken = null;
        state.userProfile = null;
        state.status = "idle";
        state.profileStatus = "idle";
      })
      // Address CRUD
      .addCase(getAddressesThunk.pending, (state) => {
        state.addressStatus = "loading";
      })
      .addCase(getAddressesThunk.fulfilled, (state, action) => {
        state.addressStatus = "succeeded";
        state.addresses = action.payload;
      })
      .addCase(getAddressesThunk.rejected, (state, action) => {
        state.addressStatus = "failed";
        state.addressError = action.payload as string;
      })
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (a) => a.id !== action.payload
        );
      })
      // Wishlist
      .addCase(getWishlistThunk.pending, (state) => {
        state.wishlistStatus = "loading";
      })
      .addCase(getWishlistThunk.fulfilled, (state, action) => {
        state.wishlistStatus = "succeeded";
        state.wishlist = action.payload;
        state.wishlistCount = action.payload.length;
      })
      .addCase(getWishlistThunk.rejected, (state, action) => {
        state.wishlistStatus = "failed";
        state.wishlistError = action.payload as string;
      })
      // Admin Orders
      .addCase(getAdminOrdersThunk.pending, (state) => {
        state.adminOrdersStatus = "loading";
      })
      .addCase(getAdminOrdersThunk.fulfilled, (state, action) => {
        state.adminOrdersStatus = "succeeded";
        state.adminOrders = action.payload;
      })
      .addCase(getAdminOrdersThunk.rejected, (state, action) => {
        state.adminOrdersStatus = "failed";
        state.adminOrdersError = action.payload as string;
      })
      // Admin Order Details
      .addCase(getAdminOrderDetailsThunk.pending, (state) => {
        state.adminOrderDetailStatus = "loading";
      })
      .addCase(getAdminOrderDetailsThunk.fulfilled, (state, action) => {
        state.adminOrderDetailStatus = "succeeded";
        state.adminOrderDetail = action.payload;
      })
      .addCase(getAdminOrderDetailsThunk.rejected, (state, action) => {
        state.adminOrderDetailStatus = "failed";
        state.adminOrderDetailError = action.payload as string;
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (item) => item.book_id !== action.payload
        );
        state.wishlistCount = Math.max(0, state.wishlistCount - 1);
      })
      .addCase(getWishlistCountThunk.fulfilled, (state, action) => {
        state.wishlistCount = action.payload.count;
      })
      // Order History
      .addCase(getOrderHistoryThunk.pending, (state) => {
        state.orderHistoryStatus = "loading";
      })
      .addCase(getOrderHistoryThunk.fulfilled, (state, action) => {
        state.orderHistoryStatus = "succeeded";
        state.orderHistory = action.payload;
      })
      .addCase(getOrderHistoryThunk.rejected, (state, action) => {
        state.orderHistoryStatus = "failed";
        state.orderHistoryError = action.payload as string;
      })
      // Order Details
      .addCase(getOrderDetailsThunk.pending, (state) => {
        state.currentOrderStatus = "loading";
      })
      .addCase(getOrderDetailsThunk.fulfilled, (state, action) => {
        state.currentOrderStatus = "succeeded";
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetailsThunk.rejected, (state, action) => {
        state.currentOrderStatus = "failed";
        state.currentOrderError = action.payload as string;
      })

      // Address Summary
      .addCase(getAddressSummaryThunk.pending, (state) => {
        state.addressSummaryStatus = "loading";
      })
      .addCase(getAddressSummaryThunk.fulfilled, (state, action) => {
        state.addressSummaryStatus = "succeeded";
        state.addressSummary = action.payload;
      })
      .addCase(getAddressSummaryThunk.rejected, (state) => {
        state.addressSummaryStatus = "failed";
      })
      // Confirm Order
      .addCase(confirmOrderThunk.pending, (state) => {
        state.confirmOrderStatus = "loading";
      })
      .addCase(confirmOrderThunk.fulfilled, (state, action) => {
        state.confirmOrderStatus = "succeeded";
        state.confirmOrderData = action.payload;
      })
      // Admin Payments
      .addCase(getAdminPaymentsThunk.pending, (state) => {
        state.adminPaymentsStatus = "loading";
      })
      .addCase(getAdminPaymentsThunk.fulfilled, (state, action) => {
        state.adminPaymentsStatus = "succeeded";
        state.adminPayments = action.payload;
      })
      .addCase(getAdminPaymentsThunk.rejected, (state, action) => {
        state.adminPaymentsStatus = "failed";
        state.adminPaymentsError = action.payload as string;
      })
      .addCase(getAdminPaymentByIdThunk.pending, (state) => {
        state.adminPaymentDetailStatus = "loading";
      })
      .addCase(getAdminPaymentByIdThunk.fulfilled, (state, action) => {
        state.adminPaymentDetailStatus = "succeeded";
        state.adminPaymentDetail = action.payload;
      })
      .addCase(getAdminPaymentByIdThunk.rejected, (state, action) => {
        state.adminPaymentDetailStatus = "failed";
        state.adminPaymentDetailError = action.payload as string;
      })

      // Invoice
      .addCase(getInvoiceThunk.pending, (state) => {
        state.invoiceStatus = "loading";
        state.invoiceError = null;
        state.invoice = null;
      })
      .addCase(getInvoiceThunk.fulfilled, (state, action) => {
        state.invoiceStatus = "succeeded";
        state.invoice = action.payload;
      })
      .addCase(getInvoiceThunk.rejected, (state, action) => {
        state.invoiceStatus = "failed";
        state.invoiceError = action.payload as string;
      })

      // Receipt
      .addCase(getPaymentReceiptThunk.pending, (state) => {
        state.receiptStatus = "loading";
        state.receiptError = null;
        state.receipt = null;
      })
      .addCase(getPaymentReceiptThunk.fulfilled, (state, action) => {
        state.receiptStatus = "succeeded";
        state.receipt = action.payload;
      })
      .addCase(getPaymentReceiptThunk.rejected, (state, action) => {
        state.receiptStatus = "failed";
        state.receiptError = action.payload as string;
      });
  },
});
export const {
  logout,
  clearError,
  clearProfileError,
  hydrateFromStorage,
} = authSlice.actions;
export default authSlice.reducer;
