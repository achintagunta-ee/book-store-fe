import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Send, X, Menu, Eye, Calendar, Download, Truck, Bell, Plus, Trash2, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import { 
	getAdminOrdersThunk, 
	getAdminOrderDetailsThunk, 
	notifyCustomerThunk, 
	getAdminOrderInvoiceThunk, 
	updateOrderStatusThunk,
	addOrderTrackingThunk,
	getAdminOrderNotificationsThunk,
    createOfflineOrderThunk,
    getInventoryListThunk
} from "../redux/slice/authSlice";
import { downloadOrderInvoiceApi, type AdminOrder, type AdminOrderNotificationItem } from "../redux/utilis/authApi";

// Searchable Dropdown Component
const BookSearchSelect = ({ 
    books, 
    value, 
    onChange 
}: { 
    books: any[], 
    value: string, 
    onChange: (val: string) => void 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const selectedBook = books?.find(b => b.id.toString() === value.toString());
    const filteredBooks = books?.filter(b => {
        const titleMatch = b.title.toLowerCase().includes(search.toLowerCase());
        const idMatch = b.id.toString().includes(search);
        return titleMatch || idMatch;
    });

    return (
        <div className="relative" ref={wrapperRef}>
            <div 
                className="bg-white border border-gray-300 text-text-main text-sm rounded-lg p-2 cursor-pointer flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="truncate max-w-[200px]">
                    {selectedBook ? `${selectedBook.title} (ID: ${selectedBook.id})` : "Select Book"}
                </div>
                <ChevronDown size={16} className="text-gray-500 shrink-0 ml-1" />
            </div>
            
            {isOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-hidden flex flex-col min-w-[300px]">
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded p-1.5 text-sm focus:outline-none focus:border-[#B35E3F]"
                            placeholder="Search by title or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()} 
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-48">
                        {filteredBooks && filteredBooks.length > 0 ? (
                            filteredBooks.map(book => (
                                <div 
                                    key={book.id}
                                    className={`p-2 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50 ${selectedBook?.id === book.id ? 'bg-primary/5' : ''}`}
                                    onClick={() => {
                                        onChange(book.id.toString());
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <div className="font-medium text-text-main">{book.title}</div>
                                    <div className="text-gray-400 text-xs">ID: {book.id} • Stock: {book.stock}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-400 text-sm text-center">No books found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const OrdersPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { adminOrders, adminOrderDetail, adminOrderInvoice, adminOrderNotifications, inventoryList } = useSelector((state: RootState) => state.auth);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	
	const [showNotifyModal, setShowNotifyModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const [showTrackingModal, setShowTrackingModal] = useState(false);
	const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
	const [notificationType, setNotificationType] = useState(""); 
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	const [trackingId, setTrackingId] = useState("");
	const [trackingUrl, setTrackingUrl] = useState("");
    const [isSavingTracking, setIsSavingTracking] = useState(false);

    // Offline Order State
    const [showOfflineOrderModal, setShowOfflineOrderModal] = useState(false);
    const [offlineOrderForm, setOfflineOrderForm] = useState<{
        user_id: string;
        address_id: string;
        items: { book_id: string; quantity: number }[];
        payment_mode: string;
        notes: string;
    }>({
        user_id: "",
        address_id: "",
        items: [{ book_id: "", quantity: 1 }],
        payment_mode: "cash",
        notes: ""
    });
    const [isCreatingOfflineOrder, setIsCreatingOfflineOrder] = useState(false);
	
	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchOrders();
		}, 500);
        // Fetch inventory list for dropdown if not already available
        if (!inventoryList || inventoryList.length === 0) {
            dispatch(getInventoryListThunk());
        }
		return () => clearTimeout(timer);
	}, [searchQuery, statusFilter, startDate, endDate, currentPage]);

	const fetchOrders = () => {
		dispatch(getAdminOrdersThunk({
			page: currentPage,
			limit: 10,
			search: searchQuery,
			status: statusFilter === "All" ? "" : statusFilter,
			start_date: startDate,
			end_date: endDate
		}));
	};

	const orders = adminOrders?.results || [];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "shipped":
				return "bg-green-100 text-green-800";
			case "processing":
				return "bg-blue-100 text-blue-800";
			case "delivered":
				return "bg-gray-200 text-gray-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "canceled":
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "paid":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleNotify = (order: AdminOrder) => {
		setSelectedOrder(order);
		setShowNotifyModal(true);
	};

	const handleSendNotification = async () => {
		if (selectedOrder) {
            setIsSending(true);
			try {
			    await dispatch(notifyCustomerThunk(selectedOrder.order_id)).unwrap();
			    setShowNotifyModal(false);
			    setNotificationType("");
			    toast.success("Customer notified successfully!");
            } catch (error) {
                toast.error("Failed to notify customer.");
            } finally {
                setIsSending(false);
            }
		}
	};

	const handleViewDetails = async (orderId: number) => {
		await dispatch(getAdminOrderDetailsThunk(orderId));
		setShowDetailModal(true);
	};
	const handleViewInvoice = async (orderId: number) => {
		await dispatch(getAdminOrderInvoiceThunk(orderId));
		setShowInvoiceModal(true);
	};
	
	const handleDownloadInvoice = async (orderId: number) => {
		try {
			const blob = await downloadOrderInvoiceApi(orderId);
			const url = window.URL.createObjectURL(blob as Blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `invoice_${orderId}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to download invoice", error);
			toast.error("Failed to download invoice");
		}
	};
	
	const handleStatusChange = async (orderId: number, newStatus: string) => {
		await dispatch(updateOrderStatusThunk({ orderId, newStatus }));
	};

	const handleTracking = (order: AdminOrder) => {
		setSelectedOrder(order);
		setTrackingId("");
		setTrackingUrl("");
		setShowTrackingModal(true);
	};

	const handleSaveTracking = async () => {
		if (selectedOrder) {
            setIsSavingTracking(true);
            try {
			    await dispatch(addOrderTrackingThunk({
				    orderId: selectedOrder.order_id,
				    trackingId,
				    trackingUrl
			    })).unwrap();
			    setShowTrackingModal(false);
			    toast.success("Tracking updated successfully!");
            } catch (error) {
                toast.error("Failed to save tracking info.");
            } finally {
                setIsSavingTracking(false);
            }
		}
	};

	const handleViewNotifications = () => {
		dispatch(getAdminOrderNotificationsThunk());
		setShowNotificationsModal(true);
	};

    const handleAddOfflineItem = () => {
        setOfflineOrderForm(prev => ({
            ...prev,
            items: [...prev.items, { book_id: "", quantity: 1 }]
        }));
    };

    const handleRemoveOfflineItem = (index: number) => {
        setOfflineOrderForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleOfflineItemChange = (index: number, field: "book_id" | "quantity", value: string | number) => {
        setOfflineOrderForm(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const handleCreateOfflineOrder = async () => {
        // Validation
        if (!offlineOrderForm.user_id || !offlineOrderForm.address_id) {
            toast.error("Please fill in User ID and Address ID");
            return;
        }
        if (offlineOrderForm.items.some(item => !item.book_id || item.quantity < 1)) {
            toast.error("Please ensure all items have valid Book ID and Quantity");
            return;
        }

        setIsCreatingOfflineOrder(true);
        try {
            const payload = {
                user_id: parseInt(offlineOrderForm.user_id),
                address_id: parseInt(offlineOrderForm.address_id),
                items: offlineOrderForm.items.map(item => ({
                    book_id: parseInt(item.book_id),
                    quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity
                })),
                payment_mode: offlineOrderForm.payment_mode,
                notes: offlineOrderForm.notes
            };
            
            await dispatch(createOfflineOrderThunk(payload)).unwrap();
            toast.success("Offline order created successfully!");
            setShowOfflineOrderModal(false);
            setOfflineOrderForm({
                user_id: "",
                address_id: "",
                items: [{ book_id: "", quantity: 1 }],
                payment_mode: "cash",
                notes: ""
            });
            fetchOrders(); // Refresh list
        } catch (error: any) {
            toast.error(error || "Failed to create offline order");
        } finally {
            setIsCreatingOfflineOrder(false);
        }
    };

	const totalPages = adminOrders?.total_pages || 1;

	return (
		<div className="flex h-screen w-full bg-background-light overflow-hidden">
			<Sidebar sidebarOpen={sidebarOpen} />

			<main className="flex-1 overflow-y-auto">
				<div className="px-10 py-5">
					{/* Header */}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors mb-4"
					>
						{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<div className="flex flex-wrap justify-between gap-3 p-4">
						<h1 className="text-card-border text-4xl font-black leading-tight tracking-tight">
							Orders 
						</h1>
						<button
							onClick={handleViewNotifications}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2D8D4] text-card-border rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-semibold"
						>
							<Bell size={20} />
							Notifications
						</button>
                        <button
							onClick={() => setShowOfflineOrderModal(true)}
							className="flex items-center gap-2 px-4 py-2 bg-card-border text-white rounded-lg hover:bg-card-border/90 transition-colors shadow-sm font-semibold"
						>
							<Plus size={20} />
							Offline Order
						</button>
					</div>

					{/* Search and Filters */}
					<div className="px-4 py-3 flex items-center justify-between flex-wrap gap-4">
						<div className="flex-1 max-w-lg min-w-[300px]">
							<div className="flex items-stretch h-12 rounded-lg border border-[#E2D8D4] bg-white overflow-hidden">
								<div className="flex items-center justify-center pl-4 text-[#B35E3F]">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<circle cx="11" cy="11" r="8" strokeWidth="2" />
										<path
											d="m21 21-4.35-4.35"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</div>
								<input
									type="text"
									className="flex-1 bg-transparent px-4 text-text-main placeholder:text-gray-400 focus:outline-none text-base"
									placeholder="Search by Order ID, Customer Name..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex gap-3 flex-wrap">
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="h-12 bg-white border border-[#E2D8D4] text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block p-2.5"
							>
								<option value="All">All Status</option>
								<option value="pending">Pending</option>
								<option value="processing">Processing</option>
								<option value="shipped">Shipped</option>
								<option value="delivered">Delivered</option>
								<option value="paid">Paid</option>
								<option value="cancelled">Cancelled</option>
							</select>

							<div className="flex items-center gap-2">
								<div className="relative">
									<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
										<Calendar className="w-4 h-4 text-gray-500" />
									</div>
									<input
										type="date"
										className="bg-white border border-[#E2D8D4] text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full ps-10 p-2.5 h-12"
										placeholder="Start Date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
									/>
								</div>
								<span className="text-gray-500">to</span>
								<div className="relative">
									<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
										<Calendar className="w-4 h-4 text-gray-500" />
									</div>
									<input
										type="date"
										className="bg-white border border-[#E2D8D4] text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full ps-10 p-2.5 h-12"
										placeholder="End Date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="px-4 py-3">
						<div className="overflow-hidden rounded-lg border border-[#e2d8d4] bg-background-light">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-background-light border-b border-[#e2d8d4]">
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Order ID
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Customer
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Date
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Total
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Status
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Actions
											</th>
											<th className="px-4 py-3 text-left text-card-border text-sm font-bold">
												Invoice
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-[#e2d8d4]">
										{orders.length > 0 ? (
											orders.map((order) => (
												<tr
													key={order.order_id}
													className="hover:bg-primary/5 transition-colors"
												>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														#{order.order_id}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														{order.customer}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														{new Date(order.date).toLocaleString()}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														₹{order.total}
													</td>
													<td className="h-[72px] px-4 py-2">
														<select
															value={order.status}
															onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
															className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border-none focus:ring-1 focus:ring-offset-1 cursor-pointer ${getStatusColor(
																order.status
															)}`}
															onClick={(e) => e.stopPropagation()}
														>
															<option value="pending" className="bg-white text-gray-800">Pending</option>
															<option value="processing" className="bg-white text-gray-800">Processing</option>
															<option value="shipped" className="bg-white text-gray-800">Shipped</option>
															<option value="delivered" className="bg-white text-gray-800">Delivered</option>
															<option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
															<option value="paid" className="bg-white text-gray-800">Paid</option>
														</select>
													</td>
													<td className="h-[72px] px-4 py-2">
														<div className="flex flex-wrap items-center gap-2">
															<button 
																onClick={() => handleViewDetails(order.order_id)}
																className="text-[#B35E3F] hover:text-card-border text-xs font-bold transition-colors flex items-center gap-1"
															>
																<Eye size={14} /> View
															</button>
															<button
																onClick={() => handleNotify(order)}
																className="flex items-center gap-1 text-[#B35E3F] hover:text-card-border text-xs font-bold transition-colors"
															>
																<Send size={14} />
																<span>Notify</span>
															</button>
															<button
																onClick={() => handleTracking(order)}
																className="flex items-center gap-1 text-[#B35E3F] hover:text-card-border text-xs font-bold transition-colors"
															>
																<Truck size={14} />
																<span>Track</span>
															</button>
														</div>
													</td>
													<td className="h-[72px] px-4 py-2">
														<button
															onClick={() => handleViewInvoice(order.order_id)}
															className="text-[#B35E3F] hover:text-card-border text-xs font-bold transition-colors underline mb-1 block"
														>
															View Invoice
														</button>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={7} className="text-center py-4 text-gray-500">
													No orders found.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							<div className="flex justify-center items-center mt-6 pb-6">
								<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
									<button 
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
									>
										<ChevronLeft size={20} />
									</button>
									<span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300">
										Page {currentPage} of {totalPages}
									</span>
									<button 
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages}
										className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
									>
										<ChevronRight size={20} />
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Tracking Modal */}
			{showTrackingModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-card-border">
								Add Tracking Info
							</h2>
							<button
								onClick={() => setShowTrackingModal(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X size={24} />
							</button>
						</div>
						<div className="mb-4">
							<label className="block mb-2 text-sm font-medium text-text-main">Tracking ID</label>
							<input
								type="text"
								className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
								value={trackingId}
								onChange={(e) => setTrackingId(e.target.value)}
							/>
						</div>
						<div className="mb-6">
							<label className="block mb-2 text-sm font-medium text-text-main">Tracking URL</label>
							<input
								type="text"
								className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
								value={trackingUrl}
								onChange={(e) => setTrackingUrl(e.target.value)}
							/>
						</div>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setShowTrackingModal(false)}
								className="px-6 py-2 rounded-lg text-text-main bg-gray-200 hover:bg-gray-300 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleSaveTracking}
                                disabled={isSavingTracking}
								className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors disabled:opacity-50"
							>
								{isSavingTracking ? "Saving..." : "Save"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Notifications Modal */}
			{showNotificationsModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 relative">
						<button
							onClick={() => setShowNotificationsModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
						<h2 className="text-2xl font-bold text-card-border mb-6">Order Notifications</h2>
						<div className="space-y-4 max-h-[60vh] overflow-y-auto">
							{adminOrderNotifications && adminOrderNotifications.length > 0 ? (
								adminOrderNotifications.map((notif: AdminOrderNotificationItem, idx: number) => (
									<div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
										<div className="flex justify-between items-start mb-1">
											<h3 className="font-bold text-[#261d1a]">{notif.title || "Notification"}</h3>
											<span className="text-xs text-gray-500">{notif.created_at || "Just now"}</span>
										</div>
										<p className="text-sm text-text-main">{notif.content || "No content"}</p>
									</div>
								))
							) : (
								<p className="text-gray-500 text-center py-4">No notifications found.</p>
							)}
						</div>
						<div className="mt-6 flex justify-end">
							<button
								onClick={() => setShowNotificationsModal(false)}
								className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Notification Modal (Email) */}
			{showNotifyModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-background-light rounded-lg shadow-xl p-8 w-full max-w-md m-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-card-border">
								Send Notification
							</h2>
							<button
								onClick={() => setShowNotifyModal(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						<div className="mb-6">
							<label
								className="block mb-2 text-sm font-medium text-text-main"
								htmlFor="notification-type"
							>
								Notification Type
							</label>
							<select
								id="notification-type"
								className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
								value={notificationType}
								onChange={(e) => setNotificationType(e.target.value)}
							>
								<option value="">Choose a notification type</option>
								<option value="confirmation">Order Confirmation</option>
								<option value="shipment">Shipment Confirmation</option>
								<option value="delivery">Delivery Confirmation</option>
							</select>
						</div>

						<div className="flex justify-end gap-4">
							<button
								onClick={() => setShowNotifyModal(false)}
								className="px-6 py-2 rounded-lg text-text-main bg-gray-200 hover:bg-gray-300 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleSendNotification}
                                disabled={isSending}
								className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors disabled:opacity-50"
							>
								{isSending ? "Sending..." : "Send"}
							</button>
						</div>
					</div>
				</div>
			)}
			{showInvoiceModal && adminOrderInvoice && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 relative">
						<button
							onClick={() => setShowInvoiceModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
						
						<h2 className="text-2xl font-black text-card-border mb-6">Invoice #{adminOrderInvoice.invoice_id}</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-bold text-[#261d1a] mb-2">Customer</h3>
								<p className="text-text-main"><span className="font-semibold">Name:</span> {adminOrderInvoice.customer.name}</p>
								<p className="text-text-main"><span className="font-semibold">Email:</span> {adminOrderInvoice.customer.email}</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-bold text-[#261d1a] mb-2">Payment Info</h3>
								<p className="text-text-main"><span className="font-semibold">Method:</span> {adminOrderInvoice.payment.method}</p>
								<p className="text-text-main"><span className="font-semibold">Status:</span> {adminOrderInvoice.payment.status}</p>
								<p className="text-text-main"><span className="font-semibold">Transaction ID:</span> {adminOrderInvoice.payment.txn_id}</p>
							</div>
						</div>

						<div className="mb-6">
							<h3 className="text-lg font-bold text-[#261d1a] mb-3">Items</h3>
							<div className="overflow-x-auto border rounded-lg">
								<table className="w-full text-sm text-left">
									<thead className="bg-gray-100 text-[#261d1a] uppercase">
										<tr>
											<th className="px-4 py-3">Title</th>
											<th className="px-4 py-3 text-right">Price</th>
											<th className="px-4 py-3 text-center">Qty</th>
											<th className="px-4 py-3 text-right">Total</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{adminOrderInvoice.items.map((item: any, idx: number) => (
											<tr key={idx} className="bg-white hover:bg-gray-50">
												<td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
												<td className="px-4 py-3 text-right">₹{item.price}</td>
												<td className="px-4 py-3 text-center">{item.quantity}</td>
												<td className="px-4 py-3 text-right font-bold">₹{item.total}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="flex justify-end border-t pt-4">
							<div className="w-full max-w-xs space-y-2">
								<div className="flex justify-between text-text-main">
									<span>Subtotal:</span>
									<span>₹{adminOrderInvoice.summary.subtotal}</span>
								</div>
								<div className="flex justify-between text-text-main">
									<span>Tax:</span>
									<span>₹{adminOrderInvoice.summary.tax}</span>
								</div>
								<div className="flex justify-between text-card-border font-bold text-lg border-t pt-2">
									<span>Total:</span>
									<span>₹{adminOrderInvoice.summary.total}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Detail Modal */}
			{showDetailModal && adminOrderDetail && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 relative">
						<button
							onClick={() => setShowDetailModal(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
						
						<h2 className="text-2xl font-black text-card-border mb-6">Order Details #{adminOrderDetail.order_id}</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-bold text-[#261d1a] mb-2">Customer Info</h3>
								<p className="text-text-main"><span className="font-semibold">Name:</span> {adminOrderDetail.customer.name}</p>
								<p className="text-text-main"><span className="font-semibold">Email:</span> {adminOrderDetail.customer.email}</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-lg">
								<h3 className="text-lg font-bold text-[#261d1a] mb-2">Order Info</h3>
								<p className="text-text-main"><span className="font-semibold">Status:</span> 
									<span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(adminOrderDetail.status)}`}>
										{adminOrderDetail.status}
									</span>
								</p>
								<p className="text-text-main"><span className="font-semibold">Date:</span> {new Date(adminOrderDetail.created_at).toLocaleDateString()}</p>
							</div>
						</div>

						<div className="mb-6">
							<h3 className="text-lg font-bold text-[#261d1a] mb-3">Items</h3>
							<div className="overflow-x-auto border rounded-lg">
								<table className="w-full text-sm text-left">
									<thead className="bg-gray-100 text-[#261d1a] uppercase">
										<tr>
											<th className="px-4 py-3">Book</th>
											<th className="px-4 py-3 text-right">Price</th>
											<th className="px-4 py-3 text-center">Qty</th>
											<th className="px-4 py-3 text-right">Total</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{adminOrderDetail.items.map((item: any, idx: number) => (
											<tr key={idx} className="bg-white hover:bg-gray-50">
												<td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
												<td className="px-4 py-3 text-right">₹{item.price}</td>
												<td className="px-4 py-3 text-center">{item.quantity}</td>
												<td className="px-4 py-3 text-right font-bold">₹{item.total}</td>
											</tr>
										))}
									</tbody>
									<tfoot className="bg-gray-50 font-bold text-[#261d1a]">
										<tr>
											<td colSpan={3} className="px-4 py-3 text-right">Total Amount</td>
											<td className="px-4 py-3 text-right">
												₹{adminOrderDetail.items.reduce((acc: number, item: any) => acc + item.total, 0)}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
						
						<div className="flex justify-end">
							<button
								onClick={() => handleDownloadInvoice(adminOrderDetail.order_id)}
								className="flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors"
							>
								<Download size={18} />
								Download Invoice
							</button>
						</div>
					</div>
				</div>
			)}
            
            {/* Offline Order Modal */}
            {showOfflineOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 relative">
                        <button
                            onClick={() => setShowOfflineOrderModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-card-border mb-6">Create Offline Order</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-text-main">User ID</label>
                                <input
                                    type="text"
                                    className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
                                    value={offlineOrderForm.user_id}
                                    onChange={(e) => setOfflineOrderForm({...offlineOrderForm, user_id: e.target.value})}
                                    placeholder="e.g. 6"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-text-main">Address ID</label>
                                <input
                                    type="text"
                                    className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
                                    value={offlineOrderForm.address_id}
                                    onChange={(e) => setOfflineOrderForm({...offlineOrderForm, address_id: e.target.value})}
                                    placeholder="e.g. 3"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-text-main">Items</label>
                            <div className="space-y-3">
                                {offlineOrderForm.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Book</label>
                                            <BookSearchSelect
                                                books={inventoryList || []}
                                                value={item.book_id}
                                                onChange={(val) => handleOfflineItemChange(idx, 'book_id', val)}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-xs text-gray-500 mb-1">Qty</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="bg-white border border-gray-300 text-text-main text-sm rounded-lg block w-full p-2"
                                                value={item.quantity}
                                                onChange={(e) => handleOfflineItemChange(idx, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>
                                        {offlineOrderForm.items.length > 1 && (
                                            <button 
                                                onClick={() => handleRemoveOfflineItem(idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleAddOfflineItem}
                                className="mt-2 text-sm text-[#B35E3F] font-bold flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-text-main">Payment Mode</label>
                            <select
                                className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
                                value={offlineOrderForm.payment_mode}
                                onChange={(e) => setOfflineOrderForm({...offlineOrderForm, payment_mode: e.target.value})}
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-text-main">Notes</label>
                            <textarea
                                className="bg-white border border-gray-300 text-text-main text-sm rounded-lg focus:ring-[#B35E3F] focus:border-[#B35E3F] block w-full p-2.5"
                                rows={3}
                                value={offlineOrderForm.notes}
                                onChange={(e) => setOfflineOrderForm({...offlineOrderForm, notes: e.target.value})}
                                placeholder="Payment notes..."
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowOfflineOrderModal(false)}
                                className="px-6 py-2 rounded-lg text-text-main bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOfflineOrder}
                                disabled={isCreatingOfflineOrder}
                                className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors disabled:opacity-50"
                            >
                                {isCreatingOfflineOrder ? "Creating..." : "Create Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
		</div>
	);
};

export default OrdersPage;
