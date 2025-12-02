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

// Category API
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

// Book API
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  description: string;
  cover_image: string;
  stock: number;
  category_id: number;
  created_at: string;
}

// Fetch all books
export const fetchBooksApi = async () => {
  return request<Book[]>("/admin/books/list");
};

// Create a new book (using FormData for file upload)
export const createBookApi = async (data: FormData) => {
  return request<Book>("/admin/books/", {
    method: "POST",
    body: data,
  });
};

// Fetch all categories
export const fetchCategoriesApi = async () => {
  return request<Category[]>("/admin/categories/list");
};

// Create a new category
export const createCategoryApi = async (data: CreateCategoryData) => {
  return request<Category>("/admin/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update an existing book (using FormData for file upload)
export const updateBookApi = async (id: number, data: FormData) => {
  return request<Book>(`/admin/books/${id}`, {
    method: "PUT",
    body: data,
  });
};

// Update an existing category
export const updateCategoryApi = async (
  id: number,
  data: UpdateCategoryData
) => {
  return request<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a book
export const deleteBookApi = async (id: number) => {
  return request<{ message: string }>(`/admin/books/${id}`, {
    method: "DELETE",
  });
};

// Delete a category
export const deleteCategoryApi = async (id: number) => {
  return request<{ message: string }>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
};
