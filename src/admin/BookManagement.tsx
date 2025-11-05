import React, { useState } from "react";
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
import Sidebar from "./Sidebar";

interface Book {
	id: number;
	title: string;
	category: string;
	price: number;
	stock: number;
	coverUrl: string;
}

const BooksManagement: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] =
		useState("Filter by Category");
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

	const books: Book[] = [
		{
			id: 1,
			title: "The Midnight Library",
			category: "Fiction",
			price: 15.99,
			stock: 120,
			coverUrl:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuBGQIA5wlzfM3G6gBWX2OHujeN7lCB6rM3g4fW5NzTr8AEvLEkVxN-i560MIanL3m72aV7S2x_J11XHGDnnYythPjZQh7T-CGCfUFHsB8Drj0y9aRKmsR8F50qwgPYYgQoR_RK2DbYjT5Z1Zy8OQqLxwtsiqJeCQD3l9UdKID6o7K5VqrvhkTJ5uWZwVm_stML3yWu4MXrCLrFIyknNzAGgRns_qH6Amg3UR_vKM455J_BKXyaGHpqVKL_VXk3xj_Y6iegbBTA2z8o",
		},
		{
			id: 2,
			title: "Sapiens: A Brief History...",
			category: "History",
			price: 22.5,
			stock: 85,
			coverUrl:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuCJof5vySWr_m245cY0IqGV3DXyVXOZ6xcVgRW1_DdYr1Z9vCmiOlYs0HcJzputiWioB7RepC5ojeGz82AqASeurp2jeK7OQ5zxy9QIUSLjbppdiY8iTRskizwIDOflt26Qze3aAATN1zccPcD9etA0xw4v0Q6BUIQdyU_iDkWNc64PQX2I6R9LYYThSx-cfbA2Z1swCYL9f1_5AORIGqe3ahBmOb8d4Mp0Ia6Cg0Uap3kgqnowphDDQfl_aZcoHiUUM4n3eOsOeWU",
		},
		{
			id: 3,
			title: "Educated: A Memoir",
			category: "Biography",
			price: 18.0,
			stock: 95,
			coverUrl:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuBHvjTp9n4WvuvFQb95DQoNAO0MPTFpYRURAr26b5ShYcrNVTilXQTKxvrgkjs-4-86Yd8Qb1FpMy3oiMEUzGmGDMRvj6lJbhXnJKfP4ZMEx5MPdiobU4Ulk2SFeQHqow1gKpPEE1FU816j66kaVMH8BUDQPu-ZRF5WAlzy2YMn39qvM-t9It-YtMYlzo8ZA3pQ8b7n7AB5JZl7aicZVeYNU2RhsTFiy3-RJteanTLu4xoKh1ZOSjA_2deiPkkTARb7Fsc24thcmcI",
		},
		{
			id: 4,
			title: "Atomic Habits",
			category: "Self-Help",
			price: 19.99,
			stock: 5,
			coverUrl:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuDMSj6Uig8mET8mF6TLUsBI5D6HQjtmeFjT_TdaAsRT52DFiddcZme1FXWDvBEBzsQEW4meyGjz754Nh98rpmox8e_rZ4qIgdnFWpg7NwM3QZ7TPJHlRAqM7xt7n4JuyRAMyDgg7kZx3HzMmOAcNBSYO-AjOWawbxTa27zvR6VavoiQ2UQa2elslGyYkXIi1a80UhFmtzJs6W5qacIFdznpmtvBPCNwH87zyWR3CWkO_6RfCIP56cG97KpaGLtueMtnLmQjjzW1LDE",
		},
		{
			id: 5,
			title: "Dune",
			category: "Sci-Fi",
			price: 14.75,
			stock: 70,
			coverUrl:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuDXLPTqtwuCQQvANXRhJy1PGe7uoij4ape0TeCW8QITggY1g3mFKxW2wexHYhRlG9bxIX-wEqx5_7vLl0MvHoqqSFext5Qhyl1cKjfM6d-A0nLRcN6pYyAqcTCaHRxGhB96mcNRAb-4MfD54XPxLT9R5vXtvsu47i1b_E-AM9a5Vus3s2gte15RpevJjWfxoAjUW9vea-Kt4zKsJol2OVq6o2L7jokxXfAzM-JeL8nO0giNfpjFIlDPs4idn4U1U1tH6sLB-kxJcHs",
		},
	];

	const categories = ["Fiction", "History", "Biography", "Self-Help", "Sci-Fi"];

	const [currentPage, setCurrentPage] = useState(1);

	return (
		<div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
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
						<button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#013a67] text-white font-bold hover:bg-[#013a67]/90 transition-colors">
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
								<option>Filter by Category</option>
								{categories.map((cat) => (
									<option key={cat}>{cat}</option>
								))}
							</select>
							<button className="p-2.5 rounded-lg border border-[#5c2e2e]/20 bg-white text-[#261d1a] hover:bg-[#013a67]/5">
								<SlidersHorizontal size={20} />
							</button>
						</div>
					</div>

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
									{books.map((book) => (
										<tr
											key={book.id}
											className="hover:bg-[#013a67]/5 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div
													className="bg-center bg-no-repeat bg-cover rounded w-10 aspect-[2/3]"
													style={{ backgroundImage: `url("${book.coverUrl}")` }}
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#261d1a]">
												{book.title}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-[#261d1a]/80">
												{book.category}
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
													<button className="text-[#5c2e2e] hover:text-[#013a67] transition-colors">
														<Edit size={20} />
													</button>
													<button className="text-[#5c2e2e] hover:text-red-600 transition-colors">
														<Trash2 size={20} />
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
