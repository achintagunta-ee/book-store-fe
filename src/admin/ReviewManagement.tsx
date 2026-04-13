import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { Trash2, Star } from "lucide-react";
import type { AppDispatch, RootState } from "../redux/store/store";
import { fetchAdminReviewsAsync, deleteAdminReviewAsync } from "../redux/slice/bookSlice";
import Sidebar from "./Sidebar";
import ConfirmationModal from "./ConfirmationModal";

const ReviewManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminReviews, adminReviewsStatus } = useSelector(
    (state: RootState) => state.books
  );

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminReviewsAsync());
  }, [dispatch]);

  const confirmDelete = async () => {
    if (reviewToDelete) {
      setIsDeleting(true);
      try {
        await dispatch(deleteAdminReviewAsync(reviewToDelete)).unwrap();
        toast.success("Review deleted successfully!");
      } catch (err: any) {
        toast.error(`Failed to delete review: ${err.message || "Unknown error"}`);
      } finally {
        setIsDeleting(false);
        setReviewToDelete(null);
        setIsConfirmOpen(false);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#f8f4f1] overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        isProcessing={isDeleting}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${!sidebarOpen ? "pl-20" : ""}`}>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h1 className="text-[#261d1a] text-3xl font-bold">Reviews</h1>
                <p className="text-[#261d1a]/70 text-sm">
                  Manage all book reviews from customers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#5c2e2e]/10 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-[#5c2e2e]/20">
                <thead className="bg-[#013a67]/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Review Context
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider text-wrap max-w-[300px]">
                      Comment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5c2e2e]/10 bg-white">
                  {adminReviewsStatus === "loading" ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-[#261d1a]/60">
                        Loading reviews...
                      </td>
                    </tr>
                  ) : adminReviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-[#261d1a]/60">
                        No reviews found.
                      </td>
                    </tr>
                  ) : (
                    adminReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-[#013a67]/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#261d1a]">
                              User ID: {review.user_id}
                            </span>
                            <span className="text-xs text-[#261d1a]/60">
                              Book ID: {review.book_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm font-bold text-[#261d1a]">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#261d1a]/80 break-words line-clamp-3">
                            {review.comment || "No comment provided."}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/60">
                          {new Date(review.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setReviewToDelete(review.id);
                              setIsConfirmOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 bg-red-50 p-2 text-center inline-flex items-center justify-center rounded-lg transition-colors border border-red-500/10"
                            title="Delete Review"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewManagement;
