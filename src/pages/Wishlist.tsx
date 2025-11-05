import React, { useState } from "react";
import Slider, { Settings } from "react-slick";

// CSS imports from your prompt.
// These should typically be imported in your main App.tsx or index.css file.
// import "tailwindcss";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// --- Type Definition ---
interface Book {
	id: string;
	title: string;
	author: string;
	price: number;
	imageUrl: string;
}

// --- Mock Data (from HTML) ---
const mockWishlistBooks: Book[] = [
	{
		id: "1",
		title: "The Night Circus",
		author: "Erin Morgenstern",
		price: 18.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCbXnvVGuKWagZf7AHjEDSxadtv1GsdBIwYRF8r_xVNEptbDLc-7oMxTHQuBq2cTnXer7L7GpT8B_NhieldlKpe5DCv9DljSrxx8fhx2OaQ1gIyUXfkUkCj-gjqCoWi6jQrHsXgj459d51GAX04VqKB0yeSYyl1pFD2nr3Iq30aIjQrKRLMtGH-7VKoJqSlCy95eDCcbs2o3r_H-NoMg6vQiz8eJq83xB_KOt5zxgLmVrU6NpZnEn393-7hBm5aLJgED7U3H6erKCM",
	},
	{
		id: "2",
		title: "Circe",
		author: "Madeline Miller",
		price: 16.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCnP6j7CBbLgsPj_HZalQ2xlfqtuN89572vohelf4FunUhtZkFuncLrH7_IwRlERHOEKDfRxMUSQd5PJFuFtjScUQy-50udjnSwRmv1Hgv_-dGO9qjHP4u4DapgQNqAhKiDwH7cplxZoFlsgZkXjAtJgld4SYkLhZwkOHWxq6KwW-NFbTrQ6acWbpw7WWG9vdgLO_9hNZxrJL6pT_tq46EY6FaUlIzC_b65L8zGR5PEv6xYckblmS3Dnr82QPuVuK6LQKdwGwUjiT8",
	},
	{
		id: "3",
		title: "The Song of Achilles",
		author: "Madeline Miller",
		price: 17.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCqUL4-yY9Z6o07-pCskk8uFJzXrVbJ6xM-lJUvxZ5bTqwg6z3Tiklxhe3nFc4IOllGN59vUtHpDL8h11KX9zMRfKmvLUBEyPw_syw1ILInu8LKAVTtSNIxcAews8ghl9MoKhjfpu8TynD_g-x_Yeo1qcP6Y6atsfgc67_M2x-UDPspJypvCAf8myidawrO7kxtyU-GS1yFXQ5I9hk_xGy49ABHgI_qG82KOW-cHWUhToBdNAOvCpJI2vPf1KezytOTD2nypKSdcJ8",
	},
	{
		id: "4",
		title: "Where the Crawdads Sing",
		author: "Delia Owens",
		price: 15.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuBBy8hWSl1VEj8p23jYhBIzjf2R5qdKCqaA5Ai981T8-OAoSeCzEvlEABrTp0db4k4DMmFxpPG9DlLRkeS9x9CYAzzr6LBd5c6iBV33XEt91GC15etf_RJb7SI7Dsm_ulbHgyYEI1T1LQxMbOTWbbJBChVb6CNb---s6Wp8cxBWAo8OmotSkJHXBynquMEwccf5Mv759yeldNh4wTDZdXC-TiyLYFN0EQoPI2BJrY5SwLGUd9qqxYPApJHENuZIbyB-dYxZeDukQBs",
	},
	{
		id: "5",
		title: "The Seven Husbands of Evelyn Hugo",
		author: "Taylor Jenkins Reid",
		price: 19.99,
		imageUrl:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuCh425q7Ju9BOkt1j5aSJeHsgNrdGk48mMSjH6lSrWo6LGjF7tiedAo4qNehuy5eKJ29cnLy-FoDPOZ9bpM0iQ_QyoeZiQEP8ZTFt8SFSRWYS0EIMlvgK4c5bpBsdvRLz0Laykp2FzU-AHw6ZDY1bbjsIBi5wQoqrd0QS5DaIZsA_qmDNsIafBnVpEnp_Gtbtc3gWPx3szvEBlmzqjA6TN7l-W_aIxZWSPyX1k3Esdvj6n3xnsHCtbJAo8SWlnDl46khNTIzspEx2Y",
	},
];

// --- Book Card Sub-Component ---
const BookCard: React.FC<{ book: Book }> = ({ book }) => {
	return (
		<div className="flex flex-col gap-4 rounded-lg bg-background-light  shadow-soft hover:shadow-lift transition-shadow duration-300 group">
			<div
				className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-t-lg"
				role="img"
				aria-label={`Book cover for ${book.title} by ${book.author}`}
				style={{ backgroundImage: `url("${book.imageUrl}")` }}
			></div>
			<div className="p-4 pt-0 flex flex-col flex-grow">
				<h3 className="font-display text-lg font-bold leading-tight text-text-main dark:text-text-main-dark">
					{book.title}
				</h3>
				<p className="font-body text-sm text-secondary-link">{book.author}</p>
				<p className="font-body text-base font-semibold text-text-main dark:text-text-main-dark mt-2">
					${book.price.toFixed(2)}
				</p>
				<div className="mt-4 flex flex-col gap-2">
					<button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-body text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors">
						Add to Cart
					</button>
					<button className="w-full flex items-center justify-center rounded-lg h-10 px-4 text-secondary-link font-body text-sm font-semibold hover:bg-primary/10 transition-colors">
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

// --- Empty State Sub-Component ---
const EmptyWishlist: React.FC = () => {
	return (
		<div className="text-center py-20">
			<span className="material-symbols-outlined text-6xl text-secondary-link/50">
				favorite
			</span>
			<h2 className="font-display text-2xl font-bold mt-4">
				Your wishlist is empty
			</h2>
			<p className="mt-2 text-secondary-link">
				Explore our collection and find your next great read!
			</p>
			<button className="mt-6 flex mx-auto items-center justify-center rounded-lg h-12 px-6 bg-primary text-white font-body text-base font-semibold tracking-wide hover:bg-primary/90 transition-colors">
				Go to Shop
			</button>
		</div>
	);
};

// --- Main Wishlist Page Component ---
const WishlistPage: React.FC = () => {
	const [books, setBooks] = useState<Book[]>(mockWishlistBooks);

	// Settings for the Slick Carousel
	const sliderSettings: Settings = {
		dots: true,
		// MODIFIED: Changed from 5 to 4
		infinite: books.length > 4, // Only loop if there are more slides than visible
		speed: 500,
		// MODIFIED: Changed from 5 to 4
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1280, // xl
				settings: {
					// MODIFIED: Changed from 5 to 4
					slidesToShow: 4,
				},
			},
			{
				breakpoint: 1024, // lg
				settings: {
					slidesToShow: 4, // This breakpoint already showed 4
				},
			},
			{
				breakpoint: 768, // md
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 640, // sm
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<main className="flex-1 px-4 sm:px-6 md:px-10 py-10">
			<div className="flex flex-wrap justify-between items-center gap-4 pb-8">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-text-main dark:text-text-main-dark">
					My Wishlist
				</h1>
			</div>

			{books.length === 0 ? (
				<EmptyWishlist />
			) : (
				<Slider {...sliderSettings}>
					{books.map((book) => (
						<div key={book.id} className="py-2 px-4">
							<BookCard book={book} />
						</div>
					))}
				</Slider>
			)}
		</main>
	);
};

export default WishlistPage;
