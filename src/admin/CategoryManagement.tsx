import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  fetchCategoriesAsync,
  createCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,
} from "../redux/slice/bookSlice";
import { toast, Toaster } from "react-hot-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";
import ConfirmationModal from "./ConfirmationModal";

const CategoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, categoryStatus, categoryError } = useSelector(
    (state: RootState) => state.books
  );

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<{
    id: number | null;
    name: string;
    description: string;
  }>({ id: null, name: "", description: "" });
  
  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategoriesAsync());
    }
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    if (categoryError) {
      toast.error(`Error: ${categoryError}`);
    }
  }, [categoryError]);

  const handleOpenModal = (
    category: { id: number; name: string; description: string } | null = null
  ) => {
    if (category) {
      setCurrentCategory(category);
    } else {
      setCurrentCategory({ id: null, name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!currentCategory.name) {
      toast.error("Category name is required.");
      return;
    }

    setIsSaving(true);
    try {
        if (currentCategory.id) {
          // Update
          await dispatch(
            updateCategoryAsync({
              id: currentCategory.id,
              data: {
                name: currentCategory.name,
                description: currentCategory.description,
              },
            })
          ).unwrap();
          toast.success("Category updated successfully!");
        } else {
          // Create
          await dispatch(
            createCategoryAsync({
              name: currentCategory.name,
              description: currentCategory.description,
            })
          ).unwrap();
          toast.success("Category created successfully!");
        }
        handleCloseModal();
    } catch (e) {
        toast.error("Failed to save category");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
        setIsDeleting(true);
        try {
            await dispatch(deleteCategoryAsync(categoryToDelete)).unwrap();
            toast.success("Category deleted successfully!");
        } catch (e) {
            toast.error("Failed to delete category");
        } finally {
            setIsDeleting(false);
            setCategoryToDelete(null);
            setIsConfirmOpen(false);
        }
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        isProcessing={isDeleting}
      />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${!sidebarOpen ? "pl-20" : ""}`}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f4f1] p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-[#261d1a] text-4xl font-bold">Categories</h1>
                <p className="text-[#261d1a]/70 text-base mt-2">Manage your book categories here.</p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#013a67] text-white font-bold hover:bg-[#013a67]/90 transition-colors"
              >
                <Plus size={18} />
                <span>Add Category</span>
              </button>
            </div>

            {categoryStatus === "loading" && <p>Loading categories...</p>}

            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cat.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cat.id)}
                          disabled={categoryStatus === "loading"}
                          className="text-red-600 hover:text-red-900 disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">
                    {currentCategory.id ? "Edit" : "Add"} Category
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={currentCategory.name}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={currentCategory.description}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryManagement;
