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
  getOrderTimelineApi,
  type OrderTimelineItem,

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
  type OrderHistoryResponse,
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
  getAdminOrderInvoiceApi,
  type AdminInvoiceResponse,
  updateOrderStatusApi,
  fetchNotificationsApi,
  viewNotificationApi,
  type NotificationItem,
  type NotificationDetail,
  getAdminNotificationsApi,
  viewAdminNotificationApi,
  type AdminNotificationItem,
  type AdminNotificationDetail,
  resendNotificationApi,
  getInventorySummaryApi,
  getInventoryListApi,
  updateBookStockApi,
  type InventorySummary,
  type InventoryItem,
  getGeneralSettingsApi,
  updateGeneralSettingsApi,
  type GeneralSettings,
  getDashboardStatsApi,
  type DashboardStats,
  adminSearchApi,
  type SearchResult,
  getPaymentDetailsApi,
  type PaymentDetails,
  addOrderTrackingApi,
  getOrderStatusApi,
  type OrderStatusResponse,
  getAdminOrderNotificationsApi,
  getSocialLinksApi,
  updateSocialLinksApi,
  type SocialLinks,
  createOfflineOrderApi,
  createOfflinePaymentApi,
  type OfflineOrderRequest,
  type OfflinePaymentRequest,
  getAdminProfileApi,
  updateAdminProfileApi,
  changeAdminPasswordApi,
  type AdminProfileResponse,
  type ChangePasswordRequest,
  getUserPaymentsApi,
  type UserPaymentsResponse,
  requestCancellationApi,
  getCancellationStatusApi,
  getAdminCancellationRequestsApi,
  processRefundApi,
  rejectCancellationApi,
  getCancellationStatsApi,
  verifyOrderStatusApi,
  type CancellationRequestPayload,
  type CancellationStatusResponse,
  type AdminCancellationRequestsResponse,
  type AdminCancellationRequestsParams,
  type ProcessRefundPayload,
  type RejectCancellationPayload,
  type CancellationStatsResponse,
  type OrderStatusResponse as VerifyOrderStatusResponse,
  completePaymentAfterExpiryApi,
  uploadEbookApi,
  purchaseEbookApi,
  createEbookRazorpayOrderApi,
  verifyEbookRazorpayPaymentApi,
  getUserLibraryApi,
  readEbookApi,
  type EbookPurchaseResponse,
  type CreateEbookRazorpayOrderResponse,
  type VerifyEbookRazorpayPaymentResponse,
  type LibraryBook,
  type ReadEbookResponse,
  type AdminOrderNotificationItem,
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
  createGuestRazorpayOrderApi,
  verifyGuestRazorpayPaymentApi,
  approveCancellationApi,
  getGuestOrderDetailsApi,
  type GuestOrderDetailsResponse,
  viewGuestOrderInvoiceApi,
  downloadGuestInvoiceApi,
  type GuestInvoiceResponse,
  getEbookPurchasesListApi,
  getEbookPaymentsListApi,
  updateEbookPriceApi,
  toggleEbookStatusApi,
  getEbookListApi,
  type EbookPurchaseItem,
  type EbookPaymentItem,
  type EbookListResponse,
  getAnalyticsOverviewApi,
  getRevenueChartApi,
  getTopBooksApi,
  getTopCustomersApi,
  getCategorySalesApi,
  type AnalyticsOverviewResponse,
  type RevenueChartItem,
  type TopBookItem,
  type TopCustomerItem,
  type CategorySaleItem,
  exportAnalyticsReportApi,
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
  addressMeta: {
    total?: number;
    total_pages?: number;
    page?: number;
    limit?: number;
  } | null;
  addressStatus: "idle" | "loading" | "succeeded" | "failed";
  addressError: string | null;
  wishlist: WishlistItem[];
  wishlistStatus: "idle" | "loading" | "succeeded" | "failed";
  wishlistError: string | null;
  wishlistCount: number;
  orderHistory: OrderHistoryResponse | null;
  orderHistoryStatus: "idle" | "loading" | "succeeded" | "failed";
  orderHistoryError: string | null;
  currentOrder: OrderDetailResponse | null;
  currentOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  currentOrderError: string | null;
  orderTimeline: OrderTimelineItem[] | null;
  orderTimelineStatus: "idle" | "loading" | "succeeded" | "failed";
  orderTimelineError: string | null;
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
  adminOrderInvoice: AdminInvoiceResponse | null;
  adminOrderInvoiceStatus: "idle" | "loading" | "succeeded" | "failed";
  adminOrderInvoiceError: string | null;
  notifications: NotificationItem[];
  notificationsStatus: "idle" | "loading" | "succeeded" | "failed";
  notificationsError: string | null;
  currentNotification: NotificationDetail | null;
  currentNotificationStatus: "idle" | "loading" | "succeeded" | "failed";
  currentNotificationError: string | null;
  adminNotifications: AdminNotificationItem[];
  adminNotificationsStatus: "idle" | "loading" | "succeeded" | "failed";
  adminNotificationsError: string | null;
  currentAdminNotification: AdminNotificationDetail | null;
  currentAdminNotificationStatus: "idle" | "loading" | "succeeded" | "failed";
  currentAdminNotificationError: string | null;
  adminNotificationsMeta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  } | null;
  inventorySummary: InventorySummary | null;
  inventorySummaryStatus: "idle" | "loading" | "succeeded" | "failed";
  inventorySummaryError: string | null;
  inventoryMeta: {
    total: number;
    total_pages: number;
    page: number;
    limit: number;
  } | null;
  inventoryList: InventoryItem[];
  inventoryListStatus: "idle" | "loading" | "succeeded" | "failed";
  inventoryListError: string | null;
  generalSettings: GeneralSettings | null;
  generalSettingsStatus: "idle" | "loading" | "succeeded" | "failed";
  generalSettingsError: string | null;
  dashboardStats: DashboardStats | null;
  dashboardStatsStatus: "idle" | "loading" | "succeeded" | "failed";
  dashboardStatsError: string | null;
  searchResults: SearchResult | null;
  searchResultsStatus: "idle" | "loading" | "succeeded" | "failed";
  searchResultsError: string | null;
  paymentDetails: PaymentDetails | null;
  paymentDetailsStatus: "idle" | "loading" | "succeeded" | "failed";
  paymentDetailsError: string | null;
  orderStatusData: OrderStatusResponse | null;
  orderStatusDataStatus: "idle" | "loading" | "succeeded" | "failed";
  orderStatusDataError: string | null;
  adminOrderNotifications: AdminOrderNotificationItem[];
  adminOrderNotificationsStatus: "idle" | "loading" | "succeeded" | "failed";
  adminOrderNotificationsError: string | null;
  socialLinks: SocialLinks | null;
  socialLinksStatus: "idle" | "loading" | "succeeded" | "failed";
  socialLinksError: string | null;
  adminProfile: AdminProfileResponse | null;
  adminProfileStatus: "idle" | "loading" | "succeeded" | "failed";
  adminProfileError: string | null;
  userPayments: UserPaymentsResponse | null;
  userPaymentsStatus: "idle" | "loading" | "succeeded" | "failed";
  userPaymentsError: string | null;
  cancellationRequests: AdminCancellationRequestsResponse | null;
  cancellationRequestsStatus: "idle" | "loading" | "succeeded" | "failed";
  cancellationRequestsError: string | null;
  cancellationStats: CancellationStatsResponse | null;
  cancellationStatsStatus: "idle" | "loading" | "succeeded" | "failed";
  cancellationStatsError: string | null;
  cancellationStatus: CancellationStatusResponse | null;
  cancellationStatusStatus: "idle" | "loading" | "succeeded" | "failed";
  cancellationStatusError: string | null;
  verifyOrderStatusData: VerifyOrderStatusResponse | null;
  verifyOrderStatusStatus: "idle" | "loading" | "succeeded" | "failed";
  verifyOrderStatusError: string | null;
  completePaymentExpiryStatus: "idle" | "loading" | "succeeded" | "failed";
  completePaymentExpiryError: string | null;
  completePaymentExpiryDetail: string | null;
  uploadEbookStatus: "idle" | "loading" | "succeeded" | "failed";
  uploadEbookError: string | null;
  ebookPurchaseStatus: "idle" | "loading" | "succeeded" | "failed";
  ebookPurchaseError: string | null;
  ebookPurchaseResponse: EbookPurchaseResponse | null;
  createEbookRazorpayOrderStatus: "idle" | "loading" | "succeeded" | "failed";
  createEbookRazorpayOrderError: string | null;
  createEbookRazorpayOrderResponse: CreateEbookRazorpayOrderResponse | null;
  verifyEbookRazorpayPaymentStatus: "idle" | "loading" | "succeeded" | "failed";
  verifyEbookRazorpayPaymentError: string | null;
  verifyEbookRazorpayPaymentResponse: VerifyEbookRazorpayPaymentResponse | null;
  userLibrary: LibraryBook[];
  userLibraryMeta: {
    total?: number;
    total_pages?: number;
    page?: number;
    limit?: number;
  } | null;
  userLibraryStatus: "idle" | "loading" | "succeeded" | "failed";
  userLibraryError: string | null;
  currentEbook: ReadEbookResponse | null;
  currentEbookStatus: "idle" | "loading" | "succeeded" | "failed";
  currentEbookError: string | null;
  guestOrderDetails: GuestOrderDetailsResponse | null;
  guestOrderDetailsStatus: "idle" | "loading" | "succeeded" | "failed";
  guestOrderDetailsError: string | null;
  guestInvoice: GuestInvoiceResponse | null;
  guestInvoiceStatus: "idle" | "loading" | "succeeded" | "failed";
  guestInvoiceError: string | null;
  ebookPurchasesList: EbookPurchaseItem[];
  ebookPurchasesListStatus: "idle" | "loading" | "succeeded" | "failed";
  ebookPurchasesListError: string | null;
  ebookPaymentsList: EbookPaymentItem[];
  ebookPaymentsListStatus: "idle" | "loading" | "succeeded" | "failed";
  ebookPaymentsListError: string | null;
  ebookList: EbookListResponse | null;
  ebookListStatus: "idle" | "loading" | "succeeded" | "failed";
  ebookListError: string | null;
  analyticsOverview: AnalyticsOverviewResponse | null;
  analyticsOverviewStatus: "idle" | "loading" | "succeeded" | "failed";
  analyticsOverviewError: string | null;
  revenueChart: RevenueChartItem[];
  revenueChartStatus: "idle" | "loading" | "succeeded" | "failed";
  revenueChartError: string | null;
  topBooks: TopBookItem[];
  topBooksStatus: "idle" | "loading" | "succeeded" | "failed";
  topBooksError: string | null;
  topCustomers: TopCustomerItem[];
  topCustomersStatus: "idle" | "loading" | "succeeded" | "failed";
  topCustomersError: string | null;
  categorySales: CategorySaleItem[];
  categorySalesStatus: "idle" | "loading" | "succeeded" | "failed";
  categorySalesError: string | null;
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
  addressMeta: null,
  addressStatus: "idle",
  addressError: null,
  wishlist: [],
  wishlistStatus: "idle",
  wishlistError: null,
  wishlistCount: 0,
  orderHistory: null,
  orderHistoryStatus: "idle",
  orderHistoryError: null,
  currentOrder: null,
  currentOrderStatus: "idle",
  currentOrderError: null,
  orderTimeline: null,
  orderTimelineStatus: "idle",
  orderTimelineError: null,
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
  adminOrderInvoice: null,
  adminOrderInvoiceStatus: "idle",
  adminOrderInvoiceError: null,
  notifications: [],
  notificationsStatus: "idle",
  notificationsError: null,
  currentNotification: null,
  currentNotificationStatus: "idle",
  currentNotificationError: null,
  adminNotificationsMeta: null,
  adminNotifications: [],
  adminNotificationsStatus: "idle",
  adminNotificationsError: null,
  currentAdminNotification: null,
  currentAdminNotificationStatus: "idle",
  currentAdminNotificationError: null,
  inventorySummary: null,
  inventorySummaryStatus: "idle",
  inventorySummaryError: null,
  inventoryList: [],
  inventoryMeta: null,
  inventoryListStatus: "idle",
  inventoryListError: null,
  generalSettings: null,
  generalSettingsStatus: "idle",
  generalSettingsError: null,
  dashboardStats: null,
  dashboardStatsStatus: "idle",
  dashboardStatsError: null,
  searchResults: null,
  searchResultsStatus: "idle",
  searchResultsError: null,
  paymentDetails: null,
  paymentDetailsStatus: "idle",
  paymentDetailsError: null,
  orderStatusData: null,
  orderStatusDataStatus: "idle",
  orderStatusDataError: null,
  adminOrderNotifications: [],
  adminOrderNotificationsStatus: "idle",
  adminOrderNotificationsError: null,
  socialLinks: null,
  socialLinksStatus: "idle",
  socialLinksError: null,
  adminProfile: null,
  adminProfileStatus: "idle",
  adminProfileError: null,
  userPayments: null,
  userPaymentsStatus: "idle",
  userPaymentsError: null,
  cancellationRequests: null,
  cancellationRequestsStatus: "idle",
  cancellationRequestsError: null,
  cancellationStats: null,
  cancellationStatsStatus: "idle",
  cancellationStatsError: null,
  cancellationStatus: null,
  cancellationStatusStatus: "idle",
  cancellationStatusError: null,
  verifyOrderStatusData: null,
  verifyOrderStatusStatus: "idle",
  verifyOrderStatusError: null,
  completePaymentExpiryStatus: "idle",
  completePaymentExpiryError: null,
  completePaymentExpiryDetail: null,
  uploadEbookStatus: "idle",
  uploadEbookError: null,
  ebookPurchaseStatus: "idle",
  ebookPurchaseError: null,
  ebookPurchaseResponse: null,
  createEbookRazorpayOrderStatus: "idle",
  createEbookRazorpayOrderError: null,
  createEbookRazorpayOrderResponse: null,
  verifyEbookRazorpayPaymentStatus: "idle",
  verifyEbookRazorpayPaymentError: null,
  verifyEbookRazorpayPaymentResponse: null,
  userLibrary: [],
  userLibraryMeta: null,
  userLibraryStatus: "idle",
  userLibraryError: null,
  currentEbook: null,
  currentEbookStatus: "idle",
  currentEbookError: null,
  guestOrderDetails: null,
  guestOrderDetailsStatus: "idle",
  guestOrderDetailsError: null,
  guestInvoice: null,
  guestInvoiceStatus: "idle",
  guestInvoiceError: null,
  ebookPurchasesList: [],
  ebookPurchasesListStatus: "idle",
  ebookPurchasesListError: null,
  ebookPaymentsList: [],
  ebookPaymentsListStatus: "idle",
  ebookPaymentsListError: null,
  ebookList: null,
  ebookListStatus: "idle",
  ebookListError: null,
  analyticsOverview: null,
  analyticsOverviewStatus: "idle",
  analyticsOverviewError: null,
  revenueChart: [],
  revenueChartStatus: "idle",
  revenueChartError: null,
  topBooks: [],
  topBooksStatus: "idle",
  topBooksError: null,
  topCustomers: [],
  topCustomersStatus: "idle",
  topCustomersError: null,
  categorySales: [],
  categorySalesStatus: "idle",
  categorySalesError: null,
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
// ... (skipping lines to avoid clutter, keeping structure)



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
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to track order");
      }
      return rejectWithValue("Failed to track order");
    }
  }
);

export const getOrderTimelineThunk = createAsyncThunk(
  "checkout/getOrderTimeline",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await getOrderTimelineApi(orderId);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get timeline");
      }
      return rejectWithValue("Failed to get timeline");
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
  async (page: number | undefined, { rejectWithValue }) => {
    try {
      return await getAddressesApi(page);
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
  async (page: number | undefined, { rejectWithValue }) => {
    try {
      return await getOrderHistoryApi(page);
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

export const completePaymentAfterExpiryThunk = createAsyncThunk(
  "checkout/completePaymentAfterExpiry",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const data = await completePaymentAfterExpiryApi(orderId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to complete payment");
      }
      return rejectWithValue("Failed to complete payment");
    }
  }
);

export const uploadEbookThunk = createAsyncThunk(
  "admin/uploadEbook",
  async (
    { bookId, file, ebookPrice }: { bookId: number; file: File; ebookPrice: number },
    { rejectWithValue }
  ) => {
    try {
      const data = await uploadEbookApi(bookId, file, ebookPrice);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to upload ebook");
      }
      return rejectWithValue("Failed to upload ebook");
    }
  }
);

export const purchaseEbookThunk = createAsyncThunk(
  "ebooks/purchase",
  async (bookId: number, { rejectWithValue }) => {
    try {
      const data = await purchaseEbookApi(bookId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to initiate purchase");
      }
      return rejectWithValue("Failed to initiate purchase");
    }
  }
);

export const createEbookRazorpayOrderThunk = createAsyncThunk(
  "auth/createEbookRazorpayOrder",
  async (purchaseId: number, { rejectWithValue }) => {
    try {
      return await createEbookRazorpayOrderApi(purchaseId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to create Razorpay order for ebook"
        );
      }
      return rejectWithValue("Failed to create Razorpay order for ebook");
    }
  }
);

export const verifyEbookRazorpayPaymentThunk = createAsyncThunk(
  "auth/verifyEbookRazorpayPayment",
  async (
    {
      purchaseId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    }: {
      purchaseId: number;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await verifyEbookRazorpayPaymentApi(
        purchaseId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to verify ebook payment"
        );
      }
      return rejectWithValue("Failed to verify ebook payment");
    }
  }
);

export const getUserLibraryThunk = createAsyncThunk(
  "users/getLibrary",
  async (page: number | undefined, { rejectWithValue }) => {
    try {
      const data = await getUserLibraryApi(page);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch library");
      }
      return rejectWithValue("Failed to fetch library");
    }
  }
);

export const readEbookThunk = createAsyncThunk(
  "users/readEbook",
  async (bookId: number, { rejectWithValue }) => {
    try {
      const data = await readEbookApi(bookId);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to read ebook");
      }
      return rejectWithValue("Failed to read ebook");
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

export const getUserPaymentsThunk = createAsyncThunk(
  "auth/getUserPayments",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      return await getUserPaymentsApi(page);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch user payments");
      }
      return rejectWithValue("Failed to fetch user payments");
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

export const getSocialLinksThunk = createAsyncThunk(
  "settings/getSocialLinks",
  async (_, { rejectWithValue }) => {
    try {
      return await getSocialLinksApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch social links");
      }
      return rejectWithValue("Failed to fetch social links");
    }
  }
);

export const updateSocialLinksThunk = createAsyncThunk(
  "settings/updateSocialLinks",
  async (data: SocialLinks, { rejectWithValue }) => {
    try {
      return await updateSocialLinksApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update social links");
      }
      return rejectWithValue("Failed to update social links");
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

export const getAdminOrderInvoiceThunk = createAsyncThunk(
  "admin/getOrderInvoice",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getAdminOrderInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch invoice");
      }
      return rejectWithValue("Failed to fetch invoice");
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "admin/updateOrderStatus",
  async (
    { orderId, newStatus }: { orderId: number; newStatus: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateOrderStatusApi(orderId, newStatus);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update order status");
      }
      return rejectWithValue("Failed to update order status");
    }
  }
);

export const fetchNotificationsThunk = createAsyncThunk(
  "auth/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotificationsApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch notifications");
      }
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);

export const viewNotificationThunk = createAsyncThunk(
  "auth/viewNotification",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      return await viewNotificationApi(notificationId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to view notification");
      }
      return rejectWithValue("Failed to view notification");
    }
  }
);

export const getAdminNotificationsThunk = createAsyncThunk(
  "auth/getAdminNotifications",
  async (
    params: { triggerSource?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const { triggerSource, page, limit } = params;
      return await getAdminNotificationsApi(triggerSource, page, limit);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch admin notifications");
      }
      return rejectWithValue("Failed to fetch admin notifications");
    }
  }
);

export const resendNotificationThunk = createAsyncThunk(
  "auth/resendNotification",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      return await resendNotificationApi(notificationId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to resend notification");
      }
      return rejectWithValue("Failed to resend notification");
    }
  }
);

export const viewAdminNotificationThunk = createAsyncThunk(
  "auth/viewAdminNotification",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      return await viewAdminNotificationApi(notificationId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to view admin notification");
      }
      return rejectWithValue("Failed to view admin notification");
    }
  }
);

// checkWishlistStatusThunk is typically used in components locally,
// but can be added here if needed for global state tracking.
// For now, we focus on the list management.


export const getInventorySummaryThunk = createAsyncThunk(
  "admin/getInventorySummary",
  async (_, { rejectWithValue }) => {
    try {
      return await getInventorySummaryApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch inventory summary"
        );
      }
      return rejectWithValue("Failed to fetch inventory summary");
    }
  }
);

export const getInventoryListThunk = createAsyncThunk(
  "admin/getInventoryList",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      return await getInventoryListApi(page, limit);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch inventory list"
        );
      }
      return rejectWithValue("Failed to fetch inventory list");
    }
  }
);

export const updateBookStockThunk = createAsyncThunk(
  "admin/updateBookStock",
  async (
    { bookId, stock }: { bookId: number; stock: number },
    { rejectWithValue }
  ) => {
    try {
      return await updateBookStockApi(bookId, stock);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update stock");
      }
      return rejectWithValue("Failed to update stock");
    }
  }
);

export const getGeneralSettingsThunk = createAsyncThunk(
  "admin/getGeneralSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await getGeneralSettingsApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch settings");
      }
      return rejectWithValue("Failed to fetch settings");
    }
  }
);

export const updateGeneralSettingsThunk = createAsyncThunk(
  "admin/updateGeneralSettings",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await updateGeneralSettingsApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update settings");
      }
      return rejectWithValue("Failed to update settings");
    }
  }
);

export const getDashboardStatsThunk = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getDashboardStatsApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch dashboard stats"
        );
      }
      return rejectWithValue("Failed to fetch dashboard stats");
    }
  }
);

export const adminSearchThunk = createAsyncThunk(
  "admin/search",
  async (query: string, { rejectWithValue }) => {
    try {
      return await adminSearchApi(query);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to search");
      }
      return rejectWithValue("Failed to search");
    }
  }
);

export const createOfflineOrderThunk = createAsyncThunk(
  "admin/createOfflineOrder",
  async (data: OfflineOrderRequest, { rejectWithValue }) => {
    try {
      return await createOfflineOrderApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to create offline order");
      }
      return rejectWithValue("Failed to create offline order");
    }
  }
);

export const createOfflinePaymentThunk = createAsyncThunk(
  "admin/createOfflinePayment",
  async (data: OfflinePaymentRequest, { rejectWithValue }) => {
    try {
      return await createOfflinePaymentApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to record offline payment");
      }
      return rejectWithValue("Failed to record offline payment");
    }
  }
);

export const getPaymentDetailsThunk = createAsyncThunk(
  "checkout/getPaymentDetails",
  async (paymentId: number, { rejectWithValue }) => {
    try {
      return await getPaymentDetailsApi(paymentId);
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

export const addOrderTrackingThunk = createAsyncThunk(
  "admin/addOrderTracking",
  async (
    {
      orderId,
      trackingId,
      trackingUrl,
    }: { orderId: number; trackingId: string; trackingUrl: string },
    { rejectWithValue }
  ) => {
    try {
      return await addOrderTrackingApi(orderId, trackingId, trackingUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to add tracking");
      }
      return rejectWithValue("Failed to add tracking");
    }
  }
);

export const getOrderStatusThunk = createAsyncThunk(
  "admin/getOrderStatus",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getOrderStatusApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch order status");
      }
      return rejectWithValue("Failed to fetch order status");
    }
  }
);

export const getAdminOrderNotificationsThunk = createAsyncThunk(
  "admin/getOrderNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminOrderNotificationsApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch order notifications"
        );
      }
      return rejectWithValue("Failed to fetch order notifications");
    }
  }
);

  export const getAdminProfileThunk = createAsyncThunk(
  "admin/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminProfileApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch admin profile");
      }
      return rejectWithValue("Failed to fetch admin profile");
    }
  }
);

export const updateAdminProfileThunk = createAsyncThunk(
  "admin/updateProfile",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await updateAdminProfileApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update admin profile");
      }
      return rejectWithValue("Failed to update admin profile");
    }
  }
);

export const changeAdminPasswordThunk = createAsyncThunk(
  "admin/changePassword",
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      return await changeAdminPasswordApi(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to change password");
      }
      return rejectWithValue("Failed to change password");
    }
  }
);


export const requestCancellationThunk = createAsyncThunk(
  "auth/requestCancellation",
  async (
    { orderId, data }: { orderId: number; data: CancellationRequestPayload },
    { rejectWithValue }
  ) => {
    try {
      return await requestCancellationApi(orderId, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to request cancellation");
      }
      return rejectWithValue("Failed to request cancellation");
    }
  }
);

export const getCancellationStatusThunk = createAsyncThunk(
  "auth/getCancellationStatus",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await getCancellationStatusApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get cancellation status");
      }
      return rejectWithValue("Failed to get cancellation status");
    }
  }
);

export const getAdminCancellationRequestsThunk = createAsyncThunk(
  "admin/getCancellationRequests",
  async (params: AdminCancellationRequestsParams, { rejectWithValue }) => {
    try {
      return await getAdminCancellationRequestsApi(params);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get cancellation requests");
      }
      return rejectWithValue("Failed to get cancellation requests");
    }
  }
);

export const approveCancellationThunk = createAsyncThunk(
  "admin/approveCancellation",
  async (requestId: number, { rejectWithValue }) => {
    try {
      return await approveCancellationApi(requestId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to approve cancellation");
      }
      return rejectWithValue("Failed to approve cancellation");
    }
  }
);

export const processRefundThunk = createAsyncThunk(
  "admin/processRefund",
  async (
    { requestId, data }: { requestId: number; data: ProcessRefundPayload },
    { rejectWithValue }
  ) => {
    try {
      return await processRefundApi(requestId, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to process refund");
      }
      return rejectWithValue("Failed to process refund");
    }
  }
);

export const rejectCancellationThunk = createAsyncThunk(
  "admin/rejectCancellation",
  async (
    { requestId, data }: { requestId: number; data: RejectCancellationPayload },
    { rejectWithValue }
  ) => {
    try {
      return await rejectCancellationApi(requestId, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to reject cancellation");
      }
      return rejectWithValue("Failed to reject cancellation");
    }
  }
);

export const getCancellationStatsThunk = createAsyncThunk(
  "admin/getCancellationStats",
  async (_, { rejectWithValue }) => {
    try {
      return await getCancellationStatsApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to get cancellation stats");
      }
      return rejectWithValue("Failed to get cancellation stats");
    }
  }
);

export const verifyOrderStatusThunk = createAsyncThunk(
  "auth/verifyOrderStatus",
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await verifyOrderStatusApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to verify order status");
      }
      return rejectWithValue("Failed to verify order status");
    }
  }
);


export const createRazorpayOrderThunk = createAsyncThunk(
  "checkout/createRazorpayOrder",
  async (addressId: number, { rejectWithValue }) => {
    try {
      return await createRazorpayOrderApi(addressId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to create Razorpay order");
      }
      return rejectWithValue("Failed to create Razorpay order");
    }
  }
);

export const verifyRazorpayPaymentThunk = createAsyncThunk(
  "checkout/verifyRazorpayPayment",
  async (
    {
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    }: {
      orderId: number;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await verifyRazorpayPaymentApi(
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to verify Razorpay payment"
        );
      }
      return rejectWithValue("Failed to verify Razorpay payment");
    }
  }
);

export const createGuestRazorpayOrderThunk = createAsyncThunk(
  "checkout/createGuestRazorpayOrder",
  async (
    { guest, items, address, order_id }: { guest: { name: string; email: string; phone: string }; items: any[]; address: any; order_id?: number | null },
    { rejectWithValue }
  ) => {
    try {
      return await createGuestRazorpayOrderApi(guest, items, address, order_id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to create Guest Razorpay order"
        );
      }
      return rejectWithValue("Failed to create Guest Razorpay order");
    }
  }
);

export const getGuestOrderDetailsThunk = createAsyncThunk(
  "checkout/getGuestOrderDetails",
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      return await getGuestOrderDetailsApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get guest order details"
        );
      }
      return rejectWithValue("Failed to get guest order details");
    }
  }
);

export const verifyGuestRazorpayPaymentThunk = createAsyncThunk(
  "checkout/verifyGuestRazorpayPayment",
  async (
    {
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    }: {
      orderId: number;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await verifyGuestRazorpayPaymentApi(
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to verify Guest Razorpay payment"
        );
      }
      return rejectWithValue("Failed to verify Guest Razorpay payment");
    }
  }
);

export const viewGuestOrderInvoiceThunk = createAsyncThunk(
  "checkout/viewGuestOrderInvoice",
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      return await viewGuestOrderInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to view guest order invoice"
        );
      }
      return rejectWithValue("Failed to view guest order invoice");
    }
  }
);

export const downloadGuestInvoiceThunk = createAsyncThunk(
  "checkout/downloadGuestInvoice",
  async (orderId: string | number, { rejectWithValue }) => {
    try {
      return await downloadGuestInvoiceApi(orderId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to download guest invoice"
        );
      }
      return rejectWithValue("Failed to download guest invoice");
    }
  }
);



export const getEbookPurchasesListThunk = createAsyncThunk(
  "admin/getEbookPurchasesList",
  async (_, { rejectWithValue }) => {
    try {
      return await getEbookPurchasesListApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get ebook purchases list"
        );
      }
      return rejectWithValue("Failed to get ebook purchases list");
    }
  }
);

export const getEbookPaymentsListThunk = createAsyncThunk(
  "admin/getEbookPaymentsList",
  async (_, { rejectWithValue }) => {
    try {
      return await getEbookPaymentsListApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get ebook payments list"
        );
      }
      return rejectWithValue("Failed to get ebook payments list");
    }
  }
);

export const updateEbookPriceThunk = createAsyncThunk(
  "admin/updateEbookPrice",
  async (
    { bookId, price }: { bookId: number; price: number },
    { rejectWithValue }
  ) => {
    try {
      return await updateEbookPriceApi(bookId, price);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to update ebook price"
        );
      }
      return rejectWithValue("Failed to update ebook price");
    }
  }
);

export const toggleEbookStatusThunk = createAsyncThunk(
  "admin/toggleEbookStatus",
  async (
    { bookId, enabled }: { bookId: number; enabled: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await toggleEbookStatusApi(bookId, enabled);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to toggle ebook status"
        );
      }
      return rejectWithValue("Failed to toggle ebook status");
    }
  }
);

export const getEbookListThunk = createAsyncThunk(
  "admin/getEbookList",
  async (_, { rejectWithValue }) => {
    try {
      return await getEbookListApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to get ebook list"
        );
      }
      return rejectWithValue("Failed to get ebook list");
    }
  }
);



export const getAnalyticsOverviewThunk = createAsyncThunk(
  "admin/getAnalyticsOverview",
  async (_, { rejectWithValue }) => {
    try {
      return await getAnalyticsOverviewApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch analytics overview"
        );
      }
      return rejectWithValue("Failed to fetch analytics overview");
    }
  }
);

export const getRevenueChartThunk = createAsyncThunk(
  "admin/getRevenueChart",
  async (_, { rejectWithValue }) => {
    try {
      return await getRevenueChartApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch revenue chart");
      }
      return rejectWithValue("Failed to fetch revenue chart");
    }
  }
);

export const getTopBooksThunk = createAsyncThunk(
  "admin/getTopBooks",
  async (_, { rejectWithValue }) => {
    try {
      return await getTopBooksApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch top books");
      }
      return rejectWithValue("Failed to fetch top books");
    }
  }
);

export const getTopCustomersThunk = createAsyncThunk(
  "admin/getTopCustomers",
  async (_, { rejectWithValue }) => {
    try {
      return await getTopCustomersApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch top customers");
      }
      return rejectWithValue("Failed to fetch top customers");
    }
  }
);

export const getCategorySalesThunk = createAsyncThunk(
  "admin/getCategorySales",
  async (_, { rejectWithValue }) => {
    try {
      return await getCategorySalesApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch category sales");
      }
      return rejectWithValue("Failed to fetch category sales");
    }
  }
);

export const exportAnalyticsReportThunk = createAsyncThunk(
  "admin/exportAnalyticsReport",
  async (_, { rejectWithValue }) => {
    try {
      return await exportAnalyticsReportApi();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to export report");
      }
      return rejectWithValue("Failed to export report");
    }
  }
);

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
    clearProfile(state) {
      state.userProfile = null;
      state.status = "idle";
      clearTokensAndProfile();
    },
    resetConfirmOrderData(state) {
      state.confirmOrderData = null;
      state.confirmOrderStatus = "idle";
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
        const payload = action.payload as any;
        
        if (payload && Array.isArray(payload.results)) {
          state.addresses = payload.results;
          state.addressMeta = {
              total: payload.total_items,
              total_pages: payload.total_pages,
              page: payload.current_page,
              limit: payload.limit
          };
        } else if (Array.isArray(payload)) {
             // Fallback for unpaginated array response
            state.addresses = payload;
            state.addressMeta = null;
        } else {
             state.addresses = [];
             state.addressMeta = null;
        }
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
      .addCase(addToWishlistThunk.fulfilled, (state) => {
        state.wishlistCount += 1;
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
      })
      // Admin Order Invoice
      .addCase(getAdminOrderInvoiceThunk.pending, (state) => {
        state.adminOrderInvoiceStatus = "loading";
        state.adminOrderInvoice = null;
      })
      .addCase(getAdminOrderInvoiceThunk.fulfilled, (state, action) => {
        state.adminOrderInvoiceStatus = "succeeded";
        state.adminOrderInvoice = action.payload;
      })
      .addCase(getAdminOrderInvoiceThunk.rejected, (state, action) => {
        state.adminOrderInvoiceStatus = "failed";
        state.adminOrderInvoiceError = action.payload as string;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        if (state.adminOrders) {
          const index = state.adminOrders.results.findIndex(
            (o) => o.order_id === action.payload.order_id
          );
          if (index !== -1) {
            state.adminOrders.results[index].status = action.payload.new_status;
          }
        }
        if (
          state.adminOrderDetail &&
          state.adminOrderDetail.order_id === action.payload.order_id
        ) {
          state.adminOrderDetail.status = action.payload.new_status;
        }
      })
      // Notifications
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.notificationsStatus = "loading";
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.notificationsStatus = "succeeded";
        const payload = action.payload as any;
        if (Array.isArray(payload)) {
          state.notifications = payload;
        } else if (payload && Array.isArray(payload.results)) {
          state.notifications = payload.results; // Common pagination pattern
        } else if (payload && Array.isArray(payload.items)) {
          state.notifications = payload.items;
        } else if (payload && Array.isArray(payload.notifications)) {
          state.notifications = payload.notifications;
        } else {
          state.notifications = [];
          console.warn("fetchNotificationsThunk: payload is not an array", payload);
        }
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.notificationsStatus = "failed";
        state.notificationsError = action.payload as string;
      })
      .addCase(viewNotificationThunk.pending, (state) => {
        state.currentNotificationStatus = "loading";
      })
      .addCase(viewNotificationThunk.fulfilled, (state, action) => {
        state.currentNotificationStatus = "succeeded";
        state.currentNotification = action.payload;
      })
      .addCase(viewNotificationThunk.rejected, (state, action) => {
        state.currentNotificationStatus = "failed";
        state.currentNotificationError = action.payload as string;
      })
      // Admin Notifications
      .addCase(getAdminNotificationsThunk.pending, (state) => {
        state.adminNotificationsStatus = "loading";
      })
      .addCase(getAdminNotificationsThunk.fulfilled, (state, action) => {
        state.adminNotificationsStatus = "succeeded";
        state.adminNotifications = action.payload.results;
        state.adminNotificationsMeta = {
            total_items: action.payload.total_items,
            total_pages: action.payload.total_pages,
            current_page: action.payload.current_page,
            limit: action.payload.limit
        };
      })
      .addCase(getAdminNotificationsThunk.rejected, (state, action) => {
        state.adminNotificationsStatus = "failed";
        state.adminNotificationsError = action.payload as string;
      })
      .addCase(viewAdminNotificationThunk.pending, (state) => {
        state.currentAdminNotificationStatus = "loading";
      })
      .addCase(viewAdminNotificationThunk.fulfilled, (state, action) => {
        state.currentAdminNotificationStatus = "succeeded";
        state.currentAdminNotification = action.payload;
      })
      .addCase(viewAdminNotificationThunk.rejected, (state, action) => {
        state.currentAdminNotificationStatus = "failed";
        state.currentAdminNotificationError = action.payload as string;
      })
      // Inventory
      .addCase(getInventorySummaryThunk.pending, (state) => {
        state.inventorySummaryStatus = "loading";
      })
      .addCase(getInventorySummaryThunk.fulfilled, (state, action) => {
        state.inventorySummaryStatus = "succeeded";
        state.inventorySummary = action.payload;
      })
      .addCase(getInventorySummaryThunk.rejected, (state, action) => {
        state.inventorySummaryStatus = "failed";
        state.inventorySummaryError = action.payload as string;
      })
      .addCase(getInventoryListThunk.pending, (state) => {
        state.inventoryListStatus = "loading";
      })
      .addCase(getInventoryListThunk.fulfilled, (state, action) => {
        state.inventoryListStatus = "succeeded";
        if (action.payload && (Array.isArray(action.payload.data) || Array.isArray(action.payload.results))) {
            state.inventoryList = action.payload.data || action.payload.results || [];
            state.inventoryMeta = {
              total: action.payload.total,
              total_pages: action.payload.total_pages,
              page: action.payload.page,
              limit: action.payload.limit
            };
        } else {
            console.warn("getInventoryListThunk: payload data/results is not an array", action.payload);
            state.inventoryList = [];
            state.inventoryMeta = null;
        }
      })
      .addCase(getInventoryListThunk.rejected, (state, action) => {
        state.inventoryListStatus = "failed";
        state.inventoryListError = action.payload as string;
      })
      .addCase(updateBookStockThunk.fulfilled, (state, action) => {
        if (state.inventoryList) {
          const index = state.inventoryList.findIndex(
            (b) => b.id === action.payload.book.id
          );
          if (index !== -1) {
            state.inventoryList[index] = {
              ...state.inventoryList[index],
              stock: action.payload.book.current_stock,
              status: action.payload.book.status,
            };
          }
        }
      });

    // Timeline
    builder
      .addCase(getOrderTimelineThunk.pending, (state) => {
        state.orderTimelineStatus = "loading";
        state.orderTimelineError = null;
        state.orderTimeline = null;
      })
      .addCase(getOrderTimelineThunk.fulfilled, (state, action) => {
        state.orderTimelineStatus = "succeeded";
        state.orderTimeline = action.payload;
      })
      .addCase(getOrderTimelineThunk.rejected, (state, action) => {
        state.orderTimelineStatus = "failed";
        state.orderTimelineError = action.payload as string;
      });

    // Admin Settings
    builder
      .addCase(getGeneralSettingsThunk.pending, (state) => {
        state.generalSettingsStatus = "loading";
      })
      .addCase(getGeneralSettingsThunk.fulfilled, (state, action) => {
        state.generalSettingsStatus = "succeeded";
        state.generalSettings = action.payload;
      })
      .addCase(getGeneralSettingsThunk.rejected, (state, action) => {
        state.generalSettingsStatus = "failed";
        state.generalSettingsError = action.payload as string;
      })
      .addCase(updateGeneralSettingsThunk.fulfilled, (state, action) => {
        state.generalSettings = action.payload.data;
      })

      // Dashboard
      .addCase(getDashboardStatsThunk.pending, (state) => {
        state.dashboardStatsStatus = "loading";
      })
      .addCase(getDashboardStatsThunk.fulfilled, (state, action) => {
        state.dashboardStatsStatus = "succeeded";
        state.dashboardStats = action.payload;
      })
      .addCase(getDashboardStatsThunk.rejected, (state, action) => {
        state.dashboardStatsStatus = "failed";
        state.dashboardStatsError = action.payload as string;
      })

      // Search
      .addCase(adminSearchThunk.pending, (state) => {
        state.searchResultsStatus = "loading";
      })
      .addCase(adminSearchThunk.fulfilled, (state, action) => {
        state.searchResultsStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(adminSearchThunk.rejected, (state, action) => {
        state.searchResultsStatus = "failed";
        state.searchResultsError = action.payload as string;
      })

      // Payment Details
      .addCase(getPaymentDetailsThunk.pending, (state) => {
        state.paymentDetailsStatus = "loading";
      })
      .addCase(getPaymentDetailsThunk.fulfilled, (state, action) => {
        state.paymentDetailsStatus = "succeeded";
        state.paymentDetails = action.payload;
      })
      .addCase(getPaymentDetailsThunk.rejected, (state, action) => {
        state.paymentDetailsStatus = "failed";
        state.paymentDetailsError = action.payload as string;
      })

      // Order Status
      .addCase(getOrderStatusThunk.pending, (state) => {
        state.orderStatusDataStatus = "loading";
      })
      .addCase(getOrderStatusThunk.fulfilled, (state, action) => {
        state.orderStatusDataStatus = "succeeded";
        state.orderStatusData = action.payload;
      })
      .addCase(getOrderStatusThunk.rejected, (state, action) => {
        state.orderStatusDataStatus = "failed";
        state.orderStatusDataError = action.payload as string;
      })

      // Admin Order Notifications
      .addCase(getAdminOrderNotificationsThunk.pending, (state) => {
        state.adminOrderNotificationsStatus = "loading";
      })
      .addCase(getAdminOrderNotificationsThunk.fulfilled, (state, action) => {
        state.adminOrderNotificationsStatus = "succeeded";
        state.adminOrderNotifications = action.payload;
      })
      .addCase(getAdminOrderNotificationsThunk.rejected, (state, action) => {
        state.adminOrderNotificationsStatus = "failed";
        state.adminOrderNotificationsError = action.payload as string;
      })

      // Social Links
      .addCase(getSocialLinksThunk.pending, (state) => {
        state.socialLinksStatus = "loading";
      })
      .addCase(getSocialLinksThunk.fulfilled, (state, action) => {
        state.socialLinksStatus = "succeeded";
        state.socialLinks = action.payload;
      })
      .addCase(getSocialLinksThunk.rejected, (state, action) => {
        state.socialLinksStatus = "failed";
        state.socialLinksError = action.payload as string;
      })
      .addCase(updateSocialLinksThunk.fulfilled, (state, action) => {
        state.socialLinks = action.payload;
      })
      // Admin Profile
      .addCase(getAdminProfileThunk.pending, (state) => {
        state.adminProfileStatus = "loading";
      })
      .addCase(getAdminProfileThunk.fulfilled, (state, action) => {
        state.adminProfileStatus = "succeeded";
        state.adminProfile = action.payload;
      })
      .addCase(getAdminProfileThunk.rejected, (state, action) => {
        state.adminProfileStatus = "failed";
        state.adminProfileError = action.payload as string;
      })
      .addCase(updateAdminProfileThunk.fulfilled, (state, action) => {
        state.adminProfile = action.payload.admin;
      })
      // User Payments
      .addCase(getUserPaymentsThunk.pending, (state) => {
        state.userPaymentsStatus = "loading";
        state.userPaymentsError = null;
      })
      .addCase(getUserPaymentsThunk.fulfilled, (state, action) => {
        state.userPaymentsStatus = "succeeded";
        state.userPayments = action.payload;
      })
      .addCase(getUserPaymentsThunk.rejected, (state, action) => {
         state.userPaymentsStatus = "failed";
         state.userPaymentsError = action.payload as string;
      })

      // Cancellations & Refunds
      .addCase(requestCancellationThunk.fulfilled, () => {
         // handled in component
      })
      .addCase(getCancellationStatusThunk.pending, (state) => {
        state.cancellationStatusStatus = "loading";
        state.cancellationStatusError = null;
        state.cancellationStatus = null;
      })
      .addCase(getCancellationStatusThunk.fulfilled, (state, action) => {
        state.cancellationStatusStatus = "succeeded";
        state.cancellationStatus = action.payload;
      })
      .addCase(getCancellationStatusThunk.rejected, (state, action) => {
        state.cancellationStatusStatus = "failed";
        state.cancellationStatusError = action.payload as string;
        state.cancellationStatus = null;
      })
      // Guest Order Details
      .addCase(getGuestOrderDetailsThunk.pending, (state) => {
        state.guestOrderDetailsStatus = "loading";
        state.guestOrderDetailsError = null;
      })
      .addCase(getGuestOrderDetailsThunk.fulfilled, (state, action) => {
        state.guestOrderDetailsStatus = "succeeded";
        state.guestOrderDetails = action.payload;
        state.guestOrderDetailsError = null;
      })
      .addCase(getGuestOrderDetailsThunk.rejected, (state, action) => {
        state.guestOrderDetailsStatus = "failed";
        state.guestOrderDetailsError = action.payload as string;
      })
      .addCase(getAdminCancellationRequestsThunk.pending, (state) => {
        state.cancellationRequestsStatus = "loading";
        state.cancellationRequestsError = null;
      })
      .addCase(getAdminCancellationRequestsThunk.fulfilled, (state, action) => {
        state.cancellationRequestsStatus = "succeeded";
        state.cancellationRequests = action.payload;
      })
      .addCase(getAdminCancellationRequestsThunk.rejected, (state, action) => {
        state.cancellationRequestsStatus = "failed";
        state.cancellationRequestsError = action.payload as string;
      })
      .addCase(getCancellationStatsThunk.pending, (state) => {
        state.cancellationStatsStatus = "loading";
        state.cancellationStatsError = null;
      })
      .addCase(getCancellationStatsThunk.fulfilled, (state, action) => {
        state.cancellationStatsStatus = "succeeded";
        state.cancellationStats = action.payload;
      })
      .addCase(getCancellationStatsThunk.rejected, (state, action) => {
        state.cancellationStatsStatus = "failed";
        state.cancellationStatsError = action.payload as string;
      })
      .addCase(verifyOrderStatusThunk.pending, (state) => {
         state.verifyOrderStatusStatus = "loading";
         state.verifyOrderStatusError = null;
      })
      .addCase(verifyOrderStatusThunk.fulfilled, (state, action) => {
         state.verifyOrderStatusStatus = "succeeded";
         state.verifyOrderStatusData = action.payload;
      })
      .addCase(verifyOrderStatusThunk.rejected, (state, action) => {
         state.verifyOrderStatusStatus = "failed";
         state.verifyOrderStatusError = action.payload as string;
      })
      
      // E-book & Payment Expiry
      .addCase(completePaymentAfterExpiryThunk.pending, (state) => {
        state.completePaymentExpiryStatus = "loading";
        state.completePaymentExpiryError = null;
        state.completePaymentExpiryDetail = null;
      })
      .addCase(completePaymentAfterExpiryThunk.fulfilled, (state, action) => {
        state.completePaymentExpiryStatus = "succeeded";
        state.completePaymentExpiryDetail = action.payload.detail || null;
      })
      .addCase(completePaymentAfterExpiryThunk.rejected, (state, action) => {
        state.completePaymentExpiryStatus = "failed";
        state.completePaymentExpiryError = action.payload as string;
      })
      .addCase(uploadEbookThunk.pending, (state) => {
        state.uploadEbookStatus = "loading";
        state.uploadEbookError = null;
      })
      .addCase(uploadEbookThunk.fulfilled, (state) => {
        state.uploadEbookStatus = "succeeded";
      })
      .addCase(uploadEbookThunk.rejected, (state, action) => {
        state.uploadEbookStatus = "failed";
        state.uploadEbookError = action.payload as string;
      })
      .addCase(purchaseEbookThunk.pending, (state) => {
        state.ebookPurchaseStatus = "loading";
        state.ebookPurchaseError = null;
        state.ebookPurchaseResponse = null;
      })
      .addCase(purchaseEbookThunk.fulfilled, (state, action) => {
        state.ebookPurchaseStatus = "succeeded";
        state.ebookPurchaseResponse = action.payload;
      })
      .addCase(purchaseEbookThunk.rejected, (state, action) => {
        state.ebookPurchaseStatus = "failed";
        state.ebookPurchaseError = action.payload as string;
      })
      .addCase(createEbookRazorpayOrderThunk.pending, (state) => {
        state.createEbookRazorpayOrderStatus = "loading";
        state.createEbookRazorpayOrderError = null;
        state.createEbookRazorpayOrderResponse = null;
      })
      .addCase(createEbookRazorpayOrderThunk.fulfilled, (state, action) => {
        state.createEbookRazorpayOrderStatus = "succeeded";
        state.createEbookRazorpayOrderResponse = action.payload;
      })
      .addCase(createEbookRazorpayOrderThunk.rejected, (state, action) => {
        state.createEbookRazorpayOrderStatus = "failed";
        state.createEbookRazorpayOrderError = action.payload as string;
      })
      .addCase(verifyEbookRazorpayPaymentThunk.pending, (state) => {
        state.verifyEbookRazorpayPaymentStatus = "loading";
        state.verifyEbookRazorpayPaymentError = null;
        state.verifyEbookRazorpayPaymentResponse = null;
      })
      .addCase(verifyEbookRazorpayPaymentThunk.fulfilled, (state, action) => {
        state.verifyEbookRazorpayPaymentStatus = "succeeded";
        state.verifyEbookRazorpayPaymentResponse = action.payload;
        // Optionally update other states like userLibrary or purchase status if needed
      })
      .addCase(verifyEbookRazorpayPaymentThunk.rejected, (state, action) => {
        state.verifyEbookRazorpayPaymentStatus = "failed";
        state.verifyEbookRazorpayPaymentError = action.payload as string;
      })
      .addCase(getUserLibraryThunk.pending, (state) => {
        state.userLibraryStatus = "loading";
        state.userLibraryError = null;
      })
      .addCase(getUserLibraryThunk.fulfilled, (state, action) => {
        state.userLibraryStatus = "succeeded";
        const payload = action.payload as any;
        if (Array.isArray(payload)) {
          state.userLibrary = payload;
          state.userLibraryMeta = null;
        } else if (payload && Array.isArray(payload.results)) {
          state.userLibrary = payload.results;
          state.userLibraryMeta = {
              total: payload.total_items || payload.total,
              total_pages: payload.total_pages,
              page: payload.current_page || payload.page,
              limit: payload.limit
          };
        } else if (payload && Array.isArray(payload.data)) {
          state.userLibrary = payload.data;
          state.userLibraryMeta = {
              total: payload.total,
              total_pages: payload.total_pages,
              page: payload.page,
              limit: payload.limit
          };
        } else {
          state.userLibrary = [];
          state.userLibraryMeta = null;
          console.warn("getUserLibraryThunk: payload is not an array", payload);
        }
      })
      .addCase(getUserLibraryThunk.rejected, (state, action) => {
        state.userLibraryStatus = "failed";
        state.userLibraryError = action.payload as string;
      })
      .addCase(readEbookThunk.pending, (state) => {
        state.currentEbookStatus = "loading";
        state.currentEbookError = null;
        state.currentEbook = null;
      })
      .addCase(readEbookThunk.fulfilled, (state, action) => {
        state.currentEbookStatus = "succeeded";
        state.currentEbook = action.payload;
      })
      .addCase(readEbookThunk.rejected, (state, action) => {
        state.currentEbookStatus = "failed";
        state.currentEbookError = action.payload as string;
      })
      // Guest Invoice
      .addCase(viewGuestOrderInvoiceThunk.pending, (state) => {
        state.guestInvoiceStatus = "loading";
        state.guestInvoiceError = null;
        state.guestInvoice = null;
      })
      .addCase(viewGuestOrderInvoiceThunk.fulfilled, (state, action) => {
        state.guestInvoiceStatus = "succeeded";
        state.guestInvoice = action.payload;
      })
      .addCase(viewGuestOrderInvoiceThunk.rejected, (state, action) => {
        state.guestInvoiceStatus = "failed";
        state.guestInvoiceError = action.payload as string;
      })
      // Ebook Management
      .addCase(getEbookPurchasesListThunk.pending, (state) => {
        state.ebookPurchasesListStatus = "loading";
        state.ebookPurchasesListError = null;
      })
      .addCase(getEbookPurchasesListThunk.fulfilled, (state, action) => {
        state.ebookPurchasesListStatus = "succeeded";
        state.ebookPurchasesList = action.payload;
      })
      .addCase(getEbookPurchasesListThunk.rejected, (state, action) => {
        state.ebookPurchasesListStatus = "failed";
        state.ebookPurchasesListError = action.payload as string;
      })
      .addCase(getEbookPaymentsListThunk.pending, (state) => {
        state.ebookPaymentsListStatus = "loading";
        state.ebookPaymentsListError = null;
      })
      .addCase(getEbookPaymentsListThunk.fulfilled, (state, action) => {
        state.ebookPaymentsListStatus = "succeeded";
        state.ebookPaymentsList = action.payload;
      })
      .addCase(getEbookPaymentsListThunk.rejected, (state, action) => {
        state.ebookPaymentsListStatus = "failed";
        state.ebookPaymentsListError = action.payload as string;
      })
      .addCase(updateEbookPriceThunk.fulfilled, () => {
         // Optionally update the list if we have one locally, or just trigger re-fetch in component
      })
      .addCase(toggleEbookStatusThunk.fulfilled, () => {
         // Optionally update the list if we have one locally
      })
      .addCase(getEbookListThunk.pending, (state) => {
        state.ebookListStatus = "loading";
        state.ebookListError = null;
      })
      .addCase(getEbookListThunk.fulfilled, (state, action) => {
        state.ebookListStatus = "succeeded";
        state.ebookList = action.payload;
      })
      .addCase(getEbookListThunk.rejected, (state, action) => {
        state.ebookListStatus = "failed";
        state.ebookListError = action.payload as string;
      })
      
      // Analytics Thunks
      .addCase(getAnalyticsOverviewThunk.pending, (state) => {
        state.analyticsOverviewStatus = "loading";
        state.analyticsOverviewError = null;
      })
      .addCase(getAnalyticsOverviewThunk.fulfilled, (state, action) => {
        state.analyticsOverviewStatus = "succeeded";
        state.analyticsOverview = action.payload;
      })
      .addCase(getAnalyticsOverviewThunk.rejected, (state, action) => {
        state.analyticsOverviewStatus = "failed";
        state.analyticsOverviewError = action.payload as string;
      })

      .addCase(getRevenueChartThunk.pending, (state) => {
        state.revenueChartStatus = "loading";
        state.revenueChartError = null;
      })
      .addCase(getRevenueChartThunk.fulfilled, (state, action) => {
        state.revenueChartStatus = "succeeded";
        state.revenueChart = action.payload;
      })
      .addCase(getRevenueChartThunk.rejected, (state, action) => {
        state.revenueChartStatus = "failed";
        state.revenueChartError = action.payload as string;
      })

      .addCase(getTopBooksThunk.pending, (state) => {
        state.topBooksStatus = "loading";
        state.topBooksError = null;
      })
      .addCase(getTopBooksThunk.fulfilled, (state, action) => {
        state.topBooksStatus = "succeeded";
        state.topBooks = action.payload;
      })
      .addCase(getTopBooksThunk.rejected, (state, action) => {
        state.topBooksStatus = "failed";
        state.topBooksError = action.payload as string;
      })

      .addCase(getTopCustomersThunk.pending, (state) => {
        state.topCustomersStatus = "loading";
        state.topCustomersError = null;
      })
      .addCase(getTopCustomersThunk.fulfilled, (state, action) => {
        state.topCustomersStatus = "succeeded";
        state.topCustomers = action.payload;
      })
      .addCase(getTopCustomersThunk.rejected, (state, action) => {
        state.topCustomersStatus = "failed";
        state.topCustomersError = action.payload as string;
      })

      .addCase(getCategorySalesThunk.pending, (state) => {
        state.categorySalesStatus = "loading";
        state.categorySalesError = null;
      })
      .addCase(getCategorySalesThunk.fulfilled, (state, action) => {
        state.categorySalesStatus = "succeeded";
        state.categorySales = action.payload;
      })
      .addCase(getCategorySalesThunk.rejected, (state, action) => {
        state.categorySalesStatus = "failed";
        state.categorySalesError = action.payload as string;
      })
      .addMatcher(
        (action): action is { type: string; payload?: any; error?: any } =>
          action.type.endsWith("/rejected"),
        (state, action) => {
          // Check if payload is "Unauthorized" string OR if it's an Error object with that message
          const payload = action.payload;
          const isUnauthorized =
            payload === "Unauthorized" ||
            (payload &&
              typeof payload === "object" &&
              (payload as any).message === "Unauthorized") ||
            (action.error && action.error.message === "Unauthorized");

          if (isUnauthorized) {
            clearTokensAndProfile();
            state.accessToken = null;
            state.refreshToken = null;
            state.userProfile = null;
            state.status = "idle";
            state.profileStatus = "idle";
          }
        }
      );
  },
});
export const {
  logout,
  clearError,
  clearProfileError,
  hydrateFromStorage,
} = authSlice.actions;
export default authSlice.reducer;
