import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchBooksApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  fetchPublicBooksApi,
  fetchBookByIdApi,
  fetchBooksByCategoryIdPublicApi,
  fetchBooksByCategoryIdApi,
  fetchBooksByCategoryNameApi,
  fetchPublicCategoriesApi,
  fetchBookBySlugApi,
  fetchCategoryByIdApi,
  searchBookInCategoryByNameApi,
  filterBooksApi,
  fetchFeaturedBooksApi, // This seems unused now with the new search API
  fetchFeaturedAuthorsBooksApi,
  searchCategoryByNameApi,
  type Book,
  type Category,
  type CreateCategoryData,
  type UpdateCategoryData,
  type FilterParams,
  type CreateReviewData,
  updateReviewApi,
  type UpdateReviewData,
  createReviewApi,
  deleteReviewApi,
  type BookDetailResponse,
  advancedSearchBooksApi,
  fetchHomeDataApi,
  type HomeBook,
  fetchDynamicSearchBooksApi,
} from "../utilis/bookApi";

export interface BookState {
  books: Book[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  categories: Category[];
  categoryStatus: "idle" | "loading" | "succeeded" | "failed";
  categoryError: string | null | undefined;
  publicBooks: Book[];
  publicBooksStatus: "idle" | "loading" | "succeeded" | "failed";
  publicBooksError: string | null | undefined;
  publicCategories: Category[];
  publicCategoriesStatus: "idle" | "loading" | "succeeded" | "failed";
  publicCategoriesError: string | null | undefined;
  featuredBooks: Book[];
  featuredBooksStatus: "idle" | "loading" | "succeeded" | "failed";
  featuredAuthorsBooks: Book[];
  featuredAuthorsBooksStatus: "idle" | "loading" | "succeeded" | "failed";
  newArrivals: Book[];
  popularBooks: Book[];
  homeDataStatus: "idle" | "loading" | "succeeded" | "failed";
  currentBook: BookDetailResponse | null;
  currentBookStatus: "idle" | "loading" | "succeeded" | "failed";
  currentBookError: string | null | undefined;
  searchSuggestions: Book[];
  searchSuggestionsStatus: "idle" | "loading" | "succeeded" | "failed";
  totalBooks: number;
}

const initialState: BookState = {
  books: [],
  status: "idle",
  error: null,
  categories: [],
  categoryStatus: "idle",
  categoryError: null,
  publicBooks: [],
  publicBooksStatus: "idle",
  publicBooksError: null,
  publicCategories: [],
  publicCategoriesStatus: "idle",
  publicCategoriesError: null,
  featuredBooks: [],
  featuredBooksStatus: "idle",
  featuredAuthorsBooks: [],
  featuredAuthorsBooksStatus: "idle",
  newArrivals: [],
  popularBooks: [],
  homeDataStatus: "idle",
  currentBook: null,
  currentBookStatus: "idle",
  currentBookError: null,
  searchSuggestions: [],
  searchSuggestionsStatus: "idle",
  totalBooks: 0,
};

// Admin Thunks
export const fetchBooksAsync = createAsyncThunk(
  "books/fetchBooks",
  async () => {
    const response = await fetchBooksApi();
    return response;
  }
);

export const createBookAsync = createAsyncThunk(
  "books/createBook",
  async (bookData: FormData) => {
    const response = await createBookApi(bookData);
    return response;
  }
);

export const updateBookAsync = createAsyncThunk(
  "books/updateBook",
  async ({ id, data }: { id: number; data: FormData }) => {
    const response = await updateBookApi(id, data);
    return response;
  }
);

export const deleteBookAsync = createAsyncThunk(
  "books/deleteBook",
  async (id: number) => {
    await deleteBookApi(id);
    return id;
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  "books/fetchCategories",
  async () => {
    const response = await fetchCategoriesApi();
    return response;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "books/createCategory",
  async (categoryData: CreateCategoryData) => {
    const response = await createCategoryApi(categoryData);
    return response;
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "books/updateCategory",
  async ({ id, data }: { id: number; data: UpdateCategoryData }) => {
    const response = await updateCategoryApi(id, data);
    return response;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "books/deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Public Thunks
export const fetchPublicBooksAsync = createAsyncThunk(
  "books/fetchPublicBooks",
  async (params: FilterParams = {}) => {
    const response = await fetchPublicBooksApi(params);
    return response;
  }
);

export const fetchBookByIdAsync = createAsyncThunk(
  "books/fetchBookById",
  async (id: number) => {
    const response = await fetchBookByIdApi(id);
    return response;
  }
);

export const fetchBookBySlugAsync = createAsyncThunk(
  "books/fetchBookBySlug",
  async (slug: string) => {
    const response = await fetchBookBySlugApi(slug);
    return response;
  }
);

export const fetchBooksByCategoryIdAsync = createAsyncThunk(
  "books/fetchBooksByCategoryId",
  async (categoryId: number) => {
    const response = await fetchBooksByCategoryIdApi(categoryId);
    return response;
  }
);

export const fetchBooksByCategoryIdPublicAsync = createAsyncThunk(
  "books/fetchBooksByCategoryIdPublic",
  async (categoryId: number) => {
    const response = await fetchBooksByCategoryIdPublicApi(categoryId);
    return response;
  }
);

export const fetchBooksByCategoryNameAsync = createAsyncThunk(
  "books/fetchBooksByCategoryName",
  async (categoryName: string) => {
    const response = await fetchBooksByCategoryNameApi(categoryName);
    return response;
  }
);

export const searchBookInCategoryByNameAsync = createAsyncThunk(
  "books/searchBookByNameAndCategory",
  async ({
    categoryName,
    bookName,
  }: {
    categoryName: string;
    bookName: string;
  }) => {
    const response = await searchBookInCategoryByNameApi(
      categoryName,
      bookName
    );
    return response;
  }
);

export const fetchPublicCategoriesAsync = createAsyncThunk(
  "books/fetchPublicCategories",
  async () => {
    const response = (await fetchPublicCategoriesApi()) as any;
    return response.categories;
  }
);

export const fetchCategoryByIdAsync = createAsyncThunk(
  "books/fetchCategoryById",
  async (id: number) => {
    const response = await fetchCategoryByIdApi(id);
    return response;
  }
);

export const searchCategoryByNameAsync = createAsyncThunk(
  "books/searchCategoryByName",
  async (name: string) => {
    const response = await searchCategoryByNameApi(name);
    return response;
  }
);

export const filterBooksAsync = createAsyncThunk(
  "books/filterBooks",
  async (params: FilterParams) => {
    const response = await filterBooksApi(params);
    return response;
  }
);

export const fetchFeaturedBooksAsync = createAsyncThunk(
  "books/fetchFeaturedBooks",
  async () => {
    const response = (await fetchFeaturedBooksApi()) as any;
    return response.featured_books;
  }
);

export const fetchFeaturedAuthorsBooksAsync = createAsyncThunk(
  "books/fetchFeaturedAuthorsBooks",
  async () => {
    const response = (await fetchFeaturedAuthorsBooksApi()) as any;
    return response.authors;
  }
);

export const searchBooksAsync = createAsyncThunk(
  "books/searchBooks",
  async (params: FilterParams, { rejectWithValue }) => {
    try {
      const response = await advancedSearchBooksApi(params);
      return response.results; // Extract the 'results' array from the response
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDynamicSearchBooksAsync = createAsyncThunk(
  "books/fetchDynamicSearchBooks",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetchDynamicSearchBooksApi(query);
      // Map response to Book interface as the API returns book_id instead of id
      const mappedBooks: Book[] = (response as any[]).map((b) => ({
        id: b.book_id || b.id,
        title: b.title,
        slug: b.slug || b.title.toLowerCase().replace(/\s+/g, "-"),
        author: b.author,
        price: b.price,
        description: b.description || "",
        cover_image_url: b.cover_image_url,
        stock: b.stock || 0,
        category_id: b.category_id || 0,
        rating: b.rating,
        created_at: b.created_at || new Date().toISOString(),
        updated_at: b.updated_at || new Date().toISOString(),
        isbn: b.isbn || null,
        publisher: b.publisher || null,
        published_date: b.published_date || null,
      }));
      return mappedBooks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSearchSuggestionsAsync = createAsyncThunk(
  "books/fetchSearchSuggestions",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetchDynamicSearchBooksApi(query);
      const mappedBooks: Book[] = (response as any[]).map((b) => ({
        id: b.book_id || b.id,
        title: b.title,
        slug: b.slug || b.title.toLowerCase().replace(/\s+/g, "-"),
        author: b.author,
        price: b.price,
        description: b.description || "",
        cover_image_url: b.cover_image_url,
        stock: b.stock || 0,
        category_id: b.category_id || 0,
        rating: b.rating,
        created_at: b.created_at || new Date().toISOString(),
        updated_at: b.updated_at || new Date().toISOString(),
        isbn: b.isbn || null,
        publisher: b.publisher || null,
        published_date: b.published_date || null,
      }));
      return mappedBooks;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createReviewAsync = createAsyncThunk(
  "reviews/createReview",
  async (
    { slug, reviewData }: { slug: string; reviewData: CreateReviewData },
    { rejectWithValue }
  ) => {
    try {
      const response = await createReviewApi(slug, reviewData);
      return response.review;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateReviewAsync = createAsyncThunk(
  "reviews/updateReview",
  async (
    { reviewId, reviewData }: { reviewId: number; reviewData: UpdateReviewData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateReviewApi(reviewId, reviewData);
      return response.review;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId: number, { rejectWithValue }) => {
    try {
      await deleteReviewApi(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHomeDataAsync = createAsyncThunk(
  "books/fetchHomeData",
  async () => {
    const response = await fetchHomeDataApi();
    const mapBook = (b: HomeBook): Book => ({
      id: b.book_id,
      title: b.title,
      slug: b.title.toLowerCase().replace(/\s+/g, "-"),
      author: b.author,
      price: b.price,
      description: "",
      cover_image_url: b.cover_image_url,
      stock: 0,
      category_id: 0,
      rating: b.rating,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isbn: null,
      publisher: null,
      published_date: null,
    });

    return {
      featured_books: response.featured_books.map(mapBook),
      featured_authors_books: response.featured_authors_books.map(mapBook),
      new_arrivals: response.new_arrivals.map(mapBook),
      popular_books: response.popular_books.map(mapBook),
      categories: response.categories,
    };
  }
);

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin reducers
      .addCase(fetchBooksAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooksAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(fetchBooksAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBookAsync.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBookAsync.fulfilled, (state, action) => {
        const index = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBookAsync.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.categoryStatus = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.categoryError = action.error.message;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      // Public reducers
      .addCase(fetchPublicBooksAsync.pending, (state) => {
        state.publicBooksStatus = "loading";
      })
      .addCase(fetchPublicBooksAsync.fulfilled, (state, action) => {
        state.publicBooksStatus = "succeeded";
        state.publicBooks = action.payload.results;
        state.totalBooks = action.payload.total_items;
      })
      .addCase(fetchPublicBooksAsync.rejected, (state, action) => {
        state.publicBooksStatus = "failed";
        state.publicBooksError = action.error.message;
      })
      .addCase(fetchPublicCategoriesAsync.pending, (state) => {
        state.publicCategoriesStatus = "loading";
      })
      .addCase(fetchPublicCategoriesAsync.fulfilled, (state, action) => {
        state.publicCategoriesStatus = "succeeded";
        state.publicCategories = action.payload;
      })
      .addCase(fetchPublicCategoriesAsync.rejected, (state, action) => {
        state.publicCategoriesStatus = "failed";
        state.publicCategoriesError = action.error.message;
      })
      .addCase(fetchBooksByCategoryIdAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
      })
      .addCase(fetchBooksByCategoryIdPublicAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
      })
      .addCase(fetchBooksByCategoryNameAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
      })
      .addCase(searchBookInCategoryByNameAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
      })
      .addCase(filterBooksAsync.fulfilled, (state, action) => {
        state.publicBooksStatus = "succeeded";
        state.publicBooks = action.payload;
      })
      .addCase(fetchFeaturedBooksAsync.pending, (state) => {
        state.featuredBooksStatus = "loading";
      })
      .addCase(fetchFeaturedBooksAsync.fulfilled, (state, action) => {
        state.featuredBooksStatus = "succeeded";
        state.featuredBooks = action.payload;
      })
      .addCase(fetchFeaturedBooksAsync.rejected, (state) => {
        state.featuredBooksStatus = "failed";
      })
      .addCase(fetchFeaturedAuthorsBooksAsync.pending, (state) => {
        state.featuredAuthorsBooksStatus = "loading";
      })
      .addCase(fetchFeaturedAuthorsBooksAsync.fulfilled, (state, action) => {
        state.featuredAuthorsBooksStatus = "succeeded";
        state.featuredAuthorsBooks = action.payload;
      })
      .addCase(searchBooksAsync.pending, (state) => {
        state.publicBooksStatus = "loading";
      })
      .addCase(searchBooksAsync.fulfilled, (state, action) => {
        state.publicBooksStatus = "succeeded";
        state.publicBooks = action.payload;
      })
      .addCase(searchBooksAsync.rejected, (state, action) => {
        state.publicBooksStatus = "failed";
        state.publicBooksError = action.error.message;
      })
      .addCase(fetchDynamicSearchBooksAsync.pending, (state) => {
        state.publicBooksStatus = "loading";
      })
      .addCase(fetchDynamicSearchBooksAsync.fulfilled, (state, action) => {
        state.publicBooksStatus = "succeeded";
        state.publicBooks = action.payload;
      })
      .addCase(fetchDynamicSearchBooksAsync.rejected, (state, action) => {
        state.publicBooksStatus = "failed";
        state.publicBooksError = action.error.message;
      })
      .addCase(fetchSearchSuggestionsAsync.pending, (state) => {
        state.searchSuggestionsStatus = "loading";
      })
      .addCase(fetchSearchSuggestionsAsync.fulfilled, (state, action) => {
        state.searchSuggestionsStatus = "succeeded";
        state.searchSuggestions = action.payload;
      })
      .addCase(fetchSearchSuggestionsAsync.rejected, (state) => {
        state.searchSuggestionsStatus = "failed";
      })
      .addCase(fetchBookBySlugAsync.pending, (state) => {
        state.currentBookStatus = "loading";
        state.currentBook = null;
      })
      .addCase(fetchBookBySlugAsync.fulfilled, (state, action) => {
        state.currentBookStatus = "succeeded";
        state.currentBook = action.payload;
      })
      .addCase(fetchBookBySlugAsync.rejected, (state, action) => {
        state.currentBookStatus = "failed";
        state.currentBookError = action.error.message;
      })
      .addCase(fetchBookByIdAsync.fulfilled, (state, action) => {
        state.currentBookStatus = "succeeded";
        // This needs to be adapted if its response is different
        // For now, assuming it returns a partial structure
        state.currentBook = { book: action.payload } as BookDetailResponse;
      })
      // Review reducers
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        if (state.currentBook) {
          state.currentBook.reviews.unshift(action.payload);
          state.currentBook.total_reviews += 1;
        }
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        if (state.currentBook) {
          const reviewId = action.payload;
          const initialCount = state.currentBook.reviews.length;
          state.currentBook.reviews = state.currentBook.reviews.filter(
            (review) => review.id !== reviewId
          );
          if (state.currentBook.reviews.length < initialCount) {
            state.currentBook.total_reviews -= 1;
          }
        }
      })
      .addCase(updateReviewAsync.fulfilled, (state, action) => {
        if (state.currentBook) {
          const updatedReview = action.payload;
          const index = state.currentBook.reviews.findIndex(
            (review) => review.id === updatedReview.id
          );
          if (index !== -1) {
            state.currentBook.reviews[index] = updatedReview;
          }
        }
      })
      // Home Data reducers
      .addCase(fetchHomeDataAsync.pending, (state) => {
        state.homeDataStatus = "loading";
      })
      .addCase(fetchHomeDataAsync.fulfilled, (state, action) => {
        state.homeDataStatus = "succeeded";
        state.featuredBooks = action.payload.featured_books;
        state.featuredAuthorsBooks = action.payload.featured_authors_books;
        state.newArrivals = action.payload.new_arrivals;
        state.popularBooks = action.payload.popular_books;
        state.categories = action.payload.categories;
        // Also update individual statuses if we want to mimic individual fetches being "done"
        state.featuredBooksStatus = "succeeded";
        state.featuredAuthorsBooksStatus = "succeeded";
        state.categoryStatus = "succeeded";
      })
      .addCase(fetchHomeDataAsync.rejected, (state) => {
        state.homeDataStatus = "failed";
      });
  },
});


export default bookSlice.reducer;
