import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

interface Book {
	id: number;
	title: string;
	author: string;
	stock: number;
	status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventoryDashboard: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const books: Book[] = [
		{
			id: 1,
			title: "The Midnight Library",
			author: "Matt Haig",
			stock: 15,
			status: "In Stock",
		},
		{
			id: 2,
			title: "The Four Winds",
			author: "Kristin Hannah",
			stock: 8,
			status: "Low Stock",
		},
		{
			id: 3,
			title: "Klara and the Sun",
			author: "Kazuo Ishiguro",
			stock: 22,
			status: "In Stock",
		},
		{
			id: 4,
			title: "Project Hail Mary",
			author: "Andy Weir",
			stock: 0,
			status: "Out of Stock",
		},
		{
			id: 5,
			title: "The Push",
			author: "Ashley Audrain",
			stock: 3,
			status: "Low Stock",
		},
	];

	const filteredBooks = books.filter(
		(book) =>
			book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			book.author.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "In Stock":
				return "bg-green-100 text-green-800";
			case "Low Stock":
				return "bg-orange-100 text-orange-700";
			case "Out of Stock":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRowColor = (status: string) => {
		return status === "Low Stock" ? "bg-orange-50" : "";
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
							<p className="text-[#5c2e2e] text-3xl font-bold">1,234</p>
						</div>
						<div className="rounded-lg p-6 border border-[#8E5A4F] bg-orange-50">
							<p className="text-[#261d1a] text-base font-medium mb-2">
								Low Stock Items
							</p>
							<p className="text-[#8E5A4F] text-3xl font-bold">56</p>
						</div>
						<div className="rounded-lg p-6 border border-[#e2d8d4] bg-white">
							<p className="text-[#261d1a] text-base font-medium mb-2">
								Out of Stock Items
							</p>
							<p className="text-[#5c2e2e] text-3xl font-bold">12</p>
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
					<div className="overflow-x-auto rounded-lg border border-[#e2d8d4]">
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
										Current Stock
									</th>
									<th className="px-6 py-4 text-left text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-4 text-right text-[#5c2e2e] text-sm font-semibold uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#e2d8d4]">
								{filteredBooks.map((book) => (
									<tr key={book.id} className={getRowColor(book.status)}>
										<td className="px-6 py-4 whitespace-nowrap text-[#261d1a]">
											{book.title}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-[#8E5A4F]">
											{book.author}
										</td>
										<td
											className={`px-6 py-4 whitespace-nowrap font-semibold ${
												book.status === "Low Stock"
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
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<a
												href="#"
												className="text-[#B35E3F] hover:text-[#5c2e2e] text-sm font-medium"
											>
												Edit
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
};

export default InventoryDashboard;
