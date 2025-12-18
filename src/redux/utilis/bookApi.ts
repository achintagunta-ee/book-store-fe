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
  q?: string;
  title?: string;
  author?: string;
  excerpt?: string;
  description?: string;
  tags?: string;
  category?: string;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  rating_max?: number;
  publisher?: string;
  is_featured?: boolean;
  "is_featured-authors"?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
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
  slug: string;
  author: string;
  price: number;
  description: string;
  cover_image_url: string;
  stock: number;
  category_id: number;
  rating?: number;
  created_at: string;
  updated_at: string;
  isbn: string | null;
  publisher: string | null;
  published_date: string | null;
}

export interface PaginatedBookResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  results: Book[];
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  book_id?: number;
  updated_at?: string | null;
}

export interface BookDetailResponse {
  book: Book;
  category: string;
  related_books: Book[];
  average_rating: number | null;
  total_reviews: number;
  reviews: Review[];
}

export interface CreateReviewData {
  user_name: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ListReviewsResponse {
  book_slug: string;
  average_rating: number;
  total_reviews: number;
  reviews: Review[];
}

// Cart API Types
export interface CartItem {
  created_at: string;
  book_id: number;
  quantity: number;
  id: number;
  user_id: number;
}

export interface CartViewItem {
  item_id: number;
  book_id: number;
  book_name: string;
  slug: string;
  cover_image_url: string;
  price: number;
  discount_price: number | null;
  offer_price: number | null;
  effective_price: number;
  quantity: number;
  stock: number;
  in_stock: boolean;
  total: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  final_total: number;
}

export interface ViewCartResponse {
  items: CartViewItem[];
  summary: CartSummary;
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

// Cart APIs

// Add an item to the cart
export const addToCartApi = async (book_id: number, quantity: number) => {
  return request<{ message: string; item: CartItem }>("/cart/add", {
    method: "POST",
    body: JSON.stringify({ book_id, quantity }),
  });
};

// View the cart
export const viewCartApi = async () => {
  return request<ViewCartResponse>("/cart/");
};

// Update a cart item's quantity
export const updateCartItemApi = async (item_id: number, quantity: number) => {
  return request<{ message: string; item: CartItem }>(
    `/cart/update/${item_id}`,
    {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }
  );
};

// Remove an item from the cart
export const removeCartItemApi = async (item_id: number) => {
  return request<{ message: string }>(`/cart/remove/${item_id}`, {
    method: "DELETE",
  });
};

// Clear the entire cart
export const clearCartApi = async () => {
  return request<{ message: string }>("/cart/clear", {
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

// Fetch all public books with pagination and filtering
export const fetchPublicBooksApi = async (params: FilterParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.sort) query.append("sort", params.sort);
  if (params.category_id) query.append("category_id", String(params.category_id));
  if (params.category) query.append("category", params.category);
  if (params.author) query.append("author", params.author);
  if (params.price_min !== undefined) query.append("min_price", String(params.price_min));
  if (params.price_max !== undefined) query.append("max_price", String(params.price_max));
  if (params.rating_min !== undefined) query.append("rating", String(params.rating_min));

  // Append other filter params as needed if the backend supports them on /books/
  // Based on user request, the endpoint is /books
  
  return request<PaginatedBookResponse>(`/books?${query.toString()}`);
};

// Fetch a single book by ID
export const fetchBookByIdApi = async (id: number) => {
  return request<Book>(`/books/${id}`);
};

// Fetch a single book by slug
export const fetchBookBySlugApi = async (slug: string) => {
  return request<BookDetailResponse>(`/book/detail/${slug}`);
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
  if (params.price_min !== undefined)
    query.append("min_price", String(params.price_min));
  if (params.price_max !== undefined)
    query.append("max_price", String(params.price_max));
  if (params.rating_min !== undefined)
    query.append("rating", String(params.rating_min));

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
export const advancedSearchBooksApi = async (params: FilterParams) => {
  const query = new URLSearchParams();

  // A helper to append parameters if they exist
  const append = (key: keyof FilterParams, value: any) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  };

  // Append all possible search parameters
  for (const key in params) {
    append(key as keyof FilterParams, params[key as keyof FilterParams]);
  }

  return request<{ results: Book[] }>(`/books/search?${query.toString()}`);
};

// This function seems to be for a simpler search.
// We will replace its usage with the advanced search.
// For now, we can have it call the new advanced search.
export const searchBooksApi = async (query: string) => {
  return advancedSearchBooksApi({ q: query });
};

// Dynamic Search API
export const fetchDynamicSearchBooksApi = async (query: string) => {
  return request<Book[]>(`/books/dynamic-search?query=${query}`);
};

// Review APIs

// List reviews for a book
export const listReviewsForBookApi = async (slug: string) => {
  return request<ListReviewsResponse>(`/reviews/books/${slug}/reviews`);
};

// Create a review for a book
export const createReviewApi = async (
  slug: string,
  reviewData: CreateReviewData
) => {
  return request<{ message: string; review: Review }>(
    `/reviews/books/${slug}/reviews`,
    {
      method: "POST",
      body: JSON.stringify(reviewData),
    }
  );
};

// Update a review
export const updateReviewApi = async (
  reviewId: number,
  reviewData: UpdateReviewData
) => {
  return request<{ message: string; review: Review }>(
    `/reviews/review/${reviewId}`,
    { method: "PUT", body: JSON.stringify(reviewData) }
  );
};

// Delete a review
export const deleteReviewApi = async (reviewId: number) => {
  return request<{ message: string }>(`/reviews/review/${reviewId}`, {
    method: "DELETE",
  });
};

// Home Page API
export interface HomeBook {
  book_id: number;
  title: string;
  author: string;
  price: number;
  discount_price: number | null;
  offer_price: number | null;
  cover_image: string;
  rating: number;
  cover_image_url: string;
}

export interface HomePageResponse {
  featured_books: HomeBook[];
  featured_authors_books: HomeBook[];
  new_arrivals: HomeBook[];
  popular_books: HomeBook[];
  categories: Category[];
}

export const fetchHomeDataApi = async () => {
  return request<HomePageResponse>("/users/home");
};

