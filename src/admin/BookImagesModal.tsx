import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  listBookImagesAsync,
  addBookImagesAsync,
  removeBookImageAsync,
  reorderBookImagesAsync,
} from "../redux/slice/bookSlice";
import type { BookImage } from "../redux/utilis/bookApi";
import { X, Upload, Trash2, MoveLeft, MoveRight, Save } from "lucide-react";
import toast from "react-hot-toast";

interface BookImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number | null;
  bookTitle?: string;
}

const BookImagesModal: React.FC<BookImagesModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookImages, bookImagesStatus } = useSelector(
    (state: RootState) => state.books
  );
  
  const [localImages, setLocalImages] = useState<BookImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (isOpen && bookId) {
      dispatch(listBookImagesAsync(bookId));
    }
  }, [isOpen, bookId, dispatch]);

  useEffect(() => {
    if (bookImagesStatus === "succeeded") {
      // Create a sorted copy
      const sorted = [...bookImages].sort((a, b) => {
        const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
      setLocalImages(sorted);
      setHasUnsavedChanges(false);
    }
  }, [bookImages, bookImagesStatus]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !bookId) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    setIsUploading(true);
    try {
      await dispatch(addBookImagesAsync({ bookId, formData })).unwrap();
      toast.success("Images uploaded successfully");
    } catch (err: any) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      // Clear input
      e.target.value = "";
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await dispatch(removeBookImageAsync(imageId)).unwrap();
      toast.success("Image deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete image");
    }
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...localImages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    // Swap
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    setLocalImages(newImages);
    setHasUnsavedChanges(true);
  };

  const handleSaveOrder = async () => {
    if (!bookId) return;
    const order = localImages.map((img) => img.image_id);
    try {
      await dispatch(reorderBookImagesAsync({ bookId, order })).unwrap();
      toast.success("Image order saved");
      setHasUnsavedChanges(false);
    } catch (err: any) {
      toast.error("Failed to save order");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#261d1a]">
            Manage Images for "{bookTitle}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="upload-images"
                disabled={isUploading}
            />
            <label
                htmlFor="upload-images"
                className={`flex items-center gap-2 px-4 py-2 bg-[#013a67] text-white rounded cursor-pointer hover:bg-[#013a67]/90 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Upload size={18} />
                {isUploading ? "Uploading..." : "Add Images"}
            </label>
          </div>

          <button
            onClick={handleSaveOrder}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${
              hasUnsavedChanges
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Save size={18} />
            Save Order
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border rounded p-4 bg-gray-50">
          {bookImagesStatus === "loading" && localImages.length === 0 ? (
            <div className="text-center py-10">Loading images...</div>
          ) : localImages.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No images found. Upload some images to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {localImages.map((img, index) => (
                <div
                  key={img.image_id}
                  className="relative group bg-white p-2 rounded shadow border border-gray-200"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden rounded bg-gray-100 mb-2 items-center flex justify-center">
                    <img
                      src={img.url}
                      alt={`Book cover ${index + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center px-1">
                    <div className="flex gap-1">
                        <button
                            onClick={() => moveImage(index, "left")}
                            disabled={index === 0}
                            className="p-1 text-gray-500 hover:text-[#013a67] disabled:opacity-30"
                            title="Move Left/Up"
                        >
                            <MoveLeft size={16} />
                        </button>
                        <button
                            onClick={() => moveImage(index, "right")}
                            disabled={index === localImages.length - 1}
                            className="p-1 text-gray-500 hover:text-[#013a67] disabled:opacity-30"
                            title="Move Right/Down"
                        >
                            <MoveRight size={16} />
                        </button>
                    </div>
                    <button
                        onClick={() => handleDelete(img.image_id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete Image"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookImagesModal;
