import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getWishlistThunk,
  removeFromWishlistThunk,
} from "../redux/slice/authSlice";
import { addToCartAsync } from "../redux/slice/cartSlice";
import { Toaster, toast } from "react-hot-toast";

// --- Type Definition ---
interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
}

// --- Book Card Sub-Component ---
const BookCard: React.FC<{
  book: Book;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}> = ({ book, onRemove, onAddToCart }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-background-light  shadow-soft hover:shadow-lift transition-shadow duration-300 group">
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
          ₹{book.price.toFixed(2)}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => onAddToCart(book.id)}
            className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-body text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onRemove(book.id)}
            className="w-full flex items-center justify-center rounded-lg h-10 px-4 text-secondary-link font-body text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const handleRemove = async (id: string) => {
    try {
      await dispatch(removeFromWishlistThunk(parseInt(id))).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = (id: string) => {
    dispatch(addToCartAsync({ book_id: parseInt(id), quantity: 1 }));
    toast.success("Added to cart");
  };

  const books: Book[] = (wishlist || []).map((item: any) => ({
    id: item.book_id.toString(),
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
              book={book}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
