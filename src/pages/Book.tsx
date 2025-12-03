import React, { useState, useMemo, useEffect } from "react";

// --- Icon Imports ---
import {
  ChevronDown,
  Star,
  Filter,
  X,
  ChevronRight,
  ChevronLeft, // Added ChevronLeft for pagination
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicBooksAsync,
  fetchPublicCategoriesAsync,
} from "../redux/slice/bookSlice";
import { type RootState, type AppDispatch } from "../redux/store/store";
import { type Book as ApiBook, type Category } from "../redux/utilis/bookApi";

// --- Types ---
type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  rating: number; // 1 to 5
  imageUrl: string;
};

type Filters = {
  categories: string[];
  authors: string[];
  maxPrice: number;
  minRating: number;
};

// --- Constants ---
const BOOKS_PER_PAGE = 8;

// --- Placeholder Components (to be implemented or imported) ---

const BookCard: React.FC<{ book: Book }> = ({ book }) => (
  <div className="group relative">
    <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-200">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="h-full w-full object-cover object-center group-hover:opacity-75"
      />
    </div>
    <div className="mt-4 flex justify-between">
      <div>
        <h3 className="text-md font-medium text-gray-900">
          <Link to={`/book/${book.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{book.author}</p>
        <p className="text-sm font-medium text-secondary-link">${book.price}</p>
      </div>
    </div>
  </div>
);

// --- START OF UPDATED DUMMY LAYOUT ---
const Sidebar: React.FC<{
  onApplyFilters: (filters: Filters) => void;
  initialFilters: Filters;
  categories: Category[];
  authors: string[];
  maxPrice: number;
}> = ({ onApplyFilters, initialFilters, categories, authors, maxPrice }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleCategoryChange = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter((c) => c !== category)
      : [...localFilters.categories, category];
    setLocalFilters({ ...localFilters, categories: newCategories });
  };

  const handleAuthorChange = (author: string) => {
    const newAuthors = localFilters.authors.includes(author)
      ? localFilters.authors.filter((a) => a !== author)
      : [...localFilters.authors, author];
    setLocalFilters({ ...localFilters, authors: newAuthors });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) });
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters({
      ...localFilters,
      minRating: localFilters.minRating === rating ? 0 : rating,
    });
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Category */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center">
              <input
                id={`cat-${cat.id}`}
                type="checkbox"
                checked={localFilters.categories.includes(cat.name)}
                onChange={() => handleCategoryChange(cat.name)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`cat-${cat.id}`} className="ml-3 text-gray-700">
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Price</h3>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={localFilters.maxPrice}
          onChange={handlePriceChange}
          className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>$0</span>
          <span>${localFilters.maxPrice}</span>
        </div>
      </div>

      {/* Author */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Author</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {authors.map((author) => (
            <div key={author} className="flex items-center">
              <input
                id={`auth-${author}`}
                type="checkbox"
                checked={localFilters.authors.includes(author)}
                onChange={() => handleAuthorChange(author)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`auth-${author}`} className="ml-3 text-gray-700">
                {author}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Rating</h3>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`cursor-pointer ${
                star <= localFilters.minRating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              onClick={() => handleRatingChange(star)}
            />
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => onApplyFilters(localFilters)}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = () => (
  // We ignore the props for this dummy layout to match the image
  <nav
    className="flex items-center justify-center space-x-4 py-8"
    aria-label="Pagination"
  >
    <button className="text-gray-500 hover:text-gray-700">
      <span className="sr-only">Previous</span>
      <ChevronLeft size={20} />
    </button>

    <button
      className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/20 text-primary-700 font-medium"
      aria-current="page"
    >
      1
    </button>
    <button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
      2
    </button>
    <button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
      3
    </button>
    <span className="flex items-end justify-center h-10 w-10 text-gray-500">
      ...
    </span>
    <button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
      10
    </button>

    <button className="text-gray-500 hover:text-gray-700">
      <span className="sr-only">Next</span>
      <ChevronRight size={20} />
    </button>
  </nav>
);
// --- END OF UPDATED DUMMY LAYOUT ---

// --- Main Page Component ---
// Renamed BookListingPage to App and made it the default export
const BookPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    publicBooks,
    publicBooksStatus,
    publicBooksError,
    publicCategories,
    publicCategoriesStatus,
  } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (publicBooksStatus === "idle") {
      dispatch(fetchPublicBooksAsync());
    }
    if (publicCategoriesStatus === "idle") {
      dispatch(fetchPublicCategoriesAsync());
    }
  }, [publicBooksStatus, publicCategoriesStatus, dispatch]);

  const allBooksData: Book[] = useMemo(() => {
    const categoryMap = new Map<number, string>();
    publicCategories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
    });

    if (!Array.isArray(publicBooks)) return [];

    return publicBooks.map((book: ApiBook) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      category: categoryMap.get(book.category_id) || "Uncategorized",
      rating: book.rating || 0,
      imageUrl: book.cover_image
        ? `${import.meta.env.VITE_API_BASE_URL}/${book.cover_image}`
        : "https://via.placeholder.com/400x600.png?text=No+Image",
    }));
  }, [publicBooks, publicCategories]);

  const MAX_PRICE = useMemo(
    () =>
      Math.ceil(
        allBooksData.reduce(
          (max, book) => (book.price > max ? book.price : max),
          0
        )
      ),
    [allBooksData]
  );

  const allAuthors = useMemo(
    () => [...new Set(allBooksData.map((book) => book.author))],
    [allBooksData]
  );

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    authors: [],
    maxPrice: MAX_PRICE,
    minRating: 0,
  });
  const [sortOrder, setSortOrder] = useState("Relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Memoized filtering and sorting logic
  const filteredBooks = useMemo(() => {
    let books = allBooksData.filter((book) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(book.category);
      const authorMatch =
        filters.authors.length === 0 || filters.authors.includes(book.author);
      const priceMatch = book.price <= filters.maxPrice;
      const ratingMatch = book.rating >= filters.minRating;
      return categoryMatch && authorMatch && priceMatch && ratingMatch;
    });

    // Sorting logic
    books.sort((a, b) => {
      switch (sortOrder) {
        case "Price: Low to High":
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        case "Rating":
          return b.rating - a.rating;
        default: // "Relevance" (or default)
          return a.id - b.id; // Simple sort by ID for relevance
      }
    });

    return books;
  }, [filters, sortOrder, allBooksData]);

  // Memoized pagination logic
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    if (newFilters.maxPrice !== filters.maxPrice) setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
    setIsMobileFilterOpen(false); // Close mobile drawer
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilters((prev) => ({ ...prev, maxPrice: MAX_PRICE }));
  }, [MAX_PRICE]);

  if (publicBooksStatus === "loading" || publicCategoriesStatus === "loading") {
    return <div className="text-center py-20">Loading books...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow">
        <main className="py-8">
          {/* Mobile Filter Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex">
            {/* --- Desktop Sidebar --- */}
            <aside className="hidden lg:block w-1/4 xl:w-1/5 pr-8">
              <h2 className="text-2xl font-semibold mb-4">Filters</h2>
              <Sidebar
                onApplyFilters={handleApplyFilters}
                initialFilters={filters}
                categories={publicCategories}
                authors={allAuthors}
                maxPrice={MAX_PRICE}
              />
            </aside>

            {/* --- Mobile Filter Drawer --- */}
            {isMobileFilterOpen && (
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
                onClick={() => setIsMobileFilterOpen(false)}
              ></div>
            )}
            <div
              className={`fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform ${
                isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
              } lg:hidden`}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-semibold">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
                <Sidebar
                  onApplyFilters={handleApplyFilters}
                  initialFilters={filters}
                  categories={publicCategories}
                  authors={allAuthors}
                  maxPrice={MAX_PRICE}
                />
              </div>
            </div>

            {/* --- Main Content: Sort + Grid --- */}
            <div className="w-full lg:w-3/4 xl:w-4/5 lg:pl-8">
              {/* Breadcrumbs & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                {/* Breadcrumbs */}
                <nav className="text-sm" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-gray-500">
                    <li>
                      <a href="#" className="hover:text-gray-700">
                        Home
                      </a>
                    </li>
                    <li>
                      <ChevronRight size={16} />
                    </li>
                    <li>
                      <a href="#" className="hover:text-gray-700">
                        Books
                      </a>
                    </li>
                    <li>
                      <ChevronRight size={16} />
                    </li>
                    <li>
                      <span className="font-medium text-gray-700">
                        {filters.categories.length === 1
                          ? filters.categories[0]
                          : "All"}
                      </span>
                    </li>
                  </ol>
                </nav>

                {/* Sort Dropdown */}
                <div className="relative w-full sm:w-auto sm:ml-auto">
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option>Sort by: Relevance</option>
                    <option>Sort by: Price: Low to High</option>
                    <option>Sort by: Price: High to Low</option>
                    <option>Sort by: Rating</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Book Grid */}
              {publicBooksError ? (
                <div className="text-center py-20 text-red-500">
                  <h3 className="text-2xl font-semibold">
                    Failed to load books
                  </h3>
                  <p className="mt-2">{publicBooksError}</p>
                </div>
              ) : paginatedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    No Books Found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookPage;
