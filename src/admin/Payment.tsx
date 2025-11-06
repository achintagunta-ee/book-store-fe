import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

interface Payment {
	orderId: string;
	customerName: string;
	date: string;
	amount: string;
	status: "Complete" | "Pending";
}

// Payments Page Component
const PaymentsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<
		"All" | "Complete" | "Pending"
	>("All");
	const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility
	const [currentPage] = useState(1);
	const totalPages = 10;

	const payments: Payment[] = [
		{
			orderId: "#12345",
			customerName: "John Doe",
			date: "2023-10-27",
			amount: "$45.00",
			status: "Complete",
		},
		{
			orderId: "#12346",
			customerName: "Jane Smith",
			date: "2023-10-26",
			amount: "$32.50",
			status: "Pending",
		},
		{
			orderId: "#12347",
			customerName: "Sam Wilson",
			date: "2023-10-25",
			amount: "$120.00",
			status: "Complete",
		},
		{
			orderId: "#12348",
			customerName: "Alice Johnson",
			date: "2023-10-24",
			amount: "$15.75",
			status: "Complete",
		},
		{
			orderId: "#12349",
			customerName: "Bob Williams",
			date: "2023-10-23",
			amount: "$89.99",
			status: "Pending",
		},
	];

	const filteredPayments = payments.filter((payment) => {
		const matchesSearch =
			payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			filterStatus === "All" || payment.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

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
						<div className="flex items-center gap-4">
							<button className="flex items-center gap-2 px-4 py-2 border border-card-border/30 rounded-lg text-sm hover:bg-primary/10 text-text-main transition-colors">
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
									placeholder="Search by customer name or order ID"
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
										</tr>
									</thead>
									<tbody>
										{filteredPayments.map((payment) => (
											<tr
												key={payment.orderId}
												className="border-t border-card-border/20 hover:bg-primary/5 transition-colors"
											>
												<td className="h-[72px] px-4 py-2 text-text-main/80 text-sm">
													{payment.orderId}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{payment.customerName}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main/80 text-sm">
													{payment.date}
												</td>
												<td className="h-[72px] px-4 py-2 text-text-main text-sm">
													{payment.amount}
												</td>
												<td className="h-[72px] px-4 py-2 text-sm">
													<span
														className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
															payment.status === "Complete"
																? "bg-green-600/20 text-green-600"
																: "bg-amber-700/20 text-amber-700"
														}`}
													>
														{payment.status}
													</span>
												</td>
											</tr>
										))}
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
							<button className="flex items-center justify-center px-4 py-2 border border-card-border/30 rounded-lg text-sm text-text-main hover:bg-primary/10 transition-colors">
								Previous
							</button>
							<button className="flex items-center justify-center px-4 py-2 border border-card-border/30 rounded-lg text-sm text-text-main hover:bg-primary/10 transition-colors">
								Next
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default PaymentsPage;
