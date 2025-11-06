import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Send, X, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface Order {
	orderId: string;
	customer: string;
	date: string;
	total: string;
	status: "Shipped" | "Processing" | "Delivered" | "Pending" | "Canceled";
}

const OrdersPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [notificationType, setNotificationType] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const orders: Order[] = [
		{
			orderId: "#12345",
			customer: "John Doe",
			date: "2023-10-27",
			total: "$125.00",
			status: "Shipped",
		},
		{
			orderId: "#12346",
			customer: "Jane Smith",
			date: "2023-10-27",
			total: "$89.50",
			status: "Processing",
		},
		{
			orderId: "#12347",
			customer: "Peter Jones",
			date: "2023-10-26",
			total: "$45.00",
			status: "Delivered",
		},
		{
			orderId: "#12348",
			customer: "Mary Williams",
			date: "2023-10-26",
			total: "$210.00",
			status: "Pending",
		},
		{
			orderId: "#12349",
			customer: "David Brown",
			date: "2023-10-25",
			total: "$76.25",
			status: "Canceled",
		},
	];

	const getStatusColor = (status: Order["status"]) => {
		const colors = {
			Shipped: "bg-green-100 text-green-800",
			Processing: "bg-blue-100 text-blue-800",
			Delivered: "bg-gray-200 text-gray-800",
			Pending: "bg-yellow-100 text-yellow-800",
			Canceled: "bg-red-100 text-red-800",
		};
		return colors[status];
	};

	const handleNotify = (order: Order) => {
		setSelectedOrder(order);
		setShowModal(true);
	};

	const handleSendNotification = () => {
		console.log(
			"Sending notification:",
			notificationType,
			"for order:",
			selectedOrder?.orderId
		);
		setShowModal(false);
		setNotificationType("");
	};

	const filteredOrders = orders.filter(
		(order) =>
			order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
						<div className="flex-1 max-w-lg">
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

						<div className="flex gap-3">
							<button className="flex h-8 items-center gap-2 rounded-lg bg-white border border-[#E2D8D4] px-4 hover:bg-primary/10 transition-colors">
								<p className="text-text-main text-sm font-medium">
									Filter by Status
								</p>
								<svg
									className="w-4 h-4 text-text-main"
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
							<button className="flex h-8 items-center gap-2 rounded-lg bg-white border border-[#E2D8D4] px-4 hover:bg-primary/10 transition-colors">
								<p className="text-text-main text-sm font-medium">
									Filter by Date
								</p>
								<svg
									className="w-4 h-4 text-text-main"
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
										{filteredOrders.map((order) => (
											<tr
												key={order.orderId}
												className="hover:bg-primary/5 transition-colors"
											>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{order.orderId}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{order.customer}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{order.date}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{order.total}
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
														<button className="text-[#B35E3F] hover:text-card-border text-sm font-bold transition-colors">
															View Details
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
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							<div className="flex justify-center items-center mt-6 pb-6">
								<nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
									<button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
										<ChevronLeft size={20} />
									</button>
									<button className="relative z-10 inline-flex items-center bg-card-border/10 px-4 py-2 text-sm font-semibold text-card-border">
										1
									</button>
									<button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
										2
									</button>
									<button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:inline-flex transition-colors">
										3
									</button>
									<span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300">
										...
									</span>
									<button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:inline-flex transition-colors">
										8
									</button>
									<button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
										<ChevronRight size={20} />
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Notification Modal */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-background-light rounded-lg shadow-xl p-8 w-full max-w-md m-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-card-border">
								Send Notification
							</h2>
							<button
								onClick={() => setShowModal(false)}
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
								onClick={() => setShowModal(false)}
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
		</div>
	);
};

export default OrdersPage;
