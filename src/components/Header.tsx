import React, { useState, useEffect, useRef, useMemo } from "react";
// Using lucide-react icons as in your provided code
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { type AppDispatch, type RootState } from "../redux/store/store";
import { fetchDynamicSearchBooksAsync, fetchSearchSuggestionsAsync } from "../redux/slice/bookSlice";
import {
  getCurrentUserThunk,
  logout,
  logoutThunk,
  getWishlistCountThunk,
} from "../redux/slice/authSlice";
import { fetchCartAsync } from "../redux/slice/cartSlice";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { accessToken, userProfile, profileStatus, wishlistCount } =
    useSelector((state: RootState) => state.auth);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { searchSuggestions } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
         dispatch(fetchSearchSuggestionsAsync(searchQuery.trim()));
      }
      // If empty, we could clear suggestions, but keeping previous ones or empty state is fine.
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dispatch]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    // If we have a token but no user profile, try to fetch it
    if (accessToken && !userProfile && profileStatus === "idle") {
      dispatch(getCurrentUserThunk());
    }

    // If we have a token, fetch the user's cart
    if (accessToken) {
      dispatch(fetchCartAsync());
      dispatch(getWishlistCountThunk());
    }
  }, [accessToken, userProfile, profileStatus, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(fetchDynamicSearchBooksAsync(searchQuery.trim()));
      // Navigate to the book list page to show results
      navigate("/books");
      // Close mobile menu if it's open after searching
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutThunk()); // Dispatch the thunk to call the API
    dispatch(logout()); // Also dispatch the local reducer for immediate UI update
    setIsProfileMenuOpen(false);
    navigate("/"); // Redirect to home page after logout
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo and Store Name */}
        <div className="flex items-center gap-4 text-text-light ">
          <div className="size-6 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-text-light ">
            Hithabodha Book Store
          </h2>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/track-order"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Track order
          </Link>
          <Link
            to="/about"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Desktop Search Bar and Icons */}
        <div className="hidden md:flex items-center justify-end gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden !h-10 min-w-40 max-w-64 flex-col sm:flex relative"
          >
            <div className="relative flex h-full w-full flex-1 items-stretch rounded-lg">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center rounded-l-lg border-r-0 border-none bg-primary/20 pl-4 text-text-light/70 /70">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search-desktop"
                value={searchQuery}
                onChange={(e) => {
                   setSearchQuery(e.target.value);
                   // Open suggestion box if not empty
                   if (e.target.value.trim().length > 0) {
                     // logic handled in effect
                   }
                }}
                className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-primary/20 py-2 pl-12 pr-4 font-body text-base font-normal leading-normal text-text-light placeholder:text-text-light/70 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:placeholder:text-text-main-dark/70"
                placeholder="Search"
                autoComplete="off"
              />
            </div>
            
            {/* Search Suggestions Dropdown */}
            {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto border border-gray-100 dark:border-gray-700">
                <ul>
                  {searchSuggestions.map((book) => (
                    <li key={book.id}>
                      <Link 
                        to={`/book/detail/${book.slug}`} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-700/50 last:border-none"
                        onClick={() => setSearchQuery("")} // Clear search on click? Or maybe keep it. Clearing for now as we navigate.
                      >
                         <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded overflow-hidden">
                           <img 
                             src={book.cover_image_url || "/placeholder.jpg"} 
                             alt={book.title} 
                             className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                             {/* Bolding match could be added here, but simple text for now */}
                             {book.title}
                           </span>
                           <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                             {book.author}
                           </span>
                         </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <div className="flex gap-2">
            <Link to="/wishlist" className="relative">
              <button className="group flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                <Heart
                  className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </button>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <button className="group flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
                <ShoppingCart
                  className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {userProfile ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="group flex h-auto cursor-pointer items-center overflow-hidden rounded-lg bg-primary/20 px-3 py-1.5 text-sm font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40"
                >
                  <User className="mr-2.5 h-6 w-6" strokeWidth={1.5} />
                  <div className="flex flex-col items-start text-left">
                    <span className="truncate text-sm font-semibold leading-tight">{`${userProfile.first_name} ${userProfile.last_name}`}</span>
                    <span className="text-xs font-normal capitalize text-text-light/80">
                      {userProfile.role}
                    </span>
                  </div>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
                    <div className="p-1">
                      <div className="px-3 py-2.5 border-b border-gray-200 mb-1">
                        <p className="font-semibold text-gray-800 truncate">{`${userProfile.first_name} ${userProfile.last_name}`}</p>
                        <p className="text-sm text-gray-500 truncate">
                          @{userProfile.username}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                        role="menuitem"
                      >
                        <User className="mr-3 h-5 w-5 text-gray-500" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="group flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
                  <User className="mr-2 h-5 w-5" strokeWidth={1.5} />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg p-2 text-text-light/90 /90"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white  text-text-light ">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between border-b border-solid border-primary/20 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="size-6 text-primary">
                {/* Re-using SVG logo */}
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path>
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Menu
              </h2>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg p-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Body */}
          <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="!h-10 w-full flex-col flex"
            >
              <div className="relative flex h-full w-full flex-1 items-stretch rounded-lg">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center rounded-l-lg border-r-0 border-none bg-primary/20 pl-4 text-text-light/70 /70">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search-mobile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-primary/20 py-2 pl-12 pr-4 font-body text-base font-normal leading-normal text-text-light placeholder:text-text-light/70 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:placeholder:text-text-main-dark/70"
                  placeholder="Search"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/track-order"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Track Order
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </nav>

            <hr className="border-primary/20" />

            {/* Mobile Icon Buttons */}
            <div className="flex flex-col gap-4">
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="relative"
              >
                <button className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                  <Heart className="h-6 w-6" strokeWidth={1.5} />
                  <span>Wishlist</span>
                </button>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="relative"
              >
                <button className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                  <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                  <span>Cart</span>
                </button>
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              {userProfile ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40"
                  >
                    <User className="h-6 w-6" strokeWidth={1.5} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-red-500/20 px-4 text-base font-bold text-red-500 transition-all duration-300 hover:bg-red-500/30"
                  >
                    <X className="h-6 w-6" strokeWidth={1.5} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40"
                >
                  <User className="h-6 w-6" strokeWidth={1.5} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
