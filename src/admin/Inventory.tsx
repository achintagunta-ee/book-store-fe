import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import { Menu, X, Edit, Box } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getInventorySummaryThunk,
  getInventoryListThunk,
  updateBookStockThunk,
} from "../redux/slice/authSlice";
import { type InventoryItem } from "../redux/utilis/authApi";

const InventoryDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
	const { inventorySummary, inventoryList, inventoryMeta } = useSelector((state: RootState) => state.auth);
    
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);
    const [editingBook, setEditingBook] = useState<InventoryItem | null>(null);
    const [newStock, setNewStock] = useState<number>(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(getInventorySummaryThunk());
        dispatch(getInventoryListThunk({ page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

	const filteredBooks = inventoryList.filter(
		(book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getStatusColor = (status: string) => {
        const lower = status.toLowerCase();
		switch (true) {
			case lower.includes("in"):
				return "bg-green-100 text-green-800";
			case lower.includes("low"):
				return "bg-orange-100 text-orange-700";
			case lower.includes("out"):
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRowColor = (status: string) => {
        const lower = status.toLowerCase();
		return lower.includes("low") ? "bg-orange-50" : "";
	};

    const handleEditClick = (book: InventoryItem) => {
        setEditingBook(book);
        setNewStock(book.stock);
    };

    const handleUpdateStock = () => {
        if (editingBook) {
            setIsUpdating(true);
            dispatch(updateBookStockThunk({ bookId: editingBook.id, stock: newStock }))
                .unwrap()
                .then(() => {
                    setEditingBook(null);
                    // Refresh list and summary
                    dispatch(getInventorySummaryThunk());
                    dispatch(getInventoryListThunk({ page: currentPage, limit: itemsPerPage }));
                    toast.success("Stock updated successfully");
                })
                .catch((err: any) => {
                    toast.error(err);
                })
                .finally(() => {
                    setIsUpdating(false);
                });
        }
    };

    const handlePageChange = (newPage: number) => {
        if (inventoryMeta && newPage >= 1 && newPage <= inventoryMeta.total_pages) {
            setCurrentPage(newPage);
        }
    };

	return (
		<div className="flex h-screen w-full bg-background-light overflow-hidden">
			<Sidebar sidebarOpen={sidebarOpen} />
			<main className="flex-1 p-8 bg-[#f8f4f1] overflow-y-auto">
				<div className="max-w-full">
					{/* Header */}
					<div className="flex justify-between items-start mb-6">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors"
						>
							{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
						<div>
							<h1 className="text-[#5c2e2e] text-4xl font-bold mb-1">
								Inventory
							</h1>
							<p className="text-[#8E5A4F] text-base">
								Manage your book stock levels and restock alerts.
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="rounded-lg p-6 border border-[#e2d8d4] bg-white">
							<p className="text-[#261d1a] text-base font-medium mb-2">
								Total Books
							</p>
							<p className="text-[#5c2e2e] text-3xl font-bold">{inventorySummary?.total_books || 0}</p>
						</div>
						<div className="rounded-lg p-6 border border-[#8E5A4F] bg-orange-50">
							<p className="text-[#261d1a] text-base font-medium mb-2">
								Low Stock Items
							</p>
							<p className="text-[#8E5A4F] text-3xl font-bold">{inventorySummary?.low_stock || 0}</p>
						</div>
						<div className="rounded-lg p-6 border border-[#e2d8d4] bg-white">
							<p className="text-[#261d1a] text-base font-medium mb-2">
								Out of Stock Items
							</p>
							<p className="text-[#5c2e2e] text-3xl font-bold">{inventorySummary?.out_of_stock || 0}</p>
						</div>
					</div>

					{/* Search Bar */}
					<div className="mb-4">
						<div className="flex h-12 w-full rounded-lg overflow-hidden border border-[#e2d8d4]">
							<div className="flex items-center justify-center pl-4 bg-white text-[#8E5A4F]">
								<span className="material-symbols-outlined">search</span>
							</div>
							<input
								type="text"
								placeholder="Search by book title or author"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 px-4 bg-white text-[#261d1a] placeholder:text-[#8E5A4F]/80 focus:outline-none focus:ring-1 focus:ring-[#B35E3F] border-none"
							/>
						</div>
					</div>

					{/* Inventory Table */}
					<div className="overflow-x-auto rounded-lg border border-[#e2d8d4] mb-4">
						<table className="w-full bg-white">
							<thead className="bg-[#f8f4f1]">
								<tr>
									<th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Book Title
									</th>
									<th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Author
									</th>
                                    <th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
                                        Price
                                    </th>
									<th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Current Stock
									</th>
									<th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Status
									</th>
                                    <th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
                                        Last Updated
                                    </th>
									<th className="px-6 py-4 text-right text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#e2d8d4]">
								{filteredBooks && filteredBooks.length > 0 ? (
									filteredBooks.map((book) => (
										<tr key={book.id} className={getRowColor(book.status)}>
											<td className="px-6 py-4 whitespace-nowrap text-[#261d1a]">
												{book.title}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-[#8E5A4F]">
												{book.author}
											</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#261d1a]">
                                                ${book.price !== undefined ? book.price.toFixed(2) : '0.00'}
                                            </td>
											<td
												className={`px-6 py-4 whitespace-nowrap font-semibold ${
													book.status.toLowerCase().includes("low")
														? "text-[#8E5A4F]"
														: "text-[#261d1a]"
												}`}
											>
												{book.stock}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
														book.status
													)}`}
												>
													{book.status}
												</span>
											</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {book.updated_at ? new Date(book.updated_at).toLocaleDateString() : '-'}
                                            </td>
											<td className="px-6 py-4 whitespace-nowrap text-right">
												<button
													onClick={() => handleEditClick(book)}
													className="text-[#B35E3F] hover:text-[#5c2e2e] text-sm font-medium flex items-center justify-end gap-1 w-full"
												>
													<Edit size={16} /> Edit
												</button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="px-6 py-8 text-center text-gray-500">
											<div className="flex flex-col items-center justify-center">
												<Box size={48} className="text-gray-300 mb-2" />
												<p>No books found matching your search.</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

                    {/* Pagination */}
                    {inventoryMeta && inventoryMeta.total_pages > 1 && (
                        <div className="flex justify-between items-center bg-white px-4 py-3 border border-[#e2d8d4] rounded-lg shadow-sm">
                            <div className="text-sm text-[#5c2e2e]">
                                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, inventoryMeta.total)}</span> of <span className="font-medium">{inventoryMeta.total}</span> results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, inventoryMeta.total_pages) }, (_, i) => {
                                    // Logic to show a window of pages around current page
                                    let pageNum = i + 1;
                                    if (inventoryMeta.total_pages > 5) {
                                        if (currentPage > 3) {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        if (pageNum > inventoryMeta.total_pages) {
                                            pageNum = inventoryMeta.total_pages - 4 + i;
                                        }
                                    }
                                    
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md border ${
                                                currentPage === pageNum
                                                    ? "bg-[#B35E3F] text-white border-[#B35E3F]"
                                                    : "bg-white border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1]"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === inventoryMeta.total_pages}
                                    className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-[#e2d8d4] text-[#5c2e2e] hover:bg-[#f8f4f1] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
				</div>
			</main>

            {/* Edit Modal */}
            {editingBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                         <button
                            onClick={() => setEditingBook(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-[#5c2e2e] mb-2">Update Stock</h2>
                        <p className="text-gray-600 mb-6">Update the stock quantity for <span className="font-semibold text-[#B35E3F]">{editingBook.title}</span>.</p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                            <input 
                                type="number" 
                                min="0" 
                                value={newStock} 
                                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B35E3F] focus:border-transparent text-lg font-medium"
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setEditingBook(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateStock}
                                disabled={isUpdating}
                                className="px-6 py-2 bg-[#B35E3F] hover:bg-[#8E5A4F] text-white rounded-lg shadow transition-colors font-medium disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : "Update Stock"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
		</div>
	);
};

export default InventoryDashboard;
