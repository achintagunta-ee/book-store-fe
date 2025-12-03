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

export interface FilterParams {
  category?: string;
  author?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  query?: string;
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
  rating?: number;
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

// Public APIs

// Fetch all public books
export const fetchPublicBooksApi = async () => {
  return request<Book[]>("/books/");
};

// Fetch a single book by ID
export const fetchBookByIdApi = async (id: number) => {
  return request<Book>(`/books/${id}`);
};

// Fetch books by category ID
export const fetchBooksByCategoryIdApi = async (categoryId: number) => {
  return request<Book[]>(`/categories/${categoryId}/books`);
};

// Fetch books by category ID (from /books/ endpoint)
export const fetchBooksByCategoryIdPublicApi = async (categoryId: number) => {
  return request<Book[]>(`/books/category/${categoryId}`);
};

// Fetch books by category name
export const fetchBooksByCategoryNameApi = async (categoryName: string) => {
  return request<Book[]>(`/books/${categoryName}`);
};

// Search for a book by name and category
export const searchBookInCategoryByNameApi = async (
  categoryName: string,
  bookName: string
) => {
  return request<Book[]>(`/categories/${categoryName}/${bookName}`);
};

// Fetch all public categories
export const fetchPublicCategoriesApi = async () => {
  return request<Category[]>("/categories/");
};

// Fetch a single category by ID
export const fetchCategoryByIdApi = async (id: number) => {
  return request<Category>(`/categories/${id}`);
};

// Search for a category by name
export const searchCategoryByNameApi = async (name: string) => {
  return request<Category[]>(`/categories/${name}`);
};

// Filter books
export const filterBooksApi = async (params: FilterParams) => {
  const query = new URLSearchParams();
  if (params.category) query.append("category", params.category);
  if (params.author) query.append("author", params.author);
  if (params.min_price !== undefined)
    query.append("min_price", String(params.min_price));
  if (params.max_price !== undefined)
    query.append("max_price", String(params.max_price));
  if (params.rating !== undefined)
    query.append("rating", String(params.rating));

  return request<Book[]>(`/books/filter?${query.toString()}`);
};

// Get Featured Books
export const fetchFeaturedBooksApi = async () => {
  return request<Book[]>("/books/featured");
};

// Get Featured Authors' books
export const fetchFeaturedAuthorsBooksApi = async () => {
  return request<Book[]>("/books/featured-authors");
};

// Search books
export const searchBooksApi = async (query: string) => {
  return request<Book[]>(
    `/books/search/query?query=${encodeURIComponent(query)}`
  );
};
