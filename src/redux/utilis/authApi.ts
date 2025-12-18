const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  console.log(`API Request: ${opts.method || "GET"} ${BASE_URL}${path}`);
  console.log("Request body:", opts.body);

  // Normalize headers to a plain object to avoid TypeScript errors with HeadersInit union type.
  const headers: Record<string, string> = {};
  if (opts.headers) {
    if (opts.headers instanceof Headers) {
      opts.headers.forEach((value, key) => (headers[key] = value));
    } else if (Array.isArray(opts.headers)) {
      opts.headers.forEach(([key, value]) => (headers[key] = value));
    } else {
      Object.assign(headers, opts.headers);
    }
  }

  if (!(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add Authorization header if token exists
  const token = localStorage.getItem("auth_access");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
  });

  console.log(`API Response: ${res.status} ${res.statusText}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`API Error: ${res.status} - ${text}`);
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const data = (await res.json()) as T;
  console.log("API Response data:", data);
  return data;
}

// Auth APIs
export async function loginApi(email: string, password: string) {
  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Registration API
export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
  email: string;
  client: string;
  role: string;
  can_login: boolean;
}

export async function registerApi(data: RegisterData) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logout API
export async function logoutApi() {
  // This endpoint might be for server-side token invalidation.
  // Even if it only returns a message, we call it as specified.
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

// Get Current User Info API
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  client: string;
  created_at: string;
  profile_image?: string | null;
}

export async function getCurrentUserApi() {
  return request<UserProfile>("/users/me");
}

// Update User Profile API
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
}

export async function updateUserProfileApi(data: FormData) {
  return request<{ message: string; user: UserProfile }>(
    "/users/update-profile",
    {
      method: "PUT",
      body: data,
    }
  );
}

// Forgot Password API
export async function forgotPasswordApi(email: string) {
  return request<{ message: string; reset_code: string; expires_in: number }>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}

// Reset Password API
export async function resetPasswordApi(
  email: string,
  code: string,
  new_password: string
) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email,
      code,
      new_password,
    }),
  });
}

// --- Checkout APIs ---

// 21. Save Address
export interface AddressData {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export async function saveAddressApi(data: AddressData) {
  return request<{ message: string; address_id: number }>("/checkout/address", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 22. Order Summary
export interface OrderSummaryItem {
  book_title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AddressSummaryResponse {
  has_address: boolean;
  addresses: AddressItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: OrderSummaryItem[];
  };
}

export async function getAddressSummaryApi() {
  return request<AddressSummaryResponse>("/checkout/address-summary", {
    method: "POST",
  });
}

export async function listAddressesApi() {
  return request<AddressItem[]>("/checkout/list-addresses");
}

// 23. Place Order
export interface PlaceOrderResponse {
  order_id: string;
  status: string;
  estimated_delivery: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: any;
}

export interface PlacedOrderItem {
  book_title: string;
  price: number;
  quantity: number;
  line_total: number;
}

export async function placeOrderApi(addressId: number) {
  return request<PlaceOrderResponse>(
    `/checkout/order/place-order?address_id=${addressId}`,
    {
      method: "POST",
    }
  );
}

export interface ConfirmOrderResponse {
  address: AddressItem;
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  items: {
    book_title: string;
    price: number;
    quantity: number;
    line_total: number;
  }[];
}

export async function confirmOrderApi(addressId: number) {
  return request<ConfirmOrderResponse>(
    `/checkout/confirm-order?address_id=${addressId}`,
    {
      method: "POST",
    }
  );
}

// (c) Payment Complete
export interface CompletePaymentResponse {
  message: string;
  order_id: number;
  estimated_delivery: string;
  items: any[];
  invoice_url: string;
  continue_shopping_url: string;
  track_order_url: string;
}

export async function completePaymentApi(orderId: number) {
  return request<CompletePaymentResponse>(
    `/checkout/orders/${orderId}/payment-complete`,
    {
      method: "POST",
    }
  );
}

// 25. Order Confirmation Page
export interface OrderConfirmationResponse {
  order_id: string; // e.g., "#12"
  status: string;
  estimated_delivery: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: any[]; // Define item structure if known
}

export async function getOrderConfirmationApi(orderId: number) {
  return request<OrderConfirmationResponse>(
    `/checkout/order/confirm/${orderId}`
  );
}

// (f) Get Order at thankyou page

// 26. Track Order
export interface TrackOrderResponse {
  order_id: string;
  status: string;
  created_at: string;
}

export async function trackOrderApi(orderId: number) {
  return request<TrackOrderResponse>(`/checkout/orders/${orderId}/track`);
}

// 27. Download Invoice
export function getInvoiceDownloadUrl(orderId: number): string {
  return `${BASE_URL}/checkout/orders/${orderId}/invoice/download`;
}

export async function downloadInvoiceApi(orderId: number) {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {
    "Accept": "application/pdf"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/checkout/orders/${orderId}/invoice/download`, {
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to download invoice");
  }

  const arrayBuffer = await res.arrayBuffer();
  
  // Check for PDF magic bytes: %PDF (hex: 25 50 44 46)
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 4));
  const isPdfBinary = headerBytes[0] === 0x25 && 
                      headerBytes[1] === 0x50 && 
                      headerBytes[2] === 0x44 && 
                      headerBytes[3] === 0x46;

  if (isPdfBinary) {
    return new Blob([arrayBuffer], { type: "application/pdf" });
  }

  // Try to decode as text to check for Base64 or JSON
  const textDecoder = new TextDecoder();
  const text = textDecoder.decode(arrayBuffer).trim();

  // Check if it's Base64 encoded PDF (starts with JVBERi)
  // Handle potential quotes context if server returns "JVBERi..."
  const cleanText = text.replace(/^["']|["']$/g, '');
  if (cleanText.startsWith("JVBERi")) {
    try {
      const binaryString = atob(cleanText);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: "application/pdf" });
    } catch (e) {
      console.error("Failed to decode Base64 string", e);
    }
  }

  // Check for JSON error
  try {
    if (text.startsWith("{") || text.startsWith("[")) {
      const json = JSON.parse(text);
      if (json && (json.message || json.error)) {
        throw new Error(json.message || json.error);
      }
    }
  } catch (e) {
    // Ignore JSON parse error, it might be just garbage text
  }

  // Fallback: Return original buffer as PDF blob
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

export async function viewOrderInvoiceApi(orderId: number) {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {
    "Accept": "application/pdf"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/checkout/orders/${orderId}/invoice`, {
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to view invoice");
  }

  const arrayBuffer = await res.arrayBuffer();
  
  // Check for PDF magic bytes: %PDF (hex: 25 50 44 46)
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 4));
  const isPdfBinary = headerBytes[0] === 0x25 && 
                      headerBytes[1] === 0x50 && 
                      headerBytes[2] === 0x44 && 
                      headerBytes[3] === 0x46;

  if (isPdfBinary) {
    return new Blob([arrayBuffer], { type: "application/pdf" });
  }

  // Try to decode as text to check for Base64 or JSON
  const textDecoder = new TextDecoder();
  const text = textDecoder.decode(arrayBuffer).trim();

  // Check if it's Base64 encoded PDF (starts with JVBERi)
  const cleanText = text.replace(/^["']|["']$/g, '');
  if (cleanText.startsWith("JVBERi")) {
    try {
      const binaryString = atob(cleanText);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: "application/pdf" });
    } catch (e) {
      console.error("Failed to decode Base64 string", e);
    }
  }

  // Check for JSON error
  try {
    if (text.startsWith("{") || text.startsWith("[")) {
      const json = JSON.parse(text);
      if (json && (json.message || json.error)) {
        throw new Error(json.message || json.error);
      }
    }
  } catch (e) {
    // Ignore JSON parse error, it might be just garbage text
  }

  // Fallback: Return original buffer as PDF blob
  return new Blob([arrayBuffer], { type: "application/pdf" });
}

// --- 28. Address CRUD (Profile) ---

export interface AddressItem {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export async function getAddressesApi() {
  return request<AddressItem[]>("/users/profile/addresses");
}

export async function addAddressApi(data: AddressData) {
  return request<{ message: string; address_id?: number; id?: number }>(
    "/users/profile/address",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateAddressApi(id: number, data: AddressData) {
  return request<{ message: string; address: AddressItem }>(
    `/users/profile/address/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAddressApi(id: number) {
  return request<{ message: string }>(`/users/profile/address/${id}`, {
    method: "DELETE",
  });
}

// --- Wishlist APIs ---

export interface WishlistItem {
  wishlist_id: number;
  book_id: number;
  title: string;
  author: string;
  price: number;
  cover_image_url: string | null;
  slug: string;
}

export async function getWishlistApi() {
  return request<WishlistItem[]>("/wishlist/");
}

export async function addToWishlistApi(bookId: number) {
  return request<{ message: string }>(`/wishlist/add/${bookId}`, {
    method: "POST",
  });
}

export async function removeFromWishlistApi(bookId: number) {
  return request<{ message: string }>(`/wishlist/remove/${bookId}`, {
    method: "DELETE",
  });
}

export async function checkWishlistStatusApi(bookId: number) {
  return request<{ in_wishlist: boolean }>(`/wishlist/status/${bookId}`);
}

export async function getWishlistCountApi() {
  return request<{ count: number }>("/wishlist/count");
}

// --- Order History & Details ---

export interface OrderHistoryItem {
  order_id: string;
  raw_id: number;
  date: string;
  total: number;
  status: string;
  details_url: string;
}

export async function getOrderHistoryApi() {
  return request<OrderHistoryItem[]>("/users/profile/orders/history");
}

export interface OrderDetailResponse {
  order: {
    address_id: number;
    subtotal: number;
    shipping: number;
    total: number;
    created_at: string;
    user_id: number;
    id: number;
    tax: number;
    status: string;
  };
  items: any[];
}

export async function getOrderDetailsApi(orderId: number) {
  return request<OrderDetailResponse>(`/users/profile/orders/${orderId}`);
}

// --- Admin Payments API ---

export interface AdminPayment {
  payment_id: number;
  txn_id: string;
  order_id: number;
  amount: number;
  status: string;
  method: string;
  customer_name: string;
  created_at: string;
  date?: string;
  actions?: {
    view_invoice: string;
    download_receipt: string;
  };
}

export interface AdminPaymentsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: AdminPayment[];
}

export interface AdminPaymentsParams {
  page?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  first_name?: string;
  last_name?: string;
}

export async function getAdminPaymentsApi(params: AdminPaymentsParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.start_date) query.append("start_date", params.start_date);
  if (params.end_date) query.append("end_date", params.end_date);
  if (params.first_name) query.append("first_name", params.first_name);
  if (params.last_name) query.append("last_name", params.last_name);

  return request<AdminPaymentsResponse>(`/admin/payments?${query.toString()}`);
}

export interface AdminPaymentDetail {
  payment_id: number;
  txn_id: string;
  order_id: number;
  amount: number;
  status: string;
  method: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

export async function getAdminPaymentByIdApi(paymentId: number) {
  return request<AdminPaymentDetail>(`/admin/payments/${paymentId}`);
}

// f) View Invoice
export interface InvoiceItem {
  title: string;
  price: number;
  quantity: number;
  line_total: number;
}

export interface ViewInvoiceResponse {
  invoice_id: string;
  order_id: number;
  customer_id: number;
  status: string;
  created_at: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export async function getInvoiceApi(orderId: number) {
  return request<ViewInvoiceResponse>(`/admin/invoices/${orderId}`);
}

// g) Payment Receipt
export interface PaymentReceiptResponse {
  receipt_id: string;
  payment_id: number;
  txn_id: string;
  order_id: number;
  amount: number;
  method: string;
  status: string;
  paid_at: string;
}

export async function getPaymentReceiptApi(paymentId: number) {
  return request<PaymentReceiptResponse>(`/admin/payments/${paymentId}/receipt`);
}

// 39) Admin Orders Management
export interface AdminOrder {
  order_id: number;
  customer_name: string;
  date: string;
  total_amount: number;
  status: string;
}

export interface AdminOrdersResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: AdminOrder[];
}

export interface AdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export async function getAdminOrdersApi(params: AdminOrdersParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.start_date) query.append("start_date", params.start_date);
  if (params.end_date) query.append("end_date", params.end_date);

  return request<AdminOrdersResponse>(`/admin/orders?${query.toString()}`);
}

export interface AdminOrderDetailItem {
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AdminOrderDetail {
  order_id: number;
  customer: {
    name: string;
    email: string;
  };
  status: string;
  created_at: string;
  items: AdminOrderDetailItem[];
  invoice_url: string;
}

export async function getAdminOrderDetailsApi(orderId: number) {
  return request<AdminOrderDetail>(`/admin/orders/${orderId}`);
}

export async function notifyCustomerApi(orderId: number) {
  return request<{ message: string; order_id: number }>(
    `/admin/orders/${orderId}/notify`,
    {
      method: "POST",
    }
  );
}

export async function downloadOrderInvoiceApi(orderId: number): Promise<string> {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/invoice`, {
    headers,
  });
  if (!res.ok) {
    throw new Error("Failed to download invoice");
  }
  return await res.text();
}

