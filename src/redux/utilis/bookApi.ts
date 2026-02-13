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

export interface FilterResponse {
  filters: {
    category_id: number | null;
    author: string | null;
    min_price: number | null;
    max_price: number | null;
    rating: number | null;
  };
  total_items: number;
  page: number;
  total_pages: number;
  books: Book[];
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
  book_id?: number;
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
  is_ebook?: boolean;
  ebook_price?: number;
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
  category: string | { id: number; name: string };
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
  tax?: number | string;
  final_total: number;
}

export interface ViewCartResponse {
  items: CartViewItem[];
  summary: CartSummary;
}

// Paginated responses
export interface BooksResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  results: Book[];
}

// Fetch all books
export const fetchBooksApi = async (params: { page?: number; limit?: number; search?: string; category?: string; archived?: boolean } = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search); // Adjust if backend uses 'q' or 'title'
  if (params.category) query.append("category_id", params.category);
  if (params.archived !== undefined) query.append("archived", String(params.archived));
  // Based on user provided URL, standard list is /admin/books/list, but params might be query strings
  // User wrote: GET /admin/books?archived=true
  // If the base list endpoint is /admin/books/list, appending ?archived=true might work if backend supports it there.
  // OR the endpoint changes to /admin/books when query params are involved?
  // Let's assume /admin/books/list accepts it or falls back to /admin/books if that was the implication.
  // The user said: GET http://localhost:8000/admin/books/list AND GET /admin/books?archived=true
  // This is contradictory. Usually 'list' is a specific view.
  // I will try to use the query param on the existing endpoint first, but if the user meant two different endpoints, I'll stick to the one I have (list) and append param.
  // However, looking closely at "GET /admin/books?archived=true", it's missing '/list'. 
  // But let's verify standard REST. often /admin/books is the resource collection.
  // Existing code uses /admin/books/list. I will keep using it but add the param. 
  // If it fails, I might need to switch to /admin/books. 
  // Actually, looking at deleteBookApi it is /admin/books/${id}. 
  // It's safer to stick to the existing accepted endpoint for listing.
  
  return request<BooksResponse>(`/admin/books/list?${query.toString()}`);
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

// Archive a book
export const archiveBookApi = async (id: number) => {
  return request<{ message: string }>(`/admin/books/${id}/archive`, {
    method: "DELETE",
  });
};

// Restore a book
export const restoreBookApi = async (id: number) => {
  return request<{ message: string }>(`/admin/books/${id}/restore`, {
    method: "DELETE",
  });
};

// Cart APIs

// Add an item to the cart
export const addToCartApi = async (book_id: number, quantity: number) => {
  return request<{ message: string; item: CartItem }>("/cart/add", {
    method: "POST",
    body: JSON.stringify({
      items: [
        {
          book_id,
          quantity,
        },
      ],
    }),
  });
};

export interface CartDetailsItem {
  item_id?: number;
  book_id: number;
  book_name?: string;
  book_title?: string;
  slug?: string;
  price: number;
  cover_image?: string;
  cover_image_url: string;
  quantity: number;
  stock?: number;
  in_stock?: boolean;
  total: number;
  discount_price?: number | null;
  offer_price?: number | null;
  effective_price?: number;
}

export interface CartDetailsResponse {
  items: CartDetailsItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number | string;
    final_total: number;
  };
}

// View the cart
export const viewCartApi = async () => {
  return request<CartDetailsResponse>("/cart/");
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
  
  return request<FilterResponse>(`/books/filter?${query.toString()}`);
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
  if (params.category_id) query.append("category_id", String(params.category_id));
  if (params.author) query.append("author", params.author);
  if (params.price_min !== undefined)
    query.append("min_price", String(params.price_min));
  if (params.price_max !== undefined)
    query.append("max_price", String(params.price_max));
  if (params.rating_min !== undefined)
    query.append("rating", String(params.rating_min));

  return request<FilterResponse>(`/books/filter?${query.toString()}`);
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
export interface DynamicSearchResponse {
  query: string;
  total_results: number;
  page: number;
  total_pages: number;
  results: Book[];
}

export const fetchDynamicSearchBooksApi = async (query: string) => {
  return request<DynamicSearchResponse>(`/books/dynamic-search?query=${query}`);
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
  category_id?: number;
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

// --- Book Image Management APIs ---

export interface BookImage {
  image_id: number;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface AddBookImagesResponse {
  message: string;
  images: BookImage[];
}

export interface ListBookImagesResponse {
  book_id: number;
  images: BookImage[];
}

export const addBookImagesApi = async (bookId: number, formData: FormData) => {
  // logic to handle multiple 'images' keys in formData is automatically handled by passing FormData body
  return request<AddBookImagesResponse>(`/admin/books/${bookId}/add-images`, {
    method: "POST",
    body: formData,
  });
};

export const removeBookImageApi = async (imageId: number) => {
  return request<{ message: string }>(`/admin/books/images/${imageId}`, {
    method: "DELETE",
  });
};

export const listBookImagesApi = async (bookId: number) => {
  return request<ListBookImagesResponse>(`/admin/books/${bookId}/list-images`);
};

export const reorderBookImagesApi = async (bookId: number, order: number[]) => {
  return request<{ message: string }>(`/admin/books/${bookId}/images/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ order }),
  });
};


