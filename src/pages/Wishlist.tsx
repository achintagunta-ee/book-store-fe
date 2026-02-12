import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getWishlistThunk,
  removeFromWishlistThunk,
} from "../redux/slice/authSlice";

import { Toaster, toast } from "react-hot-toast";

import BookCard from "../components/BookCard";

// --- Type Definition ---
interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
}

import { MdFavoriteBorder } from "react-icons/md";

// --- Empty State Sub-Component ---
const EmptyWishlist: React.FC = () => {
  return (
    <div className="text-center py-20 flex flex-col items-center">
      <MdFavoriteBorder className="text-6xl text-yellow-300" />
      <h2 className="font-display text-2xl font-bold mt-4">
        Your wishlist is empty
      </h2>
      <p className="mt-2 text-secondary-link">
        Explore our collection and find your next great read!
      </p>
      <Link to="/">
        <button className="mt-6 flex mx-auto items-center justify-center rounded-lg h-12 px-6 bg-primary text-white font-body text-base font-semibold tracking-wide hover:bg-primary/90 transition-colors">
          Go to Shop
        </button>
      </Link>
    </div>
  );
};

// --- Main Wishlist Page Component ---
const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { wishlist } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(getWishlistThunk());
  }, [dispatch]);

  const handleRemove = async (id: number) => {
    try {
      await dispatch(removeFromWishlistThunk(id)).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };



  const books: Book[] = (wishlist || []).map((item: any) => ({
    id: item.book_id || item.id,
    slug: item.slug,
    title: item.title,
    author: item.author,
    price: item.price,
    imageUrl: item.cover_image_url || "",
  }));



  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 py-10">
      <Toaster position="top-right" />
      <div className="flex flex-wrap justify-between items-center gap-4 pb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-text-main-dark">
          My Wishlist
        </h1>
      </div>

      {books.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              imageUrl={book.imageUrl}
              slug={book.slug}
              price={book.price}
              onRemove={handleRemove}
              originalBook={book}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
