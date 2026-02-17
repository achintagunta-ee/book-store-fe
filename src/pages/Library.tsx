import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store/store";
import { getUserLibraryThunk, readEbookThunk } from "../redux/slice/authSlice";
import { Toaster, toast } from "react-hot-toast";
import { BookOpen, ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LibraryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userLibrary, userLibraryMeta, userLibraryStatus, userLibraryError } = useSelector(
    (state: RootState) => state.auth
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getUserLibraryThunk(page));
  }, [dispatch, page]);

  const handleReadBook = async (bookId: number) => {
    try {
      const res = await dispatch(readEbookThunk(bookId)).unwrap();
      if (res.pdf_url) {
        window.open(res.pdf_url, "_blank");
      }
    } catch (err: any) {
      let errorMessage = "Failed to open book";
      
      const rawError = err?.message || err;
      
      if (typeof rawError === "string") {
        try {
          // Try to parse if it's a JSON string from backend
          const parsed = JSON.parse(rawError);
          if (parsed.detail) {
            errorMessage = parsed.detail;
          } else {
            errorMessage = rawError;
          }
        } catch {
          // Not JSON, just use the string
          errorMessage = rawError;
        }
      } else if (typeof rawError.detail === "string") {
         errorMessage = rawError.detail;
      }

      toast.error(errorMessage);
    }
  };

  if (userLibraryStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl font-medium text-primary">Loading library...</div>
      </div>
    );
  }

  if (userLibraryStatus === "failed") {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-red-500">Error: {userLibraryError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4f1] px-4 py-8 md:px-8 lg:px-16">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-primary mb-8">My Library</h1>

      {userLibrary.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
          <div className="bg-primary/5 p-8 rounded-full mb-6 ring-1 ring-primary/10">
            <ShoppingBag size={64} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 font-display">Your Library is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
            Looks like you haven't purchased any e-books yet. Explore our collection to find your next great read.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
          >
            Browse Store <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userLibrary.map((book) => (
            <div
              key={book.book_id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                 {book.cover_image_url ? (
                  <img 
                    src={book.cover_image_url} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                 ) : (
                  <BookOpen size={48} className="text-gray-400" />
                 )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {book.title}
                </h3>
                <div className="mt-auto">
                   <p className="text-xs text-gray-500 mb-2">
                      Purchased: {new Date(book.purchased_at).toLocaleDateString()}
                   </p>
                   <p className="text-xs text-gray-500 mb-4">
                      Expires: {new Date(book.expires_at).toLocaleDateString()}
                   </p>
                  <button
                    onClick={() => handleReadBook(book.book_id)}
                    className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16} /> Read Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {userLibraryMeta && userLibraryMeta.total_pages && userLibraryMeta.total_pages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-medium text-gray-700">
            Page {page} of {userLibraryMeta.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(userLibraryMeta.total_pages || 1, p + 1))}
            disabled={page === userLibraryMeta.total_pages}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
