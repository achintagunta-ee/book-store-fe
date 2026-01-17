import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Menu,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  fetchBooksAsync,
  fetchCategoriesAsync,
  createBookAsync,
  updateBookAsync,
  deleteBookAsync,
} from "../redux/slice/bookSlice";
import type { Book } from "../redux/utilis/bookApi";
import Sidebar from "./Sidebar";
import { uploadEbookThunk } from "../redux/slice/authSlice";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
  const { books, categories, status, error } = useSelector(
    (state: RootState) => state.books
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book> | null>(null);

  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [ebookBook, setEbookBook] = useState<Book | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBooksAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((book) =>
        selectedCategory
          ? book.category_id === parseInt(selectedCategory)
          : true
      );
  }, [books, searchQuery, selectedCategory]);

  const handleOpenModal = (book: Book | null = null) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  const handleSaveBook = async (formData: FormData) => {
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
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBookAsync(id)).unwrap();
        toast.success("Book deleted successfully!");
      } catch (err: any) {
        toast.error(`Failed to delete book: ${err.message || "Unknown error"}`);
      }
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
        isSaving={status === "loading"}
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
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <header className="flex justify-between items-center mb-8 gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>
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
                      key={book.id}
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
                        {categories.find((c) => c.id === book.category_id)
                          ?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/80">
                        ${book.price.toFixed(2)}
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
                          <button
                            onClick={() => handleOpenModal(book)}
                            className="text-[#5c2e2e] hover:text-[#013a67] transition-colors"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="text-[#5c2e2e] hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center p-4 mt-4 gap-1">
            <button className="flex w-10 h-10 items-center justify-center text-[#261d1a]/70 hover:text-[#013a67]">
              <ChevronLeft size={20} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`text-sm font-bold flex w-10 h-10 items-center justify-center rounded-full transition-colors ${
                  currentPage === page
                    ? "text-white bg-[#013a67]"
                    : "text-[#261d1a] hover:bg-[#013a67]/10"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-sm flex w-10 h-10 items-center justify-center text-[#261d1a]">
              ...
            </span>
            <button className="text-sm flex w-10 h-10 items-center justify-center text-[#261d1a] rounded-full hover:bg-[#013a67]/10">
              10
            </button>
            <button className="flex w-10 h-10 items-center justify-center text-[#261d1a]/70 hover:text-[#013a67]">
              <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BooksManagement;
