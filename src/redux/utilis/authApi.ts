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
