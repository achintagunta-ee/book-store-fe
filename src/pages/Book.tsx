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
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicBooksAsync,
  fetchPublicCategoriesAsync,
} from "../redux/slice/bookSlice";
import { addToCartAsync } from "../redux/slice/cartSlice";
import { Toaster, toast } from "react-hot-toast";
import { type RootState, type AppDispatch } from "../redux/store/store";
import { type Book as ApiBook, type Category } from "../redux/utilis/bookApi";

// --- Types ---
type Book = {
  id: number;
  slug: string;
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

const BookCard: React.FC<{ book: Book; onAddToCart: (id: number) => void }> = ({
  book,
  onAddToCart,
}) => (
  <div className="flex flex-col gap-4 rounded-lg bg-background-light shadow-soft hover:shadow-lift transition-shadow duration-300 group ">
    <Link to={`/book/detail/${book.slug}`}>
      <div
        className="w-full bg-center bg-no-repeat h-[250px] bg-cover rounded-t-lg"
        role="img"
        aria-label={`Book cover for ${book.title} by ${book.author}`}
        style={{ backgroundImage: `url("${book.imageUrl}")` }}
      ></div>
    </Link>
    <div className="p-4 pt-0 flex flex-col flex-grow">
      <Link to={`/book/detail/${book.slug}`}>
        <h3 className="font-display text-lg font-bold leading-tight text-text-main dark:text-text-main-dark hover:text-primary transition-colors">
          {book.title}
        </h3>
      </Link>
      <p className="font-body text-sm text-secondary-link">{book.author}</p>
      <p className="font-body text-base font-semibold text-text-main dark:text-text-main-dark mt-2">
        ₹{book.price}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => onAddToCart(book.id)}
          className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-body text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors"
        >
          Add to Cart
        </button>
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
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-xl font-bold font-display text-text-main dark:text-text-light mb-3">Category</h3>
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
              <label htmlFor={`cat-${cat.id}`} className="ml-3 text-text-main/80 dark:text-text-light/80 font-body">
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xl font-bold font-display text-text-main dark:text-text-light mb-3">Price</h3>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={localFilters.maxPrice}
          onChange={handlePriceChange}
          className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <div className="flex justify-between text-sm text-text-main/70 mt-2 font-body">
          <span>₹0</span>
          <span>₹{localFilters.maxPrice}</span>
        </div>
      </div>

      {/* Author */}
      <div>
        <h3 className="text-xl font-bold font-display text-text-main dark:text-text-light mb-3">Author</h3>
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
              <label htmlFor={`auth-${author}`} className="ml-3 text-text-main/80 dark:text-text-light/80 font-body">
                {author}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xl font-bold font-display text-text-main dark:text-text-light mb-3">Rating</h3>
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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 py-8"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-4 py-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] h-10 px-3 py-2 rounded-md font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-500"
      >
        <span className="sr-only">Next</span>
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};
// --- END OF UPDATED DUMMY LAYOUT ---

// --- Main Page Component ---
// Renamed BookListingPage to App and made it the default export
const BookPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    publicBooks,
    publicBooksStatus,
    publicBooksError,
    publicCategories,
    publicCategoriesStatus,
    totalBooks
  } = useSelector((state: RootState) => state.books);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    authors: [],
    maxPrice: 2000, // Default max price since we can't calculate from all books
    minRating: 0,
  });
  const [sortOrder, setSortOrder] = useState("Relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from URL search params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }));
    }
  }, [searchParams]);

  // Fetch Categories on mount
  useEffect(() => {
    if (publicCategoriesStatus === "idle") {
      dispatch(fetchPublicCategoriesAsync());
    }
  }, [publicCategoriesStatus, dispatch]);

  // Fetch Books whenever filters, sort, or page changes
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: BOOKS_PER_PAGE,
      sort: getSortParam(sortOrder),
    };

    if (filters.categories.length > 0) {
      params.category = filters.categories.join(",");
    }

    if (filters.authors.length > 0) {
      params.author = filters.authors.join(",");
    }

    if (filters.maxPrice < 2000) {
       params.price_max = filters.maxPrice;
    }

    if (filters.minRating > 0) {
      params.rating_min = filters.minRating;
    }

    dispatch(fetchPublicBooksAsync(params));
  }, [dispatch, filters, sortOrder, currentPage]);

  const getSortParam = (order: string) => {
    switch (order) {
      case "Price: Low to High":
        return "price_asc";
      case "Price: High to Low":
        return "price_desc";
      case "Rating":
        return "rating";
      default:
        return undefined;
    }
  };

  const allBooksData: Book[] = useMemo(() => {
     const categoryMap = new Map<number, string>();
     publicCategories.forEach((cat) => {
       categoryMap.set(cat.id, cat.name);
     });
 
     if (!Array.isArray(publicBooks)) return [];
 
     return publicBooks.map((book: ApiBook) => ({
       id: book.book_id || book.id,
       slug: book.slug,
       title: book.title,
       author: book.author,
       price: book.price,
       category: categoryMap.get(book.category_id) || "Uncategorized",
       rating: book.rating || 0,
       imageUrl: book.cover_image_url || "https://via.placeholder.com/400x600.png?text=No+Image",
     }));
   }, [publicBooks, publicCategories]);

  // Derive authors from current page (limitation of server-side pagination without facet API)
  const availableAuthors = useMemo(
    () => [...new Set(allBooksData.map((book) => book.author))],
    [allBooksData]
  );
  
  // Combine current page authors with selected authors to ensure selected ones don't disappear from sidebar
  const sidebarAuthors = useMemo(() => {
      return [...new Set([...availableAuthors, ...filters.authors])];
  }, [availableAuthors, filters.authors]);

  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
    setIsMobileFilterOpen(false); // Close mobile drawer
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (id: number) => {
    const book = allBooksData.find(b => b.id === id);
    dispatch(addToCartAsync({ book_id: id, quantity: 1, book }));
    toast.success("Added to cart");
  };

  if (publicBooksStatus === "loading" && currentPage === 1 && publicBooks.length === 0) {
     // Only show full loader on initial load or if we have no data
    return <div className="text-center py-20">Loading books...</div>;
  }
  // Note: We might want a loading overlay for subsequent page loads, but for now we just show existing data + maybe a spinner implies update? 
  // The UI doesn't have a loading state for the grid specifically in the design, so we leave as is or use status.

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow">
        <Toaster position="top-right" />
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
                authors={sidebarAuthors}
                maxPrice={2000}
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
                  authors={sidebarAuthors}
                  maxPrice={2000}
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
                    <option>Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
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
              ) : allBooksData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {allBooksData.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onAddToCart={handleAddToCart}
                    />
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
                  onPageChange={handlePageChange}
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
