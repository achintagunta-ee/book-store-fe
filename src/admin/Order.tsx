import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Send, X, Menu, Eye, Calendar, Download } from "lucide-react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import { getAdminOrdersThunk, getAdminOrderDetailsThunk, notifyCustomerThunk } from "../redux/slice/authSlice";
import { downloadOrderInvoiceApi, type AdminOrder } from "../redux/utilis/authApi";

const OrdersPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { adminOrders, adminOrderDetail } = useSelector((state: RootState) => state.auth);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	
	const [showNotifyModal, setShowNotifyModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
	const [notificationType, setNotificationType] = useState(""); // Kept for UI, but API doesn't use it yet based on spec
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	
	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			fetchOrders();
		}, 500);
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
			await dispatch(notifyCustomerThunk(selectedOrder.order_id));
			setShowNotifyModal(false);
			setNotificationType("");
			alert("Customer notified successfully!");
		}
	};

	const handleViewDetails = async (orderId: number) => {
		await dispatch(getAdminOrderDetailsThunk(orderId));
		setShowDetailModal(true);
	};
	
	const handleDownloadInvoice = async (orderId: number) => {
		try {
			const text = await downloadOrderInvoiceApi(orderId);
			// Create a blob and download it
			const blob = new Blob([text], { type: "text/plain" });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `invoice_${orderId}.txt`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to download invoice", error);
			alert("Failed to download invoice");
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
							Orders / Notifications
						</h1>
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
														{order.customer_name}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														{order.date}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														₹{order.total_amount}
													</td>
													<td className="h-[72px] px-4 py-2">
														<span
															className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
																order.status
															)}`}
														>
															{order.status}
														</span>
													</td>
													<td className="h-[72px] px-4 py-2">
														<div className="flex items-center gap-2">
															<button 
																onClick={() => handleViewDetails(order.order_id)}
																className="text-[#B35E3F] hover:text-card-border text-sm font-bold transition-colors flex items-center gap-1"
															>
																<Eye size={16} /> View
															</button>
															<button
																onClick={() => handleNotify(order)}
																className="flex items-center gap-1 text-[#B35E3F] hover:text-card-border text-sm font-bold transition-colors"
															>
																<Send size={16} />
																<span>Notify</span>
															</button>
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={6} className="text-center py-4 text-gray-500">
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

			{/* Notification Modal */}
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
								className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors"
							>
								Send
							</button>
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
										{adminOrderDetail.items.map((item, idx) => (
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
												₹{adminOrderDetail.items.reduce((acc, item) => acc + item.total, 0)}
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
		</div>
	);
};

export default OrdersPage;
