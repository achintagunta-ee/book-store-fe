import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store/store";
import { getUserLibraryThunk, readEbookThunk } from "../redux/slice/authSlice";
import { Toaster, toast } from "react-hot-toast";
import { BookOpen } from "lucide-react";

const LibraryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userLibrary, userLibraryStatus, userLibraryError } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(getUserLibraryThunk());
  }, [dispatch]);

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
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">Your library is empty.</p>
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
    </div>
  );
};

export default LibraryPage;
