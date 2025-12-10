import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const imageUrl = book.cover_image
    ? `${import.meta.env.VITE_API_BASE_URL}/${book.cover_image}`
    : "https://via.placeholder.com/400x600.png?text=No+Image";

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
}> = ({ bookSlug, onReviewSubmitted }) => {
  const dispatch: AppDispatch = useDispatch();
  // Assuming you have a user slice in your redux store
  // const { user } = useSelector((state: RootState) => state.user);
  // For now, let's simulate getting the user name from localStorage as a stand-in for a profile
  const { userProfile } = useSelector((state: RootState) => state.auth);
  const userName = userProfile
    ? `${userProfile.first_name} ${userProfile.last_name}`.trim()
    : null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

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
      user_name: userName, // Pass user name from profile/auth state
      rating,
      comment,
    };

    await dispatch(createReviewAsync({ slug: bookSlug, reviewData }));

    // Reset form and close it
    setRating(0);
    setComment("");
    onReviewSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <MdStar
              key={star}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-secondary-link" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium">
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Submit Review
      </button>
    </form>
  );
};

const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch: AppDispatch = useDispatch();
  const {
    currentBook,
    currentBookStatus: status,
    currentBookError: error,
  } = useSelector((state: RootState) => state.books);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { userProfile } = useSelector((state: RootState) => state.auth);
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

  const handleAddToCart = () => {
    if (!bookData) return;
    dispatch(addToCartAsync({ bookId: bookData.id, quantity: 1 }));
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
            <div className="md:col-span-2">
              <div
                className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat shadow-lg"
                style={{
                  backgroundImage: `url("${import.meta.env.VITE_API_BASE_URL}/${
                    bookData.cover_image
                  }")`,
                }}
                aria-label={`The cover of the book ${bookData.title}`}
              ></div>
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
                <button className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg">
                  <span className="truncate">Buy Now</span>
                </button>
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-4 py-3 text-base font-bold leading-normal tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg">
                  <MdFavoriteBorder className="h-6 w-6" />
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
