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
  Bell,
  BookOpen,
  ChevronDown,
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
  fetchNotificationsThunk,
} from "../redux/slice/authSlice";
import { fetchCartAsync } from "../redux/slice/cartSlice";
import logo from "../assets/images/hita.png";

// Tooltip Component
const IconTooltip = ({ text }: { text: string }) => (
  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 dark:bg-gray-200 dark:text-gray-900 shadow-md">
    {text}
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800 dark:border-b-gray-200"></div>
  </div>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { accessToken, userProfile, profileStatus, wishlistCount, notifications } =
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

    dispatch(fetchCartAsync());

    // If we have a token, fetch the user's cart
    if (accessToken) {
      dispatch(getWishlistCountThunk());
      dispatch(fetchNotificationsThunk());
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
        <Link to="/" className="flex items-center gap-4 text-text-light hover:opacity-80 transition-opacity">
          <div className="size-16">
             <img src={logo} alt="Hithabodha Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-text-light ">
            Hithabodha Book Store
          </h2>
        </Link>

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
            <div className="relative flex h-full w-full flex-1 items-stretch rounded-full border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4 text-gray-500">
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
                className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-full border-none bg-transparent py-2 pl-12 pr-4 font-body text-base font-normal leading-normal text-text-light placeholder:text-gray-400 focus:outline-none dark:placeholder:text-gray-500 dark:text-white"
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

            <Link to="/notifications" className="relative group">
              <button className="flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
                <Bell
                  className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </button>
              {userProfile && notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notifications.length}
                </span>
              )}
              <IconTooltip text="Notifications" />
            </Link>
            <Link to="/wishlist" className="relative group">
              <button className="flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                <Heart
                  className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </button>
              {userProfile && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
              <IconTooltip text="Wishlist" />
            </Link>
            <Link to="/cart" className="relative group">
              <button className="flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40">
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
              <IconTooltip text="Cart" />
            </Link>
            {userProfile ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="group flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 hover:bg-gray-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800 transition-all hover:border-gray-300 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {/* Use avatar if available, else initials */}
                     {/* {userProfile.avatar ? <img ... /> : ... } */}
                     <User className="h-5 w-5" />
                  </div>
                  <div className="hidden lg:flex flex-col items-start text-left">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                       {userProfile.first_name}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
                       {userProfile.role}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden border border-gray-100 dark:border-gray-800 animation-fade-in-down">
                    <div className="bg-primary/5 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{`${userProfile.first_name} ${userProfile.last_name}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        @{userProfile.username}
                      </p>
                    </div>
                    
                    <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-3"
                          role="menuitem"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/library"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-3"
                          role="menuitem"
                        >
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          My Library
                        </Link>
                    </div>

                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors gap-3"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                  <User className="h-4 w-4" strokeWidth={2} />
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
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4">
                <div className="size-16">
                   <img src={logo} alt="Hithabodha Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Menu
                </h2>
              </Link>
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
                {userProfile && wishlistCount > 0 && (
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
                   <Link
                    to="/library"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40"
                  >
                    <BookOpen className="h-6 w-6" strokeWidth={1.5} />
                    <span>My Library</span>
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
