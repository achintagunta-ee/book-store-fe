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

  if (res.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

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
  profile_image_url?: string;
}

// 12. Get Current User Info
// Endpoint: GET /users/me
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
  phone_number: string;
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
  cover_image_url?: string;
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

  if (res.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

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

  if (res.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

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

  // Check for JSON
  try {
    if (text.startsWith("{") || text.startsWith("[")) {
      const json = JSON.parse(text);
      // Return JSON directly if it is valid JSON
      return json;
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
  phone_number?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AddressListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: AddressItem[];
}

export async function getAddressesApi() {
  return request<AddressListResponse>("/users/profile/addresses");
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
  items: {
    book_title: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}

export interface OrderHistoryResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: OrderHistoryItem[];
}

export async function getOrderHistoryApi(page: number = 1) {
  return request<OrderHistoryResponse>(`/users/profile/orders/history?page=${page}`);
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
  order_id: number;
  customer: string | { id: number; name: string };
  date: string;
  amount: number;
  status: string;
  actions: {
    view: string;
    receipt: string;
  };
}

export interface AdminPaymentsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
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
  total: number;
}

export interface ViewInvoiceResponse {
  invoice_id: string;
  order_id: number;
  customer: {
    name: string;
    email: string;
  };
  payment: {
    txn_id: string;
    method: string;
    status: string;
    amount: number;
    payment_id: number;
  };
  date: string;
  total: number;
  items: {
    title: string;
    price: number;
    qty: number;
    total: number;
  }[];
}

export async function getInvoiceApi(orderId: number) {
  return request<ViewInvoiceResponse>(`/admin/orders/${orderId}/view-invoice`);
}

// g) Payment Receipt
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

// 55) User Payments List
export interface UserPayment {
  payment_id: number;
  txn_id: string;
  order_id: number | string;
  raw_id?: number;
  amount: number;
  status: string;
  method: string;
  order_status: string;
  created_at: string;
  actions: {
    view_payment: string;
    view_order: string;
    download_invoice: string;
  };
}

export interface UserPaymentsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: UserPayment[];
}

export async function getUserPaymentsApi(page: number = 1) {
  return request<UserPaymentsResponse>(`/checkout/my-payments?page=${page}`);
}

// 39) Admin Orders Management
export interface AdminOrder {
  order_id: number;
  customer: string | { id: number; name: string };
  email: string;
  date: string;
  total: number;
  status: string;
  actions: {
    view: string;
    notify: string;
    track: string;
    invoice: string;
  };
}

export interface AdminOrdersResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
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
  return request<{ message: string }>(
    `/admin/orders/${orderId}/notify`,
    {
      method: "POST",
    }
  );
}

// --- E-book APIs ---

// 60) Complete Payment after expiry
export async function completePaymentAfterExpiryApi(orderId: number) {
  return request<{ detail?: string; message?: string }>(
    `/checkout/orders/${orderId}/payment-complete`,
    {
      method: "POST",
    }
  );
}

// 61) E-book Management

// a) Create E-book
export interface UploadEbookResponse {
  message: string;
  book_id: number;
  ebook_price: number;
  pdf_key: string;
  is_ebook: boolean;
}

export async function uploadEbookApi(bookId: number, file: File, ebookPrice: number) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ebook_price", ebookPrice.toString());

  return request<UploadEbookResponse>(`/admin/books/${bookId}/upload-ebook`, {
    method: "POST",
    body: formData,
  });
}

// b) E-book Purchase
export interface EbookPurchaseResponse {
  purchase_id: number;
  amount: number;
  status: string;
  message: string;
}

export async function purchaseEbookApi(bookId: number) {
  return request<EbookPurchaseResponse>(`/ebooks/purchase?book_id=${bookId}`, {
    method: "POST",
  });
}

// c) RazorPay Integration - Ebook Purchase
export interface CreateEbookRazorpayOrderResponse {
  purchase_id: number;
  razorpay_order_id: string;
  razorpay_key: string;
  amount: number;
  user_email: string;
  user_name: string;
  message: string;
}

export async function createEbookRazorpayOrderApi(purchaseId: number) {
  return request<CreateEbookRazorpayOrderResponse>(
    `/ebooks/${purchaseId}/create-razorpay-order`,
    {
      method: "POST",
    }
  );
}

// d) Verify Payment - Ebook
export interface VerifyEbookRazorpayPaymentResponse {
  message: string;
  purchase_id: number;
  payment_id: number;
  txn_id: string;
  book_title: string;
  access: string;
  library_url: string;
  continue_shopping_url: string;
}

export async function verifyEbookRazorpayPaymentApi(
  purchaseId: number,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  return request<VerifyEbookRazorpayPaymentResponse>(
    `/ebooks/${purchaseId}/verify-razorpay-payment`,
    {
      method: "POST",
      body: JSON.stringify({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
      }),
    }
  );
}

// d) User Library
export interface LibraryBook {
  book_id: number;
  title: string;
  purchased_at: string;
  expires_at: string;
  cover_image_url?: string;
}

export async function getUserLibraryApi() {
  return request<LibraryBook[]>("/users/library");
}

// e) Read Ebook
export interface ReadEbookResponse {
  pdf_url: string;
  expires_in: number;
  purchased_at: string;
  access_expires_at: string;
}

export async function readEbookApi(bookId: number) {
  return request<ReadEbookResponse>(`/users/library/ebooks/${bookId}/read`);
}

export async function downloadOrderInvoiceApi(orderId: number) {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {
    "Accept": "application/pdf"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/invoice/download`, {
    headers,
  });

  if (res.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    // Try to get error text
    const errorText = await res.text().catch(() => "Failed to download invoice");
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
    // Ignore JSON parse error
  }

  // Fallback: Return original buffer as PDF blob
  return new Blob([arrayBuffer], { type: "application/pdf" });
}


export interface AdminInvoiceResponse {
  invoice_id: string;
  order_id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  payment: {
    txn_id: string;
    method: string;
    status: string;
    amount: number;
  };
  order_status: string;
  date: string;
  summary: {
    subtotal: number;
    shipping: number;
    total: number;
    tax?: number; // Optional as not in user example but good to have
  };
  items: {
    title: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}

export async function getAdminOrderInvoiceApi(orderId: number) {
  return request<AdminInvoiceResponse>(`/admin/orders/${orderId}/view-invoice`);
}

export interface UpdateOrderStatusResponse {
  message: string;
  order_id: number;
  old_status: string;
  new_status: string;
}

export async function updateOrderStatusApi(orderId: number, newStatus: string) {
  return request<UpdateOrderStatusResponse>(
    `/admin/orders/${orderId}/status?new_status=${newStatus}`,
    {
      method: "PATCH",
    }
  );
}

// 44) Users Notifications
export interface NotificationItem {
  notification_id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

export async function fetchNotificationsApi() {
  return request<NotificationItem[]>("/users/notifications");
}

export interface NotificationDetail {
  id: number;
  content: string;
  status: string;
  recipient_role: string;
  user_id: number;
  related_id: number;
  trigger_source: string;
  title: string;
  channel: string;
  created_at: string;
}

export async function viewNotificationApi(notificationId: number) {
  return request<NotificationDetail>(`/users/notifications/${notificationId}`);
}

// 43) Admin Notifications
// 43) Admin Notifications
export interface AdminNotificationItem {
  notification_id: number;
  title: string;
  content: string;
  trigger_source: string;
  related_id?: number;
  order_id?: number;
  purchase_id?: number;
  order_status?: string;
  notification_status?: string;
  status: string; // This might be notification_status in the new response, keeping for compatibility
  created_at: string;
}

export interface AdminNotificationsResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: AdminNotificationItem[];
}

export async function getAdminNotificationsApi(triggerSource?: string) {
  const query = triggerSource ? `?trigger_source=${triggerSource}` : "";
  return request<AdminNotificationsResponse>(`/admin/notifications${query}`);
}

export interface AdminNotificationDetail {
  notification_id: number;
  recipient_role: string;
  user_id: number;
  related_id?: number;
  order_id?: number;
  purchase_id?: number;
  trigger_source: string;
  title: string;
  channel: string;
  content: string;
  status?: string;
  notification_status?: string;
  created_at: string;
}

export async function viewAdminNotificationApi(notificationId: number) {
  return request<AdminNotificationDetail>(`/admin/notifications/${notificationId}`);
}

export interface ResendNotificationResponse {
  message: string;
  notification_id: number;
  trigger_source: string;
  status: string;
}

export async function resendNotificationApi(notificationId: number) {
  return request<ResendNotificationResponse>(
    `/admin/notifications/${notificationId}/resend`,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

// 45. Book Inventory
export interface InventorySummary {
  total_books: number;
  low_stock: number;
  out_of_stock: number;
}

export async function getInventorySummaryApi() {
  return request<InventorySummary>("/admin/book/inventory/summary");
}

export interface InventoryItem {
  id: number;
  title: string;
  author: string;
  stock: number;
  price: number;
  status: string;
  updated_at: string;
  actions: {
    edit: string;
    update_stock: string;
    view: string;
  };
}

export interface InventoryListResponse {
  data: InventoryItem[];
  total: number;
  total_pages: number;
  page: number;
  limit: number;
}

export async function getInventoryListApi(page: number = 1, limit: number = 10) {
  return request<InventoryListResponse>(`/admin/book/inventory?page=${page}&limit=${limit}`);
}

export interface UpdateStockResponse {
  message: string;
  book: {
    id: number;
    title: string;
    author: string;
    old_stock: number;
    current_stock: number;
    status: string;
    updated_at: string;
  };
}

export async function updateBookStockApi(bookId: number, stock: number) {
  return request<UpdateStockResponse>(
    `/admin/book/inventory/${bookId}?stock=${stock}`,
    {
      method: "PATCH",
    }
  );
}

// 46) Admin Settings
export interface GeneralSettings {
  site_title: string;
  store_address: string;
  contact_email: string;
  updated_at: string;
  site_logo_url: string;
}

export async function getGeneralSettingsApi() {
  return request<GeneralSettings>("/admin/settings/general");
}

export async function updateGeneralSettingsApi(data: FormData) {
  return request<{ message: string; data: GeneralSettings }>(
    "/admin/settings/general/update",
    {
      method: "PUT",
      body: data,
    }
  );
}

// 47) Admin Dashboard
export interface DashboardStats {
  cards: {
    total_books: number;
    total_orders: number;
    total_revenue: number;
    low_stock: number;
  };
  admin_info: {
    id: number;
    username: string;
    email: string;
  };
}

export async function getDashboardStatsApi() {
  return request<DashboardStats>("/admin/dashboard");
}

// 48) Admin Search
export interface SearchResult {
  books: any[];
  users: any[];
  orders: any[];
}

export async function adminSearchApi(query: string) {
  return request<SearchResult>(`/admin/search?q=${query}`);
}

// 49) Get Payment Details for User
export interface PaymentDetails {
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

export async function getPaymentDetailsApi(paymentId: number) {
  return request<PaymentDetails>(`/checkout/payment-details/${paymentId}`);
}

// 50) Admin Add Tracking URL
export async function addOrderTrackingApi(
  orderId: number,
  trackingId: string,
  trackingUrl: string
) {
  return request<{ message: string }>(
    `/admin/orders/${orderId}/tracking?tracking_id=${trackingId}&tracking_url=${trackingUrl}`,
    {
      method: "PATCH",
    }
  );
}

// 51) Check Order Status
export interface OrderStatusResponse {
  order_id: number;
  status: string;
  updated_at: string;
}

export async function getOrderStatusApi(orderId: number) {
  return request<OrderStatusResponse>(`/admin/orders/${orderId}/status-view`);
}

// 11) View Admin Notifications (Orders)
export interface AdminOrderNotificationItem {
  notification_id: number;
  title: string;
  content: string;
  trigger_source: string;
  related_id: number;
  status: string;
  created_at: string;
}

export async function getAdminOrderNotificationsApi() {
  return request<AdminOrderNotificationItem[]>("/admin/orders/notifications");
}



// --- Social Links API ---

export interface SocialLinks {
  id?: number;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
}

export async function getSocialLinksApi() {
  return request<SocialLinks>("/settings/social-links");
}

export async function updateSocialLinksApi(data: SocialLinks) {
  const { id, ...payload } = data;
  return request<SocialLinks>("/admin/settings/social-links", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// 54) Offline Orders
export interface OfflineOrderItem {
  book_id: number;
  quantity: number;
}

export interface OfflineOrderRequest {
  user_id: number;
  address_id: number;
  items: OfflineOrderItem[];
  payment_mode: string;
  notes: string;
}

export interface OfflineOrderResponse {
  order_id: number;
  status: string;
  payment_mode: string;
  placed_by: string;
}

export async function createOfflineOrderApi(data: OfflineOrderRequest) {
  return request<OfflineOrderResponse>("/admin/orders/offline", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// b) Create offline payment
export interface OfflinePaymentRequest {
  order_id: number;
  amount: number;
  method: string;
  status: string;
}

export interface OfflinePaymentResponse {
  message: string;
  payment_id: number;
  txn_id: string;
  order_id: number;
  amount: number;
  status: string;
}

export async function createOfflinePaymentApi(data: OfflinePaymentRequest) {
  const query = new URLSearchParams({
    order_id: data.order_id.toString(),
    amount: data.amount.toString(),
    method: data.method,
  });
  return request<OfflinePaymentResponse>(`/admin/payments/offline?${query.toString()}`, {
    method: "POST",
  });
}

// --- Admin Profile API ---

export interface AdminProfileResponse {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  client: string;
  profile_image: string | null;
  profile_image_url?: string;
  created_at: string;
  can_login: boolean;
}

export async function getAdminProfileApi() {
  return request<AdminProfileResponse>("/admin/profile");
}

export async function updateAdminProfileApi(data: FormData) {
  return request<{ message: string; admin: AdminProfileResponse }>(
    "/admin/update-profile",
    {
      method: "PUT",
      body: data,
    }
  );
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export async function changeAdminPasswordApi(data: ChangePasswordRequest) {
  return request<{ message: string }>("/admin/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// --- Cancellation & Refund APIs ---

// a) Request cancellation by user
export interface CancellationRequestPayload {
  reason: string;
  additional_notes: string;
}

export interface CancellationRequestResponse {
  message: string;
  request_id: number;
  status: string;
}

export async function requestCancellationApi(orderId: number, data: CancellationRequestPayload) {
  return request<CancellationRequestResponse>(`/orders/cancellations/${orderId}/request-cancellation`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// b) Customer - check cancellation status
export interface CancellationStatusResponse {
  message: string;
  request_id: number;
  status: string;
}

export async function getCancellationStatusApi(orderId: number) {
  return request<CancellationStatusResponse>(`/orders/cancellations/${orderId}/cancellation-status`);
}

// c) Admin view all cancellation requests
export interface CancellationRequestItem {
  request_id: number;
  order_id: number;
  customer: string | { id: number; name: string };
  amount: number;
  status: string;
  requested_at: string;
  reason: string;
  actions: {
    approve: string;
    reject: string;
    refund: string;
  };
}

export interface AdminCancellationRequestsResponse {
  results: CancellationRequestItem[];
  total_items: number;
  current_page: number;
  limit: number;
  total_pages: number;
}

export interface AdminCancellationRequestsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getAdminCancellationRequestsApi(params: AdminCancellationRequestsParams = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  
  return request<AdminCancellationRequestsResponse>(`/admin/cancellations/cancellation-requests?${query.toString()}`);
}

// d) Admin – Approve Cancel
export interface ApproveCancellationResponse {
  message: string;
  request_id: number;
  status: string;
}

export async function approveCancellationApi(requestId: number) {
  return request<ApproveCancellationResponse>(`/admin/cancellations/${requestId}/approve`, {
    method: "POST",
  });
}

// e) Admin – process refund
export interface ProcessRefundPayload {
  refund_amount: "full" | "partial";
  refund_method: string;
  admin_notes: string;
  partial_amount?: number;
}

export interface ProcessRefundResponse {
  message: string;
  order_id: number;
  refund_amount: number;
  refund_reference: string;
  order_status: string;
}

export async function processRefundApi(requestId: number, data: ProcessRefundPayload) {
  return request<ProcessRefundResponse>(`/admin/cancellations/${requestId}/process-refund`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// f) Admin – reject cancellation request
export interface RejectCancellationPayload {
  reason: string;
}

export interface RejectCancellationResponse {
  message: string;
  request_id: number;
  status: string;
}

export async function rejectCancellationApi(requestId: number, data: RejectCancellationPayload) {
  return request<RejectCancellationResponse>(`/admin/cancellations/cancellation-requests/${requestId}/reject`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// f) Admin – cancellation dashboard stats
export interface CancellationStatsResponse {
  pending_requests: number;
  processed_today: number;
  total_refunds_this_month: number;
  refunded_orders_this_month: number;
}

export async function getCancellationStatsApi() {
  return request<CancellationStatsResponse>("/admin/cancellations/stats");
}

// g) Order Status Verification (already used in other places, but explicit definition if needed)
export interface OrderStatusResponse {
  order_id: number;
  status: string;
}

// Existing getOrderStatusApi covers this if it exists, otherwise:
export async function verifyOrderStatusApi(orderId: number) {
  return request<OrderStatusResponse>(`/orders/${orderId}`);
}

// 62) RazorPay Integration

export interface CreateRazorpayOrderResponse {
  order_id: number;
  razorpay_order_id: string;
  amount: number;
  amount_paise: number;
  key_id: string;
  user_email: string;
  user_name: string;
  address: any;
}

export async function createRazorpayOrderApi(addressId: number) {
  return request<CreateRazorpayOrderResponse>(
    `/checkout/create-razorpay-order?address_id=${addressId}`,
    {
      method: "POST",
    }
  );
}

export interface VerifyRazorpayPaymentResponse {
  message: string;
  order_id: number;
  payment_id: number;
  txn_id: string;
  estimated_delivery: string;
  items: any[];
  payment_details: {
    id: number;
    txn_id: string;
    amount: number;
    status: string;
    method: string;
    created_at: string;
  };
  track_order_url: string;
  invoice_url: string;
  continue_shopping_url: string;
}

export async function verifyRazorpayPaymentApi(
  orderId: number,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  return request<VerifyRazorpayPaymentResponse>(
    `/checkout/verify-razorpay-payment`,
    {
      method: "POST",
      body: JSON.stringify({
        order_id: orderId.toString(),
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
      }),
    }
  );
}

// 63) Guest Checkout Integration

export interface CreateGuestRazorpayOrderResponse {
  order_id: number;
  razorpay_order_id: string;
  razorpay_key: string;
  amount: number;
  guest_email: string;
  guest_name?: string;
}

export interface VerifyGuestRazorpayPaymentResponse {
  message: string;
  order_id: number;
  amount: number;
}

export async function createGuestRazorpayOrderApi(guest: { name: string; email: string; phone: string }, items: any[], address: any, order_id?: number | null) {
  const formattedAddress = {
    line1: address.address,
    line2: "", 
    city: address.city,
    state: address.state,
    pincode: address.zip_code
  };

  const formattedItems = items.map((item: any) => ({
    book_id: item.book_id,
    quantity: item.quantity
  }));

  return request<CreateGuestRazorpayOrderResponse>(`/checkout/guest`, {
    method: "POST",
    body: JSON.stringify({ guest, items: formattedItems, address: formattedAddress, order_id }),
  });
}

export async function verifyGuestRazorpayPaymentApi(
  orderId: number,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  return request<VerifyGuestRazorpayPaymentResponse>(
    `/checkout/guest/verify-payment`,
    {
      method: "POST",
      body: JSON.stringify({
        order_id: orderId.toString(),
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
      }),
    }
  );
}

// Guest Order Details
export interface GuestOrderDetailsResponse {
  order_id: number;
  razorpay_order_id: string;
  razorpay_key: string;
  amount: number;
  guest_email: string;
  guest_name: string;
}


export async function getGuestOrderDetailsApi(orderId: string | number) {
  return request<GuestOrderDetailsResponse>(`/checkout/guest/${orderId}`);
}

// 66) Guest user Invoice APIs

export interface GuestInvoiceResponse {
  invoice_id: string;
  order_id: number;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    txn_id: string;
    method: string;
    status: string;
    amount: number;
  };
  order_status: string;
  date: string;
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  items: {
    title: string;
    price: number;
    quantity: number;
    total: number;
  }[];
}

export async function viewGuestOrderInvoiceApi(orderId: string | number) {
  return request<GuestInvoiceResponse>(`/checkout/guest/${orderId}/view-invoice`);
}

export async function downloadGuestInvoiceApi(orderId: string | number) {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {
    "Accept": "application/pdf"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}/checkout/guest/${orderId}/invoice/download`, {
    headers,
  });

  if (res.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

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

  // Check for JSON
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


// 61) E-book Management - Additional APIs

// e) Admin List E Purchases
export interface EbookPurchaseItem {
  book_id: number;
  amount: number;
  status: string;
  access_expires_at: string | null;
  created_at: string;
  renewal_count: number;
  user_id: number;
  id: number;
  updated_at: string;
  last_renewed_at: string | null;
}

export async function getEbookPurchasesListApi() {
  return request<EbookPurchaseItem[]>("/ebooks/admin/purchases-status-list");
}

// f) Admin List E Payments
export interface EbookPaymentItem {
  amount: number;
  id: number;
  txn_id: string;
  method: string;
  ebook_purchase_id: number;
  user_id: number;
  status: string;
  created_at: string;
}

export async function getEbookPaymentsListApi() {
  return request<EbookPaymentItem[]>("/ebooks/admin/payments-list");
}

// g) Update E book price
export interface UpdateEbookPriceResponse {
  message: string;
  ebook_price: number;
}

export async function updateEbookPriceApi(bookId: number, price: number) {
  return request<UpdateEbookPriceResponse>(`/ebooks/admin/update-ebook-price/${bookId}?ebook_price=${price}`, {
    method: "PUT",
  });
}

// h) Toggle eBook Enable/Disable by admin
export interface ToggleEbookResponse {
  message: string;
  book_id?: number;
  is_ebook?: boolean;
}

export async function toggleEbookStatusApi(bookId: number, enabled: boolean) {
  return request<ToggleEbookResponse>(`/ebooks/admin/toggle-ebook/${bookId}?enabled=${enabled}`, {
    method: "PATCH",
  });
}

// i) Ebook List
export interface EbookListItem {
  book_id: number;
  title: string;
  author: string;
  ebook_price: number;
  pdf_uploaded: boolean;
  is_ebook: boolean;
  created_at: string;
  updated_at: string;
}

export interface EbookListResponse {
  total: number;
  ebooks: EbookListItem[];
}

export async function getEbookListApi() {
  return request<EbookListResponse>("/ebooks/admin/list");
}

// --- Admin Analytics APIs ---

export interface AnalyticsOverviewResponse {
  revenue: number;
  orders: number;
  avg_order_value: number;
}

export async function getAnalyticsOverviewApi() {
  return request<AnalyticsOverviewResponse>("/admin/analytics/overview");
}

export interface RevenueChartItem {
  date: string;
  revenue: number;
}

export async function getRevenueChartApi() {
  return request<RevenueChartItem[]>("/admin/analytics/revenue-chart");
}

export interface TopBookItem {
  title: string;
  sold: number;
}

export async function getTopBooksApi() {
  return request<TopBookItem[]>("/admin/analytics/top-books");
}

export interface TopCustomerItem {
  email: string;
  spent: number;
  orders: number;
}

export async function getTopCustomersApi() {
  return request<TopCustomerItem[]>("/admin/analytics/top-customers");
}

export interface CategorySaleItem {
  category: string;
  sold: number;
}

export async function getCategorySalesApi() {
  return request<CategorySaleItem[]>("/admin/analytics/category-sales");
}

export async function exportAnalyticsReportApi() {
  const token = localStorage.getItem("auth_access");
  const headers: Record<string, string> = {
    "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/json, */*"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Authorization header
  }

  const res = await fetch(`${BASE_URL}/admin/analytics/export`, {
    headers,
  });

  if (res.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("auth_access");
      window.location.href = "/login";
      throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to export report");
  }

  return await res.blob();
}
