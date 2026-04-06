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

import Slider from "react-slick";

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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <main className="flex-1 px-4 sm:px-6 md:px-10 py-10">
      <Toaster position="top-right" />
      <div className="flex flex-wrap justify-between items-center gap-4 pb-12">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#261d1a] dark:text-gray-100">
          My Wishlist
        </h1>
      </div>

      {books.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="wishlist-slider-container pb-12">
          <Slider {...sliderSettings}>
            {books.map((book) => (
              <div key={book.id} className="px-3">
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  imageUrl={book.imageUrl}
                  slug={book.slug}
                  price={book.price}
                  onRemove={handleRemove}
                  originalBook={book}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </main>
  );
};

export default WishlistPage;
