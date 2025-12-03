import React, { useState } from "react";
// Using lucide-react icons as in your provided code
import { Heart, Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AppDispatch } from "../redux/store/store";
import { searchBooksAsync } from "../redux/slice/bookSlice";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchBooksAsync(searchQuery.trim()));
      // Navigate to the book list page to show results
      navigate("/books");
      // Close mobile menu if it's open after searching
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };
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
          <a
            href="#"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Categories
          </a>
          <a
            href="#"
            className="text-base font-medium text-text-light/90 /90 hover:text-primary dark:hover:text-primary transition-colors"
          >
            About Us
          </a>
        </nav>

        {/* Desktop Search Bar and Icons */}
        <div className="hidden md:flex items-center justify-end gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden !h-10 min-w-40 max-w-64 flex-col sm:flex"
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-none bg-primary/20 py-2 pl-12 pr-4 font-body text-base font-normal leading-normal text-text-light placeholder:text-text-light/70 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:placeholder:text-text-main-dark/70"
                placeholder="Search"
              />
            </div>
          </form>
          <div className="flex gap-2">
            <button className="group flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
              <Heart
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </button>
            <button className="group flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
              <ShoppingCart
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </button>
            <button className="group flex h-10 min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-2.5 text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
              <User
                className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </button>
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
              <a
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                About Us
              </a>
            </nav>

            <hr className="border-primary/20" />

            {/* Mobile Icon Buttons */}
            <div className="flex flex-col gap-4">
              <button className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                <Heart className="h-6 w-6" strokeWidth={1.5} />
                <span>Wishlist</span>
              </button>
              <button className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                <span>Cart</span>
              </button>
              <button className="group flex h-12 w-full min-w-0 cursor-pointer items-center justify-start gap-4 overflow-hidden rounded-lg bg-primary/20 px-4 text-base font-bold text-text-light transition-all duration-300 hover:bg-primary/30 dark:bg-primary/30  dark:hover:bg-primary/40">
                <User className="h-6 w-6" strokeWidth={1.5} />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
