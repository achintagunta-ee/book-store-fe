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
