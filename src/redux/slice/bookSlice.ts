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
  fetchCategoryByIdApi,
  searchBookInCategoryByNameApi,
  filterBooksApi,
  fetchFeaturedBooksApi,
  fetchFeaturedAuthorsBooksApi,
  searchBooksApi,
  searchCategoryByNameApi,
  type Book,
  type Category,
  type CreateCategoryData,
  type UpdateCategoryData,
  type FilterParams,
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
  async () => {
    const response = (await fetchPublicBooksApi()) as any;
    return response.books;
  }
);

export const fetchBookByIdAsync = createAsyncThunk(
  "books/fetchBookById",
  async (id: number) => {
    const response = await fetchBookByIdApi(id);
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
    const response = await fetchFeaturedBooksApi();
    return response;
  }
);

export const fetchFeaturedAuthorsBooksAsync = createAsyncThunk(
  "books/fetchFeaturedAuthorsBooks",
  async () => {
    const response = await fetchFeaturedAuthorsBooksApi();
    return response;
  }
);

export const searchBooksAsync = createAsyncThunk(
  "books/searchBooks",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = (await searchBooksApi(query)) as any;
      return response.results; // Extract the 'results' array from the response
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
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
        state.publicBooks = action.payload;
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
      .addCase(fetchFeaturedBooksAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
      })
      .addCase(fetchFeaturedAuthorsBooksAsync.fulfilled, (state, action) => {
        state.publicBooks = action.payload;
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
      .addCase(fetchBookByIdAsync.fulfilled, (state, action) => {
        // Not sure what to do here, maybe a new state for single book?
        // For now, let's just push it to the publicBooks array
        const index = state.publicBooks.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index === -1) {
          state.publicBooks.push(action.payload);
        }
      });
  },
});

export default bookSlice.reducer;
