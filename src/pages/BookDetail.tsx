import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
	MdStar,
	MdStarHalf,
	MdStarBorder,
	MdFavoriteBorder,
} from "react-icons/md";

// --- Types ---
type BookDetails = {
	title: string;
	author: string;
	price: string;
	description: string;
	imageUrl: string;
	publisher: string;
	publicationDate: string;
	isbn: string;
	category: string;
};

type Review = {
	author: string;
	rating: number;
	comment: string;
};

// --- Mock Data ---
const bookData: BookDetails = {
	title: "The Great Gatsby",
	author: "F. Scott Fitzgerald",
	price: "$12.99",
	description:
		'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted "gin was the national drink and sex the national obsession," it is an exquisitely crafted tale of America in the 1920s.',
	imageUrl:
		"https://lh3.googleusercontent.com/aida-public/AB6AXuBY8d8l8nagQA7rAVLnj8-tFr4uISTY-pvdtjmfEwIPAnaqbYxs9Ej4hMI5xa7Xj-bE9pLFYKFimIuiDpJ2wj1f8k3LVrxFjKedyGl_9b9-YMd04RxWti3vrnnqrXapC_V5dsFgCAg_lrqTbtZk3PDnZmWWaez66qwgOjj0W90UcQUoiPbpo6xIFJSUNZAyCVE7tp26dKCNt97CV_b7Ve3j3pFVLxWqnBQU9gAPPIEFG1eiLICaVy5YeF8Q501c3uVjEAdkgsx0SK4",
	publisher: "Scribner",
	publicationDate: "April 10, 1925",
	isbn: "978-0743273565",
	category: "Fiction",
};

const reviewsData: Review[] = [
	{
		author: "John Doe",
		rating: 5,
		comment:
			"A timeless classic. Fitzgerald's writing is simply sublime. A must-read for anyone who appreciates great literature.",
	},
	{
		author: "Jane Smith",
		rating: 4,
		comment:
			"Enjoyed the story and the depiction of the roaring twenties. The characters were a bit unlikable for me, but the prose is beautiful.",
	},
];

const StarRating: React.FC<{ rating: number; className?: string }> = ({
	rating,
	className = "text-xl",
}) => (
	<div className="flex text-secondary-link">
		{[...Array(5)].map((_, i) => {
			const starValue = i + 1;
			if (starValue <= rating) {
				return <MdStar key={i} className={className} />;
			} else if (starValue - 0.5 === rating) {
				return <MdStarHalf key={i} className={className} />;
			}
			return <MdStarBorder key={i} className={className} />;
		})}
	</div>
);

const BookDetailPage: React.FC = () => {
	return (
		<div className=" font-body text-text-main">
			<div className="flex h-auto min-h-screen w-full flex-col">
				<Header />
				<main className="flex-grow px-4 py-5 sm:px-8 md:px-20 lg:px-40">
					{/* Breadcrumbs */}
					<div className="flex flex-wrap items-center gap-2 p-4">
						<a
							className="text-sm font-medium leading-normal text-primary/80 hover:text-primary dark:text-text-light/60"
							href="#"
						>
							Home
						</a>
						<span className="text-sm font-medium leading-normal text-primary/80 dark:text-text-light/60">
							/
						</span>
						<a
							className="text-sm font-medium leading-normal text-primary/80 hover:text-primary dark:text-text-light/60"
							href="#"
						>
							{bookData.category}
						</a>
						<span className="text-sm font-medium leading-normal text-primary/80 dark:text-text-light/60">
							/
						</span>
						<span className="text-sm font-medium leading-normal text-text-main dark:text-text-light">
							{bookData.title}
						</span>
					</div>

					{/* Main Product Section */}
					<div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-5">
						<div className="md:col-span-2">
							<div
								className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat shadow-lg"
								style={{ backgroundImage: `url("${bookData.imageUrl}")` }}
								aria-label={`The cover of the book ${bookData.title}`}
							></div>
						</div>
						<div className="flex h-full flex-col md:col-span-3">
							<div>
								<p className="font-display text-4xl font-bold leading-tight tracking-tight text-text-main dark:text-text-light md:text-5xl">
									{bookData.title}
								</p>
								<p className="mt-2 text-xl font-medium text-text-main/80 dark:text-text-light/80">
									{bookData.author}
								</p>
							</div>
							<h1 className="pb-4 pt-6 font-display text-4xl font-bold leading-tight tracking-light text-primary">
								{bookData.price}
							</h1>
							<div className="prose prose-lg mt-4 max-h-48 overflow-y-auto font-body text-text-main dark:text-text-light/90">
								<p>{bookData.description}</p>
							</div>
							<div className="mt-8 flex flex-col gap-4 sm:flex-row">
								<button className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-primary/90 hover:shadow-lg">
									<span className="truncate">Add to Cart</span>
								</button>
								<button className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-6 py-3 text-base font-bold tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg">
									<span className="truncate">Buy Now</span>
								</button>
								<button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-secondary-link px-4 py-3 text-base font-bold leading-normal tracking-wider text-white shadow-md transition-colors hover:bg-opacity-90 hover:shadow-lg">
									<MdFavoriteBorder className="h-6 w-6" />
								</button>
							</div>
							<div className="mt-8 border-t border-primary/20 pt-4 text-sm text-text-main/70 dark:text-text-light/70">
								<p>
									<strong>Publisher:</strong> {bookData.publisher}
								</p>
								<p>
									<strong>Publication Date:</strong> {bookData.publicationDate}
								</p>
								<p>
									<strong>ISBN:</strong> {bookData.isbn}
								</p>
							</div>
						</div>
					</div>

					{/* Customer Reviews Section */}
					<div className="mt-16">
						<h2 className="mb-6 border-b border-primary/20 pb-4 font-display text-3xl font-bold">
							Customer Reviews
						</h2>
						<div className="mb-8 flex items-center gap-4">
							<StarRating rating={4.5} className="text-3xl" />
							<p className="text-lg font-bold">4.5 out of 5 stars</p>
							<p className="text-text-main/70 dark:text-text-light/70">
								(1,234 reviews)
							</p>
						</div>
						<div className="space-y-8">
							{reviewsData.map((review, index) => (
								<div key={index} className="border-b border-primary/10 pb-6">
									<div className="mb-2 flex items-center">
										<p className="mr-4 font-bold">{review.author}</p>
										<StarRating rating={review.rating} />
									</div>
									<p className="text-text-main/90 dark:text-text-light/90">
										{review.comment}
									</p>
								</div>
							))}
						</div>
						<div className="mt-8 flex justify-center">
							<button className="h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-secondary-link bg-transparent px-6 text-base font-bold leading-normal tracking-wider text-secondary-link shadow-sm transition-colors hover:bg-secondary-link/10">
								<span className="truncate">Write a Review</span>
							</button>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default BookDetailPage;
