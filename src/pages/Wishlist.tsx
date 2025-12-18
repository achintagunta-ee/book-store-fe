import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider, { type Settings } from "react-slick";
import {
  getWishlistThunk,
  removeFromWishlistThunk,
} from "../redux/slice/authSlice";
import { addToCartAsync } from "../redux/slice/cartSlice";
import { Toaster, toast } from "react-hot-toast";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

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
          className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-t-lg"
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
          ${book.price.toFixed(2)}
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

// --- Empty State Sub-Component ---
const EmptyWishlist: React.FC = () => {
  return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-6xl text-secondary-link/50">
        favorite
      </span>
      <h2 className="font-display text-2xl font-bold mt-4">
        Your wishlist is empty
      </h2>
      <p className="mt-2 text-secondary-link">
        Explore our collection and find your next great read!
      </p>
      <Link to="/books">
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

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlistThunk(parseInt(id)));
  };

  const handleAddToCart = (id: string) => {
    dispatch(addToCartAsync({ bookId: parseInt(id), quantity: 1 }));
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

  // Settings for the Slick Carousel
  const sliderSettings: Settings = {
    dots: true,
    // MODIFIED: Changed from 5 to 4
    infinite: books.length > 4, // Only loop if there are more slides than visible
    speed: 500,
    // MODIFIED: Changed from 5 to 4
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          // MODIFIED: Changed from 5 to 4
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 4, // This breakpoint already showed 4
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 py-10">
      <Toaster position="top-right" />
      <div className="flex flex-wrap justify-between items-center gap-4 pb-8">
        <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-text-main dark:text-text-main-dark">
          My Wishlist
        </h1>
      </div>

      {books.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <Slider {...sliderSettings}>
          {books.map((book) => (
            <div key={book.id} className="py-2 px-4">
              <BookCard
                book={book}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </Slider>
      )}
    </main>
  );
};

export default WishlistPage;
