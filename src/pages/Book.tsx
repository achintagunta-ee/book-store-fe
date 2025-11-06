import React, { useState, useMemo } from "react";

// --- Icon Imports ---
import {
	ChevronDown,
	Star,
	Filter,
	X,
	ChevronRight,
	ChevronLeft, // Added ChevronLeft for pagination
} from "lucide-react";
import { Link } from "react-router-dom";

// --- Types ---
type Book = {
	id: number;
	title: string;
	author: string;
	price: number;
	category: "Fiction" | "Non-Fiction" | "Mystery" | "Sci-Fi";
	rating: number; // 1 to 5
	imageUrl: string;
};

type Filters = {
	categories: string[];
	authors: string[];
	maxPrice: number;
	minRating: number;
};

// --- Mock Data (More detailed for filtering) ---
const allBooksData: Book[] = [
	{
		id: 1,
		title: "The Midnight Library",
		author: "Matt Haig",
		price: 15.99,
		category: "Fiction",
		rating: 4,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA_lfEeHqCX_66BIJNAu7Nbgj3be3av2Yy8wifHd__KmwGfClMasTxvqHLBl-gj9ErnhnzJCbUjkY1GN7hua8XYglG94cd6VxL98bL0FW0VJXcRKWm9_lwJ0MfL_Sfk3aqCNUlm0fel73UryNZHa19mv7yE3LRkBYldOS5BDcWovgkAgcb232aoOrk2oMHwl9KPNlxA5XKnfLqOoxYz0gvMYTpmjHaC8e4Br7VNXZ1lizpPFVOgTdTu_uGna4V_h3Rdq5eB_npmXjI",
	},
	{
		id: 2,
		title: "Project Hail Mary",
		author: "Andy Weir",
		price: 22.99,
		category: "Sci-Fi",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCfQm1FZwzSlwFrNsSU8c-2Tel3zQYGemDZWVRKCKz-Z5ihQLxd8ELdhwm6wck9udei-srMiF_n5HpmAFeLff89BBTFWnq0NZqCXlhCM37m06XWBI-WEQFDPxZdnDV9CPImVc4owzLcn8-d9ac76SZWRW00ZmQWkqNZ1U0TesaT9hqq_XFi5drPyA7QAEJckb7atkamwINO_nkoxhPfpE3uig9XWEqht6pRbcYMQ_KuYcEgrthL3nx6T5Z_k4KnUZUNGzSkjekZ3b0",
	},
	{
		id: 3,
		title: "Klara and the Sun",
		author: "Kazuo Ishiguro",
		price: 18.5,
		category: "Fiction",
		rating: 4,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAYKGrswn17TRIBMRxNapOgfmP5Dcqi97iTDHW4-6Le051hViftYv9_CIejFTOCpt90V2kCGsN34E4iBdj94Ns90V5bJ4rpBBkxF4Q7dfJXmYYcx-id8lyLQ2sph9lzi11ckX2kMOo1t7Qec4eU3BFnGmBIbvwE200EGDBLXmx3e8YpS--gP0daIiJQVbZXuYDTq1CAfI4NOuQbZJc6WxpFuF2Yux_Nujqf2hYF1AIw5QSy1DTP_-3Y281g8sXrayi1Ws3MzPr1uLM",
	},
	{
		id: 4,
		title: "The Vanishing Half",
		author: "Brit Bennett",
		price: 16.2,
		category: "Fiction",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCfz2lTAP8mdKsondGpCOiQyAmhJ24w62_tlqsDhJeXr20ntxoze0_Rv9QGk7bIoBfkghIXbVxxfWGv9m8MaVawTREaVfrROnf2-eDqODq3BYERiVVkFs4FhxJFH5bM0oGytUzI--ZQqgtMDh1L8_Hzc70482wdWvILT4kIUtU6f-mwI6STR7pzhCibf1gM63PhnN5R_G1lmWoNDLh9GSnkGJrz2aPdntbvoTpn4GfUbMhE6xJtVjv6L6CrqjM4wYnhcEXcRANhYEc",
	},
	{
		id: 5,
		title: "Educated",
		author: "Tara Westover",
		price: 17.99,
		category: "Non-Fiction",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCUTUWTSYGKYGozL49iZ4RpzyTjMpwQjUm4XkDBAUevI1toRwXqeV-y-LT8UH3-gt63PUNuO4wMQxitLGRzcYjHBpkGh_4KGKNtEAWowli7ScJpcKJ0hzSVKRinCC055yHOOAEDJ-hjfsK1N1eUYdTOrcNjXAOLJlC_YhXfQxy11N31F4xuRqR_h27MAsscdLPMwGDIPk8TYIb0hwU707gk7nFY5my1WGWBiicB3btFQzgXYYAV-TlMhmwBZVUHIRwZ9EcOgxCe0bI",
	},
	{
		id: 6,
		title: "Dune",
		author: "Frank Herbert",
		price: 10.99,
		category: "Sci-Fi",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuC_LPh-g_UTwqyh55ARqPA-l8oFhM0xSIcH-X8sX8T73cI29TILcbmdcldH6kuOpdIPoFz2IYCy5K7qJT0cytxJHsno4OkkDAlv-wEGYIZSDhaLt86aTqq-_HvjzCVDEhFvB2lz6MEO93x8xxErssL8eEkdteg-e9TRjhd4iPAO7w17wiNnLY2yYb9zgc11-w1uHooTAffVLYFk3Xo9u7016-c81Oi2_uGt5dpNpTzYzTbwGULmMceLbhPtbq19KIj-slwRW1JbAw0",
	},
	{
		id: 7,
		title: "The Silent Patient",
		author: "Alex Michaelides",
		price: 14.5,
		category: "Mystery",
		rating: 4,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBy_MAeYANRgjNh-FsqV_AjSntqp5ajDage0AUm-fj3sE5pyLOJ05ul967cVaRxvDK79wQDqzAZmFquztEwe6ZJkJQKZst_c4Guur3_xERxscMyDgARM0bP3yiRhTGYqmqyNqTWXa6KblHndaK6x4LVzM96kkuDfgfNBekH-nCGXaYbv5LSCgVblVUFRIqaQVNT4HjJmxHUiDA_R_D8e0V2-Vp1U5WkYkQ9t1uemQDxSxFmZhBoNfgU27kQ4SAZ72pdkgTXoZmCI90",
	},
	{
		id: 8,
		title: "Atomic Habits",
		author: "James Clear",
		price: 19.99,
		category: "Non-Fiction",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCfQm1FZwzSlwFrNsSU8c-2Tel3zQYGemDZWVRKCKz-Z5ihQLxd8ELdhwm6wck9udei-srMiF_n5HpmAFeLff89BBTFWnq0NZqCXlhCM37m06XWBI-WEQFDPxZdnDV9CPImVc4owzLcn8-d9ac76SZWRW00ZmQWkqNZ1U0TesaT9hqq_XFi5drPyA7QAEJckb7atkamwINO_nkoxhPfpE3uig9XWEqht6pRbcYMQ_KuYcEgrthL3nx6T5Z_k4KnUZUNGzSkjekZ3b0",
	},
	// Add more books for pagination
	{
		id: 9,
		title: "Circe",
		author: "Madeline Miller",
		price: 12.99,
		category: "Fiction",
		rating: 4,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA_lfEeHqCX_66BIJNAu7Nbgj3be3av2Yy8wifHd__KmwGfClMasTxvqHLBl-gj9ErnhnzJCbUjkY1GN7hua8XYglG94cd6VxL98bL0FW0VJXcRKWm9_lwJ0MfL_Sfk3aqCNUlm0fel73UryNZHa19mv7yE3LRkBYldOS5BDcWovgkAgcb232aoOrk2oMHwl9KPNlxA5XKnfLqOoxYz0gvMYTpmjHaC8e4Br7VNXZ1lizpPFVOgTdTu_uGna4V_h3Rdq5eB_npmXjI",
	},
	{
		id: 10,
		title: "The Song of Achilles",
		author: "Madeline Miller",
		price: 11.99,
		category: "Fiction",
		rating: 5,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuA_lfEeHqCX_66BIJNAu7Nbgj3be3av2Yy8wifHd__KmwGfClMasTxvqHLBl-gj9ErnhnzJCbUjkY1GN7hua8XYglG94cd6VxL98bL0FW0VJXcRKWm9_lwJ0MfL_Sfk3aqCNUlm0fel73UryNZHa19mv7yE3LRkBYldOS5BDcWovgkAgcb232aoOrk2oMHwl9KPNlxA5XKnfLqOoxYz0gvMYTpmjHaC8e4Br7VNXZ1lizpPFVOgTdTu_uGna4V_h3Rdq5eB_npmXjI",
	},
];

// --- Constants ---
const BOOKS_PER_PAGE = 8;
const MAX_PRICE = Math.ceil(
	allBooksData.reduce((max, book) => (book.price > max ? book.price : max), 0)
);

// --- Placeholder Components (to be implemented or imported) ---

const BookCard: React.FC<{ book: Book }> = ({ book }) => (
	<div className="group relative">
		<div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-200">
			<img
				src={book.imageUrl}
				alt={book.title}
				className="h-full w-full object-cover object-center group-hover:opacity-75"
			/>
		</div>
		<div className="mt-4 flex justify-between">
			<div>
				<h3 className="text-md font-medium text-gray-900">
					<Link to="/book/detail">
						<span aria-hidden="true" className="absolute inset-0" />
						{book.title}
					</Link>
				</h3>
				<p className="mt-1 text-sm text-gray-500">{book.author}</p>
				<p className="text-sm font-medium text-secondary-link">${book.price}</p>
			</div>
		</div>
	</div>
);

// --- START OF UPDATED DUMMY LAYOUT ---
const Sidebar: React.FC<{
	onApplyFilters: (filters: Filters) => void;
	initialFilters: Filters;
}> = () => (
	// We ignore the props for this dummy layout to match the image
	<div className="space-y-6 font-serif">
		{/* Category */}
		<div>
			<h3 className="text-xl font-semibold text-gray-800 mb-3">Category</h3>
			<div className="space-y-2">
				<div className="flex items-center">
					<input
						id="cat-fiction"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label htmlFor="cat-fiction" className="ml-3 text-gray-700">
						Fiction
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="cat-nonfiction"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
						defaultChecked // Hardcoded to match image
					/>
					<label htmlFor="cat-nonfiction" className="ml-3 text-gray-700">
						Non-Fiction
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="cat-mystery"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label htmlFor="cat-mystery" className="ml-3 text-gray-700">
						Mystery
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="cat-scifi"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label htmlFor="cat-scifi" className="ml-3 text-gray-700">
						Sci-Fi
					</label>
				</div>
			</div>
		</div>

		{/* Price */}
		<div>
			<h3 className="text-xl font-semibold text-gray-800 mb-3">Price</h3>
			<input
				type="range"
				min="0"
				max="100"
				defaultValue="50" // Hardcoded to match image
				className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
			/>
		</div>

		{/* Author */}
		<div>
			<h3 className="text-xl font-semibold text-gray-800 mb-3">Author</h3>
			<div className="space-y-2">
				<div className="flex items-center">
					<input
						id="auth-murakami"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label htmlFor="auth-murakami" className="ml-3 text-gray-700">
						Haruki Murakami
					</label>
				</div>
				<div className="flex items-center">
					<input
						id="auth-rowling"
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label htmlFor="auth-rowling" className="ml-3 text-gray-700">
						J.K. Rowling
					</label>
				</div>
			</div>
		</div>

		{/* Rating */}
		<div>
			<h3 className="text-xl font-semibold text-gray-800 mb-3">Rating</h3>
			<div className="flex items-center space-x-1">
				<Star
					size={24}
					className="text-yellow-400 cursor-pointer"
					fill="currentColor"
				/>
				<Star size={24} className="text-gray-300 cursor-pointer" />
				<Star size={24} className="text-gray-300 cursor-pointer" />
				<Star size={24} className="text-gray-300 cursor-pointer" />
				<Star size={24} className="text-gray-300 cursor-pointer" />
			</div>
		</div>

		{/* Apply Button */}
		<button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
			Apply Filters
		</button>
	</div>
);

const Pagination: React.FC<{
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}> = () => (
	// We ignore the props for this dummy layout to match the image
	<nav
		className="flex items-center justify-center space-x-4 py-8"
		aria-label="Pagination"
	>
		<button className="text-gray-500 hover:text-gray-700">
			<span className="sr-only">Previous</span>
			<ChevronLeft size={20} />
		</button>

		<button
			className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/20 text-primary-700 font-medium"
			aria-current="page"
		>
			1
		</button>
		<button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
			2
		</button>
		<button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
			3
		</button>
		<span className="flex items-end justify-center h-10 w-10 text-gray-500">
			...
		</span>
		<button className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
			10
		</button>

		<button className="text-gray-500 hover:text-gray-700">
			<span className="sr-only">Next</span>
			<ChevronRight size={20} />
		</button>
	</nav>
);
// --- END OF UPDATED DUMMY LAYOUT ---

// --- Main Page Component ---
// Renamed BookListingPage to App and made it the default export
const BookPage: React.FC = () => {
	const [filters, setFilters] = useState<Filters>({
		categories: ["Fiction"], // Default to Fiction as in image
		authors: [],
		maxPrice: MAX_PRICE,
		minRating: 0,
	});
	const [sortOrder, setSortOrder] = useState("Relevance");
	const [currentPage, setCurrentPage] = useState(1);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	// Memoized filtering and sorting logic
	const filteredBooks = useMemo(() => {
		let books = allBooksData.filter((book) => {
			const categoryMatch =
				filters.categories.length === 0 ||
				filters.categories.includes(book.category);
			const authorMatch =
				filters.authors.length === 0 || filters.authors.includes(book.author);
			const priceMatch = book.price <= filters.maxPrice;
			const ratingMatch = book.rating >= filters.minRating;
			return categoryMatch && authorMatch && priceMatch && ratingMatch;
		});

		// Sorting logic
		books.sort((a, b) => {
			switch (sortOrder) {
				case "Price: Low to High":
					return a.price - b.price;
				case "Price: High to Low":
					return b.price - a.price;
				case "Rating":
					return b.rating - a.rating;
				default: // "Relevance" (or default)
					return a.id - b.id; // Simple sort by ID for relevance
			}
		});

		return books;
	}, [filters, sortOrder]);

	// Memoized pagination logic
	const paginatedBooks = useMemo(() => {
		const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
		const endIndex = startIndex + BOOKS_PER_PAGE;
		return filteredBooks.slice(startIndex, endIndex);
	}, [filteredBooks, currentPage]);

	const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

	const handleApplyFilters = (newFilters: Filters) => {
		setFilters(newFilters);
		setCurrentPage(1); // Reset to first page on filter change
		setIsMobileFilterOpen(false); // Close mobile drawer
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortOrder(e.target.value);
		setCurrentPage(1);
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow">
				<main className="py-8">
					{/* Mobile Filter Button */}
					<div className="flex justify-between items-center mb-6">
						<button
							onClick={() => setIsMobileFilterOpen(true)}
							className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
						>
							<Filter size={18} />
							<span>Filters</span>
						</button>
					</div>

					<div className="flex">
						{/* --- Desktop Sidebar --- */}
						<aside className="hidden lg:block w-1/4 xl:w-1/5 pr-8">
							<h2 className="text-2xl font-semibold mb-4">Filters</h2>
							<Sidebar
								onApplyFilters={handleApplyFilters}
								initialFilters={filters}
							/>
						</aside>

						{/* --- Mobile Filter Drawer --- */}
						{isMobileFilterOpen && (
							<div
								className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
								onClick={() => setIsMobileFilterOpen(false)}
							></div>
						)}
						<div
							className={`fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform ${
								isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
							} lg:hidden`}
						>
							<div className="flex justify-between items-center p-4 border-b">
								<h2 className="text-2xl font-semibold">Filters</h2>
								<button
									onClick={() => setIsMobileFilterOpen(false)}
									className="p-2"
								>
									<X size={24} />
								</button>
							</div>
							<div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
								<Sidebar
									onApplyFilters={handleApplyFilters}
									initialFilters={filters}
								/>
							</div>
						</div>

						{/* --- Main Content: Sort + Grid --- */}
						<div className="w-full lg:w-3/4 xl:w-4/5 lg:pl-8">
							{/* Breadcrumbs & Sort Dropdown */}
							<div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
								{/* Breadcrumbs */}
								<nav className="text-sm" aria-label="Breadcrumb">
									<ol className="flex items-center space-x-2 text-gray-500">
										<li>
											<a href="#" className="hover:text-gray-700">
												Home
											</a>
										</li>
										<li>
											<ChevronRight size={16} />
										</li>
										<li>
											<a href="#" className="hover:text-gray-700">
												Books
											</a>
										</li>
										<li>
											<ChevronRight size={16} />
										</li>
										<li>
											<span className="font-medium text-gray-700">
												{filters.categories.length === 1
													? filters.categories[0]
													: "All"}
											</span>
										</li>
									</ol>
								</nav>

								{/* Sort Dropdown */}
								<div className="relative w-full sm:w-auto sm:ml-auto">
									<select
										id="sort"
										value={sortOrder}
										onChange={handleSortChange}
										className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
									>
										<option>Sort by: Relevance</option>
										<option>Sort by: Price: Low to High</option>
										<option>Sort by: Price: High to Low</option>
										<option>Sort by: Rating</option>
									</select>
									<ChevronDown
										size={16}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
									/>
								</div>
							</div>

							{/* Book Grid */}
							{paginatedBooks.length > 0 ? (
								<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
									{paginatedBooks.map((book) => (
										<BookCard key={book.id} book={book} />
									))}
								</div>
							) : (
								<div className="text-center py-20">
									<h3 className="text-2xl font-semibold text-gray-800">
										No Books Found
									</h3>
									<p className="mt-2 text-gray-500">
										Try adjusting your filters.
									</p>
								</div>
							)}

							{/* Pagination */}
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default BookPage;
