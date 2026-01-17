import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store/store";
import {
  createReviewAsync,
  deleteReviewAsync,
  updateReviewAsync,
  fetchBookBySlugAsync,
} from "../redux/slice/bookSlice";
import { addToCartAsync } from "../redux/slice/cartSlice";
import {
  getWishlistThunk,
  addToWishlistThunk,
  removeFromWishlistThunk,
  checkWishlistStatusThunk,
  getAddressesThunk,
  purchaseEbookThunk,
  completeEbookPaymentThunk,
} from "../redux/slice/authSlice";

import {
  type Book,
  type CreateReviewData,
  type Review,
  type UpdateReviewData,
} from "../redux/utilis/bookApi";
import {
  MdStar,
  MdStarHalf,
  MdStarBorder,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";

const StarRating: React.FC<{ rating: number; className?: string }> = ({
  rating,
  className = "text-xl",
}) => (
  <div className="flex text-secondary-link">
    {[...Array(5)].map((_, i) => {
      const starValue = i + 1;
      if (starValue <= rating) {
        return <MdStar key={i} className={className} />;
      } else if (starValue - 0.5 === rating) {
        return <MdStarHalf key={i} className={className} />;
      }
      return <MdStarBorder key={i} className={className} />;
    })}
  </div>
);

const RelatedBookCard: React.FC<{ book: Book }> = ({ book }) => {
  const imageUrl = book.cover_image_url || "https://via.placeholder.com/400x600.png?text=No+Image";

  return (
    <div className="group relative">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={imageUrl}
          alt={book.title}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-text-light">
          <Link to={`/book/detail/${book.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {book.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-text-light/70">
          {book.author}
        </p>
        <p className="text-sm font-bold text-primary">
          ${book.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const ReviewForm: React.FC<{
  bookSlug: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}> = ({ bookSlug, onReviewSubmitted, onCancel }) => {
  const dispatch: AppDispatch = useDispatch();
  const { userProfile } = useSelector((state: RootState) => state.auth);
  const userName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) {
      setError("You must be logged in to leave a review.");
      return;
    }
    if (rating === 0 || !comment) {
      setError("Please provide a rating and a comment.");
      return;
    }
    setError("");

    const reviewData: CreateReviewData = {
      user_name: userName,
      rating,
      comment,
    };

    try {
      await dispatch(createReviewAsync({ slug: bookSlug, reviewData })).unwrap();
      // On success
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (err: any) {
      let errorMessage = err;
      try {
        if (typeof err === 'string') {
             if (err.startsWith('{')) {
                const parsed = JSON.parse(err);
                errorMessage = parsed.detail || parsed.message || err;
             } 
        }
      } catch (e) {
        // ignore parsing error
      }
      setError(errorMessage || "Failed to submit review");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-primary/10 p-6 md:p-8 transition-all duration-300">
      <h3 className="text-xl font-bold font-display text-text-main dark:text-text-light mb-6">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800/30 animate-pulse-once">
             <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
             </div>
             <p className="text-sm font-medium text-red-800 dark:text-red-200">
               {error}
             </p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold text-text-main/80 dark:text-text-light/80 mb-2">
            Your Rating
          </label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
              >
                 {star <= (hoverRating || rating) ? (
                    <MdStar className="text-3xl text-yellow-400 drop-shadow-sm" />
                 ) : (
                    <MdStarBorder className="text-3xl text-gray-300 dark:text-gray-600" />
                 )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-bold text-text-main/80 dark:text-text-light/80 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike?"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-4 text-text-main dark:text-text-light placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary px-6 py-3.5 text-white font-bold text-sm tracking-wide shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-3.5 text-text-main dark:text-text-light font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const dispatch: AppDispatch = useDispatch();
  const {
    currentBook,
    currentBookStatus: status,
    currentBookError: error,
  } = useSelector((state: RootState) => state.books);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { userProfile, addresses } = useSelector((state: RootState) => state.auth);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const currentUserName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : null;

  const {
    book: bookData,
    category: categoryName,
    reviews,
    total_reviews,
    average_rating,
    related_books,
  } = useMemo(
    () =>
      currentBook || {
        book: null,
        category: "",
        reviews: [],
        total_reviews: 0,
        average_rating: 0,
        related_books: [],
      },
    [currentBook]
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchBookBySlugAsync(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (userProfile) {
      dispatch(getWishlistThunk());
      dispatch(getAddressesThunk());
    }
  }, [dispatch, userProfile]);

  useEffect(() => {
    if (userProfile && bookData) {
      dispatch(checkWishlistStatusThunk(bookData.id))
        .unwrap()
        .then((res) => setIsInWishlist(res.in_wishlist))
        .catch(() => setIsInWishlist(false));
    }
  }, [dispatch, userProfile, bookData]);

  const handleWishlistToggle = async () => {
    if (!userProfile) {
      toast.error("Please login to manage wishlist");
      return;
    }
    if (!bookData) return;

    if (isInWishlist) {
      await dispatch(removeFromWishlistThunk(bookData.id));
      setIsInWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      await dispatch(addToWishlistThunk(bookData.id));
      setIsInWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    dispatch(deleteReviewAsync(reviewId));
  };

  const handleUpdateReview = () => {
    if (!editingReview) return;

    const reviewData: UpdateReviewData = {
      rating: editingReview.rating,
      comment: editingReview.comment,
    };

    dispatch(
      updateReviewAsync({ reviewId: editingReview.id, reviewData })
    ).finally(() => {
      setEditingReview(null);
    });
  };

  const handleBuyNow = async () => {
    if (!userProfile) {
      toast.error("Please login to buy books");
      return;
    }
    if (!bookData) return;

    // Use the first address available or ensure user has one
    const address = addresses && addresses.length > 0 ? addresses[0] : null;
    if (!address) {
      toast.error("Please add a shipping address in your profile first.");
      return;
    }
    
    if (!Razorpay) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    try {
      const token = localStorage.getItem("auth_access");
      // 1. Create Razorpay Order
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/book/buy-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: bookData.id,
          quantity: 1,
          address_id: address.id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to initiate Buy Now");
      }

      const data = await response.json();
      
      // 2. Open Razorpay
      const options: any = {
        key: data.razorpay_key,
        amount: data.amount * 100, // Convert to paise
        currency: data.currency || "INR",
        name: "Book Store",
        description: "Buy Now Payment",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
             try {
                 // 3. Verify Payment
                 const verifyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/book/buy-now/verify-payment`, {
                    method: "POST",
                     headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        order_id: data.order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    })
                 });
                 
                 if (!verifyRes.ok) {
                     const verifyErr = await verifyRes.json();
                     throw new Error(verifyErr.detail || "Payment verification failed");
                 }
                 
                 const verifyData = await verifyRes.json();
                 toast.success(verifyData.message || "Order placed successfully!");
                 navigate(`/order-confirmation/${data.order_id}`);

            } catch (err: any) {
                console.error("Verification Error", err);
                toast.error(err.message || "Payment verification failed");
            }
        },
        prefill: {
            name: `${userProfile.first_name} ${userProfile.last_name}`,
            email: userProfile.email,
        },
        theme: {
            color: "#3399cc",
        },
      };
      
      const rzp1 = new Razorpay(options);
      rzp1.open();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong processing your order.");
    }
  };

  const handleBuyEbook = async () => {
    if (!userProfile) {
      toast.error("Please login to buy books");
      return;
    }
    if (!bookData) return;

    try {
      // 1. Initiate Purchase
      const purchaseRes = await dispatch(purchaseEbookThunk(bookData.id)).unwrap();
      
      if (purchaseRes.status === "pending") {
         // 2. Complete Payment
         await dispatch(completeEbookPaymentThunk(purchaseRes.purchase_id)).unwrap();
         toast.success("E-book purchased successfully! Check your library.");
         // navigate("/library"); // Optional: redirect to library
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to purchase E-book");
    }
  };

  const handleAddToCart = () => {
    if (!bookData) return;
    dispatch(addToCartAsync({ bookId: bookData.id, quantity: 1, book: bookData }));
    toast.success(`${bookData.title} added to cart!`);
  };

  if (status === "loading") {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (status === "failed" || !bookData) {
    return (
      <div className="text-center p-10 text-red-500">
        Error: {error || "Book not found"}
      </div>
    );
  }
  return (
    <div className=" font-body text-text-main">
      <Toaster position="top-right" />
      <div className="flex h-auto min-h-screen w-full flex-col">
        <main className="flex-grow px-4 py-5 sm:px-8 md:px-20 lg:px-40">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 p-4">
            <a
              className="text-sm font-medium leading-normal text-primary/80 hover:text-primary dark:text-text-light/60"
              href="#"
            >
              Home
            </a>
            <span className="text-sm font-medium leading-normal text-primary/80 dark:text-text-light/60">
              /
            </span>
            <a
              className="text-sm font-medium leading-normal text-primary/80 hover:text-primary dark:text-text-light/60"
              href="#"
            >
              {categoryName}
            </a>
            <span className="text-sm font-medium leading-normal text-primary/80 dark:text-text-light/60">
              /
            </span>
            <span className="text-sm font-medium leading-normal text-text-main dark:text-text-light">
              {bookData.title}
            </span>
          </div>

          {/* Main Product Section */}
          <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-5">
            <div className="md:col-span-2 flex justify-center items-start">
              <img
                src={
                  bookData.cover_image_url ||
                  "https://via.placeholder.com/400x600.png?text=No+Image"
                }
                alt={`The cover of the book ${bookData.title}`}
                className="h-[450px] w-auto max-w-full rounded-xl shadow-lg object-contain bg-gray-50"
              />
            </div>
            <div className="flex h-full flex-col md:col-span-3">
              <div>
                <p className="font-display text-4xl font-bold leading-tight tracking-tight text-text-main dark:text-text-light md:text-5xl">
                  {bookData.title}
                </p>
                <p className="mt-2 text-xl font-medium text-text-main/80 dark:text-text-light/80">
                  {bookData.author}
                </p>
              </div>
              <h1 className="pb-4 pt-6 font-display text-4xl font-bold leading-tight tracking-light text-primary">
                ${bookData.price?.toFixed(2) || "0.00"}
              </h1>
              <div className="prose prose-lg mt-4 max-h-48 overflow-y-auto font-body text-text-main dark:text-text-light/90">
                <p>{bookData.description}</p>
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-primary/90 hover:shadow-lg"
                >
                  <span className="truncate">Add to Cart</span>
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg">
                  <span className="truncate">Buy Now</span>
                </button>
                {bookData.is_ebook && (
                  <button 
                  onClick={handleBuyEbook}
                  className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-green-600 px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-green-700 hover:shadow-lg">
                  <span className="truncate">Buy E-Book (${bookData.ebook_price})</span>
                </button>
                )}
                <button
                  onClick={handleWishlistToggle}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-4 py-3 text-base font-bold leading-normal tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg"
                >
                  {isInWishlist ? (
                    <MdFavorite className="h-6 w-6 text-red-500" />
                  ) : (
                    <MdFavoriteBorder className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="mt-8 border-t border-primary/20 pt-4 text-sm text-text-main/70 dark:text-text-light/70">
                <p>
                  <strong>Publisher:</strong> {bookData.publisher || "N/A"}
                </p>
                <p>
                  <strong>Publication Date:</strong>{" "}
                  {new Date(bookData.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>ISBN:</strong> {bookData.isbn || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-16">
            <h2 className="mb-6 border-b border-primary/20 pb-4 font-display text-3xl font-bold">
              Customer Reviews
            </h2>
            <div className="mb-8 flex items-center gap-4">
              <StarRating
                rating={average_rating || bookData.rating || 0}
                className="text-3xl"
              />
              <p className="text-lg font-bold">
                {average_rating?.toFixed(1) || "No rating"} out of 5 stars
              </p>
              <p className="text-text-main/70 dark:text-text-light/70">
                ({total_reviews || 0} reviews)
              </p>
            </div>
            <div className="space-y-8">
              {reviews?.map((review: Review) => (
                <div
                  key={review.id}
                  className="border-b border-primary/10 pb-6"
                >
                  {editingReview?.id === review.id ? (
                    // Editing View
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Rating
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <MdStar
                              key={star}
                              className={`cursor-pointer text-2xl ${
                                star <= (editingReview?.rating || 0)
                                  ? "text-secondary-link"
                                  : "text-gray-300"
                              }`}
                              onClick={() => {
                                if (editingReview) {
                                  setEditingReview({
                                    ...editingReview,
                                    rating: star,
                                  });
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium"
                        >
                          Comment
                        </label>
                        <textarea
                          id="comment"
                          rows={3}
                          value={editingReview?.comment || ""}
                          onChange={(e) => {
                            if (editingReview) {
                              setEditingReview({
                                ...editingReview,
                                comment: e.target.value,
                              });
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateReview}
                          className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Default View
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p className="mr-4 font-bold">{review.user_name}</p>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-text-main/90 dark:text-text-light/90">
                          {review.comment}
                        </p>
                      </div>
                      {/* Show Edit/Delete buttons only if the user owns the review */}
                      {currentUserName &&
                        currentUserName === review.user_name && (
                          <div className="flex flex-shrink-0 gap-4 pl-4">
                            <button
                              onClick={() => setEditingReview(review)}
                              className="text-sm text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsReviewFormVisible(!isReviewFormVisible)}
                className="h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-secondary-link bg-transparent px-6 text-base font-bold leading-normal tracking-wider text-secondary-link shadow-sm transition-colors hover:bg-secondary-link/10"
              >
                <span className="truncate">Write a Review</span>
              </button>
            </div>
          </div>

          {isReviewFormVisible && (
            <div className="mt-8">
              <ReviewForm
                bookSlug={slug!}
                onReviewSubmitted={() => setIsReviewFormVisible(false)}
                onCancel={() => setIsReviewFormVisible(false)}
              />
            </div>
          )}

          {/* Related Books Section */}
          {related_books && related_books.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 border-b border-primary/20 pb-4 font-display text-3xl font-bold">
                Related Books
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {related_books.map((book: Book) => (
                  <RelatedBookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookDetailPage;
