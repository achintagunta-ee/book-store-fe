import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  SlidersHorizontal,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import BookImagesModal from "./BookImagesModal";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  fetchBooksAsync,
  fetchCategoriesAsync,
  createBookAsync,
  updateBookAsync,
  deleteBookAsync,
  archiveBookAsync,
  restoreBookAsync,
} from "../redux/slice/bookSlice";
import AdminPagination from "../components/admin/AdminPagination";
import type { Book } from "../redux/utilis/bookApi";
import Sidebar from "./Sidebar";
import { uploadEbookThunk } from "../redux/slice/authSlice";
import ConfirmationModal from "./ConfirmationModal";


const UploadEbookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  bookId: number | null;
  bookTitle?: string;
}> = ({ isOpen, onClose, bookId, bookTitle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !bookId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !price) {
      toast.error("Please provide both file and price");
      return;
    }

    setIsUploading(true);
    try {
      await dispatch(
        uploadEbookThunk({
          bookId,
          file,
          ebookPrice: parseFloat(price),
        })
      ).unwrap();
      toast.success("E-book uploaded successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload E-book");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload E-book for "{bookTitle}"</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-book PDF File
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-book Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-[#013a67] text-white rounded hover:bg-[#013a67]/90 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  book: Partial<Book> | null;
  categories: { id: number; name: string }[];
  isSaving: boolean;
}> = ({ isOpen, onClose, onSave, book, categories, isSaving }) => {
  const [formData, setFormData] = useState<any>({
    title: book?.title || "",
    author: book?.author || "",
    price: book?.price || "",
    description: book?.description || "",
    stock: book?.stock || "",
    category_id: book?.category_id || "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    // When the book prop changes, update the form data
    setFormData({
      title: book?.title || "",
      author: book?.author || "",
      price: book?.price || "",
      description: book?.description || "",
      stock: book?.stock || "",
      category_id: book?.category_id || "",
    });
  }, [book]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (coverImage) {
      data.append("cover_image", coverImage);
    }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {book?.id ? "Edit" : "Add"} Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <input
              type="file"
              name="cover_image"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BooksManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, status, error, categories, totalBooks, totalPages } = useSelector(
    (state: RootState) => state.books
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book> | null>(null);

  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [ebookBook, setEbookBook] = useState<Book | null>(null);

  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [imagesBook, setImagesBook] = useState<Book | null>(null);

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSavingBook, setIsSavingBook] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [archivingId, setArchivingId] = useState<number | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBooksAsync({ 
      page: currentPage, 
      limit: 10,
      search: searchQuery,
      category: selectedCategory,
      archived: showArchived
    }));
  }, [dispatch, currentPage, searchQuery, selectedCategory, showArchived]);

  useEffect(() => {
      dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  // Client-side filtering removed in favor of server-side
  const filteredBooks = books;

  const handleOpenModal = (book: Book | null = null) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  const handleSaveBook = async (formData: FormData) => {
    setIsSavingBook(true);
    try {
      if (currentBook?.id) {
        await dispatch(
          updateBookAsync({ id: currentBook.id, data: formData })
        ).unwrap();
        toast.success("Book updated successfully!");
      } else {
        await dispatch(createBookAsync(formData)).unwrap();
        toast.success("Book created successfully!");
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(`Failed to save book: ${err.message || "Unknown error"}`);
    } finally {
      setIsSavingBook(false);
    }
  };



  const confirmDelete = async () => {
    if (bookToDelete) {
      setDeletingId(bookToDelete);
      try {
        await dispatch(deleteBookAsync(bookToDelete)).unwrap();
        toast.success("Book deleted permanently!");
        dispatch(fetchBooksAsync({ 
          page: currentPage, 
          limit: 10,
          search: searchQuery,
          category: selectedCategory,
          archived: showArchived
        }));
      } catch (err: any) {
        toast.error(`Failed to delete book: ${err.message || "Unknown error"}`);
      } finally {
        setDeletingId(null);
        setBookToDelete(null);
        setIsConfirmOpen(false);
      }
    }
  };

  const handleArchiveClick = async (id: number) => {
    setArchivingId(id);
    try {
        await dispatch(archiveBookAsync(id)).unwrap();
        toast.success("Book archived successfully");
    } catch (error: any) {
         toast.error(error.message || "Failed to archive book");
    } finally {
        setArchivingId(null);
    }
  };

  const handleRestoreClick = async (id: number) => {
    setRestoringId(id);
    try {
        await dispatch(restoreBookAsync(id)).unwrap();
        toast.success("Book restored successfully");
    } catch (error: any) {
         toast.error(error.message || "Failed to restore book");
    } finally {
        setRestoringId(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      <Toaster position="top-right" />
      <BookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBook}
        book={currentBook}
        categories={categories}
        isSaving={isSavingBook}
      />
      <UploadEbookModal
        isOpen={isEbookModalOpen}
        onClose={() => {
          setIsEbookModalOpen(false);
          setEbookBook(null);
        }}
        bookId={ebookBook?.id || null}
        bookTitle={ebookBook?.title}
      />
      <BookImagesModal
        isOpen={isImagesModalOpen}
        onClose={() => {
          setIsImagesModalOpen(false);
          setImagesBook(null);
        }}
        bookId={imagesBook?.id || null}
        bookTitle={imagesBook?.title}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        isProcessing={deletingId !== null}
      />

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

          <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#261d1a] text-4xl font-bold">
                Books Management
              </h1>
              <p className="text-[#261d1a]/70 text-base">
                Add, edit, and manage your book inventory.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#013a67] text-white font-bold hover:bg-[#013a67]/90 transition-colors"
            >
              <Plus size={18} />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="flex gap-4 mb-6 border-b border-[#5c2e2e]/10">
              <button
                onClick={() => { setShowArchived(false); setCurrentPage(1); }}
                className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                  !showArchived 
                    ? "border-[#013a67] text-[#013a67]" 
                    : "border-transparent text-gray-500 hover:text-[#013a67]"
                }`}
              >
                Active Books
              </button>
              <button
                 onClick={() => { setShowArchived(true); setCurrentPage(1); }}
                 className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
                   showArchived
                     ? "border-[#013a67] text-[#013a67]" 
                     : "border-transparent text-gray-500 hover:text-[#013a67]"
                 }`}
              >
                Archived Books
              </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between gap-4 px-4 py-3 bg-[#013a67]/5 rounded-lg border border-[#5c2e2e]/10 mb-4">
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#261d1a]/50"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#5c2e2e]/20 bg-white focus:ring-2 focus:ring-[#013a67] focus:border-[#013a67] text-[#261d1a] outline-none"
                placeholder="Search by title..."
              />
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-lg border border-[#5c2e2e]/20 bg-white focus:ring-2 focus:ring-[#013a67] focus:border-[#013a67] text-[#261d1a] outline-none px-3"
              >
                <option value="">Filter by Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button className="p-2.5 rounded-lg border border-[#5c2e2e]/20 bg-white text-[#261d1a] hover:bg-[#013a67]/5">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          {status === "loading" && <p>Loading books...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {/* Books Table */}
          <div className="w-full overflow-x-auto">
            <div className="rounded-lg border border-[#5c2e2e]/20 bg-white">
              <table className="min-w-full divide-y divide-[#5c2e2e]/20">
                <thead className="bg-[#013a67]/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider w-20">
                      Cover
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#261d1a] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5c2e2e]/10">
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id || book.book_id}
                      className="hover:bg-[#013a67]/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="bg-center bg-no-repeat bg-cover rounded w-10 aspect-[2/3] bg-gray-200"
                          style={{
                            backgroundImage: book.cover_image_url
                              ? `url(${book.cover_image_url})`
                              : "none",
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#261d1a]">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/80">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/80">
                        {book.category?.name || categories.find((c) => c.id === book.category_id)?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/80">
                        ₹{(Number(book.price) || 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          book.stock < 10 ? "text-red-600" : "text-[#261d1a]/80"
                        }`}
                      >
                          {book.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          {!showArchived && (
                             <button
                               onClick={() => handleOpenModal(book)}
                               className="text-[#5c2e2e] hover:text-[#013a67] transition-colors"
                               title="Edit"
                             >
                               <Edit size={20} />
                             </button>
                          )}
                          
                          {!showArchived ? (
                            <button
                                onClick={() => handleArchiveClick(book.id)}
                                disabled={archivingId === book.id}
                                className="text-orange-600 hover:text-orange-800 transition-colors disabled:opacity-50"
                                title="Archive"
                            >
                                {archivingId === book.id ? (
                                    <span className="text-xs font-bold">...</span>
                                ) : (
                                    <Trash2 size={20} />
                                )}
                            </button>
                          ) : (
                             <button
                                onClick={() => handleRestoreClick(book.id)}
                                disabled={restoringId === book.id}
                                className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                                title="Restore"
                            >
                                {restoringId === book.id ? (
                                    <span className="text-xs font-bold">...</span>
                                ) : (
                                    <RotateCcw size={20} />
                                )}
                            </button>
                          )}

                          {/* Allow permanent delete only if archived? Or keep standard delete for both? 
                              User request implies Archive replaces Delete for active books. 
                              Usually Admin can delete permanently from Archive. 
                              I'll add permanent delete button for Archived books. 
                          */}


                        </div>
                        {!showArchived && (
                            <div className="flex items-center gap-4 mt-2">
                               <button
                                onClick={() => {
                                  setEbookBook(book);
                                  setIsEbookModalOpen(true);
                                }}
                                className="text-[#013a67] text-xs hover:underline flex items-center gap-1"
                              >
                               <Plus size={14} /> Upload E-book
                              </button>
                              <button
                                onClick={() => {
                                  setImagesBook(book);
                                  setIsImagesModalOpen(true);
                                }}
                                className="text-[#013a67] text-xs hover:underline flex items-center gap-1"
                              >
                               <ImageIcon size={14} /> Manage Images
                              </button>
                            </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalResults={totalBooks}
                itemsPerPage={10}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BooksManagement;

