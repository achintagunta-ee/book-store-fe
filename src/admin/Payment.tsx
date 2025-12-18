import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store/store";
import {
  getAdminPaymentsThunk,
  getAdminPaymentByIdThunk,
  getInvoiceThunk,
  getPaymentReceiptThunk,
} from "../redux/slice/authSlice";

// Payments Page Component
const PaymentsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		adminPayments,
		adminPaymentsStatus,
		adminPaymentDetail,
		adminPaymentDetailStatus,
		invoice,
		invoiceStatus,
		invoiceError,
		receipt,
		receiptStatus,
		receiptError,
	} = useSelector((state: RootState) => state.auth);

	const [showInvoice, setShowInvoice] = useState(false);
	const [showReceipt, setShowReceipt] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"All" | "Complete" | "Pending"
	>("All");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [showDateFilter, setShowDateFilter] = useState(false);

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);

	// Debounce search query
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 500);
		return () => clearTimeout(handler);
	}, [searchQuery]);

	useEffect(() => {
		const statusParam =
			filterStatus === "Complete"
				? "success"
				: filterStatus === "Pending"
				? "pending"
				: undefined;

		const isIdSearch = /^\d+$/.test(debouncedQuery);

		if (isIdSearch) {
			// Search by ID
			dispatch(getAdminPaymentByIdThunk(parseInt(debouncedQuery)));
		} else {
			// Search by Name or List
			const nameParts = debouncedQuery.trim().split(" ");
			const firstName = nameParts[0] || undefined;
			const lastName = nameParts.slice(1).join(" ") || undefined;

			dispatch(
				getAdminPaymentsThunk({
					page: currentPage,
					status: statusParam,
					start_date: startDate || undefined,
					end_date: endDate || undefined,
					first_name: firstName,
					last_name: lastName,
				})
			);
		}
	}, [dispatch, currentPage, filterStatus, startDate, endDate, debouncedQuery]);

	const totalPages = adminPayments?.total_pages || 1;

	// Determine which list to show
	let paymentsList = adminPayments?.results || [];

	if (/^\d+$/.test(debouncedQuery) && adminPaymentDetail) {
		// Map detail to list item format
		paymentsList = [
			{
				payment_id: adminPaymentDetail.payment_id,
				txn_id: adminPaymentDetail.txn_id,
				order_id: adminPaymentDetail.order_id,
				amount: adminPaymentDetail.amount,
				status: adminPaymentDetail.status,
				method: adminPaymentDetail.method,
				customer_name: adminPaymentDetail.customer.name,
				created_at: adminPaymentDetail.created_at,
			},
		];
	}

	const isLoading =
		adminPaymentsStatus === "loading" || adminPaymentDetailStatus === "loading";

	const handleViewInvoice = (orderId: number) => {
		dispatch(getInvoiceThunk(orderId));
		setShowInvoice(true);
	};

	const handleViewReceipt = (paymentId: number) => {
		dispatch(getPaymentReceiptThunk(paymentId));
		setShowReceipt(true);
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<div className="flex h-screen w-full bg-background-light">
			<Sidebar sidebarOpen={sidebarOpen} />{" "}
			{/* Pass sidebarOpen state to Sidebar */}
			<main className="flex-1 px-10 py-8 overflow-y-auto">
				<div className="flex flex-col max-w-full">
					{/* Header */}
					<div className="flex flex-wrap justify-between items-center gap-3 p-4">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors"
						>
							{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
						<h1 className="text-text-main text-4xl font-bold leading-tight tracking-tight min-w-72">
							Payments
						</h1>
						<div className="flex flex-col items-end gap-2">
							<button
								onClick={() => setShowDateFilter(!showDateFilter)}
								className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
									showDateFilter
										? "bg-primary/10 border-primary text-primary"
										: "border-card-border/30 text-text-main hover:bg-primary/10"
								}`}
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<rect
										x="3"
										y="4"
										width="18"
										height="18"
										rx="2"
										ry="2"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<line
										x1="16"
										y1="2"
										x2="16"
										y2="6"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<line
										x1="8"
										y1="2"
										x2="8"
										y2="6"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<line
										x1="3"
										y1="10"
										x2="21"
										y2="10"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								Filter by Date
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<polyline
										points="6 9 12 15 18 9"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							{showDateFilter && (
								<div className="flex gap-2 items-center bg-white p-2 rounded shadow border border-gray-200 absolute mt-12 z-10">
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="border p-1 rounded text-sm"
									/>
									<span className="text-gray-500">-</span>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="border p-1 rounded text-sm"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Search and Filter */}
					<div className="flex flex-wrap items-center justify-between gap-4 p-4">
						<div className="flex-1 min-w-[300px]">
							<div className="flex items-stretch h-12 rounded-lg border border-card-border/30 bg-white overflow-hidden">
								<div className="flex items-center justify-center pl-4 text-text-main">
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
									className="flex-1 bg-transparent px-4 text-text-main placeholder:text-text-main/60 focus:outline-none text-sm"
									placeholder="Search only by Payment ID or Customer full name"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div className="flex gap-3 overflow-x-auto">
							<button
								onClick={() => setFilterStatus("All")}
								className={`flex h-10 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${
									filterStatus === "All"
										? "bg-primary/20 text-primary"
										: "bg-transparent border border-card-border/30 text-text-main hover:bg-primary/10"
								}`}
							>
								All
							</button>
							<button
								onClick={() => setFilterStatus("Complete")}
								className={`flex h-10 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${
									filterStatus === "Complete"
										? "bg-primary/20 text-primary"
										: "bg-transparent border border-card-border/30 text-text-main hover:bg-primary/10"
								}`}
							>
								Complete
							</button>
							<button
								onClick={() => setFilterStatus("Pending")}
								className={`flex h-10 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${
									filterStatus === "Pending"
										? "bg-primary/20 text-primary"
										: "bg-transparent border border-card-border/30 text-text-main hover:bg-primary/10"
								}`}
							>
								Pending
							</button>
						</div>
					</div>

					{/* Table */}
					<div className="px-4 py-3">
						<div className="overflow-hidden rounded-xl border border-card-border/20 bg-white">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-primary/5">
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Payment ID
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Order ID
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Customer Name
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Date
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Amount
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Status
											</th>
											<th className="px-4 py-3 text-left text-text-main text-sm font-medium">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{isLoading ? (
											<tr>
												<td colSpan={7} className="text-center py-4">
													Loading...
												</td>
											</tr>
										) : paymentsList.length === 0 ? (
											<tr>
												<td colSpan={7} className="text-center py-4">
													No payments found
												</td>
											</tr>
										) : (
											paymentsList.map((payment) => (
												<tr
													key={payment.payment_id}
													className="border-t border-card-border/20 hover:bg-primary/5 transition-colors"
												>
													<td className="h-[72px] px-4 py-2 text-text-main/80 text-sm">
														#{payment.payment_id}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main/80 text-sm">
														#{payment.order_id}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														{payment.customer_name}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main/80 text-sm">
														{new Date(payment.created_at).toLocaleDateString()}
													</td>
													<td className="h-[72px] px-4 py-2 text-text-main text-sm">
														${payment.amount.toFixed(2)}
													</td>
													<td className="h-[72px] px-4 py-2 text-sm">
														<div className="flex flex-col gap-1 items-start">
															<span
																className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
																	payment.status === "success"
																		? "bg-green-600/20 text-green-600"
																		: "bg-amber-700/20 text-amber-700"
																}`}
															>
																{payment.status === "success"
																	? "Complete"
																	: payment.status}
															</span>
														</div>
													</td>
													<td className="h-[72px] px-4 py-2 text-sm">
														<div className="flex flex-wrap gap-2">
															<button
																onClick={() => handleViewInvoice(payment.order_id)}
																className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
															>
																Invoice
															</button>
															{payment.status === "success" && (
																<button
																	onClick={() => handleViewReceipt(payment.payment_id)}
																	className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition-colors"
																>
																	Receipt
																</button>
															)}
														</div>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Pagination */}
					<div className="flex justify-between items-center p-4 mt-4">
						<p className="text-sm text-text-main/70">
							Page {currentPage} of {totalPages}
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="flex items-center justify-center px-4 py-2 border border-card-border/30 rounded-lg text-sm text-text-main hover:bg-primary/10 transition-colors disabled:opacity-50"
							>
								Previous
							</button>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="flex items-center justify-center px-4 py-2 border border-card-border/30 rounded-lg text-sm text-text-main hover:bg-primary/10 transition-colors disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			</main>
			{/* Invoice Modal */}
			{showInvoice && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
						<div className="flex justify-between items-center mb-6 border-b pb-4">
							<h2 className="text-2xl font-bold text-text-main">Invoice Details</h2>
							<button onClick={() => setShowInvoice(false)} className="text-gray-500 hover:text-gray-700">
								<X size={24} />
							</button>
						</div>
						{invoiceStatus === "loading" ? (
							<div className="flex justify-center py-8"><p>Loading invoice data...</p></div>
						) : invoice ? (
							<div className="space-y-6">
								<div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
									<div>
										<p className="text-xs uppercase text-gray-500 font-semibold mb-1">Invoice ID</p>
										<p className="font-medium text-lg">{invoice.invoice_id}</p>
									</div>
									<div>
										<p className="text-xs uppercase text-gray-500 font-semibold mb-1">Date</p>
										<p className="font-medium">{new Date(invoice.created_at).toLocaleString()}</p>
									</div>
									<div>
										<p className="text-xs uppercase text-gray-500 font-semibold mb-1">Order ID</p>
										<p className="font-medium">#{invoice.order_id}</p>
									</div>
									<div>
										<p className="text-xs uppercase text-gray-500 font-semibold mb-1">Status</p>
										<p className="font-medium capitalize px-2 py-0.5 inline-block rounded bg-white border border-gray-200 text-sm">
											{invoice.status}
										</p>
									</div>
								</div>
								
								<div className="border rounded-lg overflow-hidden">
									<table className="w-full">
										<thead className="bg-gray-100">
											<tr>
												<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Item</th>
												<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Qty</th>
												<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
												<th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-100">
											{invoice.items.map((item, idx) => (
												<tr key={idx}>
													<td className="py-3 px-4 text-sm">{item.title}</td>
													<td className="text-right py-3 px-4 text-sm text-gray-600">{item.quantity}</td>
													<td className="text-right py-3 px-4 text-sm text-gray-600">${item.price.toFixed(2)}</td>
													<td className="text-right py-3 px-4 text-sm font-medium">${item.line_total.toFixed(2)}</td>
												</tr>
											))}
										</tbody>
										<tfoot className="bg-gray-50">
											<tr>
												<td colSpan={3} className="text-right py-2 px-4 text-sm font-medium text-gray-600">Subtotal:</td>
												<td className="text-right py-2 px-4 text-sm font-medium">${invoice.subtotal.toFixed(2)}</td>
											</tr>
											<tr>
												<td colSpan={3} className="text-right py-2 px-4 text-sm font-medium text-gray-600">Tax:</td>
												<td className="text-right py-2 px-4 text-sm font-medium">${invoice.tax.toFixed(2)}</td>
											</tr>
											<tr className="border-t border-gray-200">
												<td colSpan={3} className="text-right py-3 px-4 font-bold text-gray-900">Total:</td>
												<td className="text-right py-3 px-4 font-bold text-gray-900 text-lg">${invoice.total.toFixed(2)}</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</div>
						) : (
							<div className="text-center py-8 text-red-500">
								<p>Failed to load invoice data or no data available.</p>
								{invoiceError && <p className="text-sm mt-2 text-gray-500">{invoiceError}</p>}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Receipt Modal */}
			{showReceipt && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold text-text-main">Payment Receipt</h2>
							<button onClick={() => setShowReceipt(false)} className="text-gray-500 hover:text-gray-700">
								<X size={24} />
							</button>
						</div>
						{receiptStatus === "loading" ? (
							<div className="flex justify-center py-8"><p>Loading receipt...</p></div>
						) : receipt ? (
							<div className="space-y-6">
								<div className="p-6 bg-green-50 rounded-xl text-center border border-green-100">
									<p className="text-4xl font-bold text-green-600 mb-1">${receipt.amount.toFixed(2)}</p>
									<div className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded text-sm font-medium">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
										Paid Successfully
									</div>
								</div>
								
								<div className="space-y-3 pt-2">
									<div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
										<span className="text-sm text-gray-500">Receipt ID</span>
										<span className="font-mono text-sm font-medium text-gray-700">{receipt.receipt_id}</span>
									</div>
									<div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
										<span className="text-sm text-gray-500">Transaction ID</span>
										<span className="font-mono text-sm font-medium text-gray-700 text-right truncate max-w-[150px]" title={receipt.txn_id}>{receipt.txn_id}</span>
									</div>
									<div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
										<span className="text-sm text-gray-500">Order ID</span>
										<span className="font-medium text-sm text-gray-700">#{receipt.order_id}</span>
									</div>
									<div className="flex justify-between items-center pb-2 border-b border-dashed border-gray-200">
										<span className="text-sm text-gray-500">Date Paid</span>
										<span className="font-medium text-sm text-gray-700">{new Date(receipt.paid_at).toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-500">Payment Method</span>
										<span className="capitalize font-medium text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{receipt.method}</span>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center py-8 text-red-500">
								<p>Failed to load receipt data.</p>
								{receiptError && <p className="text-sm mt-2 text-gray-500">{receiptError}</p>}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentsPage;
