import React from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";

const bookSections = [
	{
		title: "New Arrivals",
		books: [
			{
				title: "The Midnight Library",
				author: "By Matt Haig",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuBiEu81D37k3EFDnV_8GeMCTwA1m-JRoRkujUU-HsN7KyK4ngRBnak-PUBkP7qbvSjCew40571kfE43NYxIjknPq8HjmT9wCZJdhE-sE-N9YYz3eDuy2yBnWbdqi9SkOORKun2iUwR3DhyqDIUVnxtzE3rz3Ljo9JxntmxG0ZNdm66CjLVIa1-KG0Al47atWokHRmpb7hC319SD3WEAX_kyWWx88bDxNihF7LMc75CEV3UzSSUZ4o7Ae5CM8208p9H3YjRCSHGOl18",
			},
			{
				title: "Project Hail Mary",
				author: "By Andy Weir",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuBm1GZuaBTyFNN7e_BAIVz2kew7p0i3Lb0iz46CK-uB5iw1Q9WabPraX6_b8xX6nGrsLurFVsXJG7Kc_57YP2eHsbvYw72VP1IEI7TN0eRbFB9Felx7VkB6FVoy2aAHO566wXHdkVV-fZirbCX5igI2OGdAsDora7MNlmihtKLK_wjrAR21EM3qeMuxynChpwuR2pR60tWHCfDHsc7nxI65XN3yKbtiwfe9s6AXSYnWX1sewaBmb9PAB2O_EZO-oE7d2O9sDOLdMM4",
			},
			{
				title: "Klara and the Sun",
				author: "By Kazuo Ishiguro",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuAXtYh_41IteqQmKKfihxP0BJK2bi-oxeDukW7UQtW_8xjOsBg2WQXvGrHaGH2zOwLudk-7YXi7WAMy1EHI5dnc5mMGCp36RGNylAGTjOuZXrYyOtHjoiwkTRsaMQl4JoR6mt0KryNu1BzbcAhlYtn6lDXOF1old73nxPEeGL_kd4nrciGpz9PkW9RwsutktnT22gg7rCkjR4q3WATH9e-WfC9dqhjdB8ZghBsIIgVp27ippiQPk4mMe0p4EECvh2zk6FPgkSQCv2A",
			},
			{
				title: "The Four fdfdsf Winds",
				author: "By Kristin Hannah",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuDzlKZB2H2R0rd1Mff_M-P-YY5C9Uw1TJw4MKFumBAWy0q72thtC-oTov-Sw1r-jLu2r5RyzAV9wKgxjwzE2SPrD4YXTl9tkwlQhKmQaicBctCGTK4HC5-r9vcNWxicuahGaf2wkuyDYHrLW-GdigNerw7DpgM4ke8zsmTeTaVbuUfg7VrXGTuXPg7H-Y-sD8I-IBuiBrWy8FEIuj4WxfYcIozWPqgmxlF4pIoMwZrQCwYWIksVsKxhJeg4d9loJMcM1IlL1cok-yg",
			},
			{
				title: "The Four sWinds",
				author: "By Kristin Hannah",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuDzlKZB2H2R0rd1Mff_M-P-YY5C9Uw1TJw4MKFumBAWy0q72thtC-oTov-Sw1r-jLu2r5RyzAV9wKgxjwzE2SPrD4YXTl9tkwlQhKmQaicBctCGTK4HC5-r9vcNWxicuahGaf2wkuyDYHrLW-GdigNerw7DpgM4ke8zsmTeTaVbuUfg7VrXGTuXPg7H-Y-sD8I-IBuiBrWy8FEIuj4WxfYcIozWPqgmxlF4pIoMwZrQCwYWIksVsKxhJeg4d9loJMcM1IlL1cok-yg",
			},
			{
				title: "The Four fWinds",
				author: "By Kristin Hannah",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuDzlKZB2H2R0rd1Mff_M-P-YY5C9Uw1TJw4MKFumBAWy0q72thtC-oTov-Sw1r-jLu2r5RyzAV9wKgxjwzE2SPrD4YXTl9tkwlQhKmQaicBctCGTK4HC5-r9vcNWxicuahGaf2wkuyDYHrLW-GdigNerw7DpgM4ke8zsmTeTaVbuUfg7VrXGTuXPg7H-Y-sD8I-IBuiBrWy8FEIuj4WxfYcIozWPqgmxlF4pIoMwZrQCwYWIksVsKxhJeg4d9loJMcM1IlL1cok-yg",
			},
		],
	},
	{
		title: "Best Sellers",
		books: [
			{
				title: "The Vanishing Half",
				author: "By Brit Bennett",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuAUrYn81hvvFK8QWa-HxWbk4-M2h0s2elO32q7BeLBinRVjlBwB2BjHOeBLUzOIxsbdJRQWGzbl5GJF4ETnCdkFyEYbTVpU8Ino4Mdgh4kpaJI4theq06ny7NZ4N-Yz4POFFnxQmXZMU1f4Gfeuye89W0kHmWwYJhFGhP6D1LIg0bNy4KWF_cm54zoX8PM4Kdy9iVu3b14zLEt7vsum24f7iENGJpbXF2wgdawKiMlTIoMd168JOhvAfpHMEOFSRh_5T4dH75-EJNE",
			},
			{
				title: "Circe",
				author: "By Madeline Miller",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuAIM7GGEIJNMk2UJKsvZY2MfHXiW6xZXjeP_GF_itN0aZeKlCJmvk53AFWRmxWqAaZ41YzJ_CQYyrUxF5jgvtcU59rtlHeIHu6S0G6yc3htgfPpdS6IkIQy879mm7S92Ea5Q6qM-pN5HPnkJJ2vuKqs6oCCc0gBeiLvgV57vflwDe4RAASp76OVOSo-FSjvzllJMYlnvGJFzYfjQwFvVftl0ucGK9ARb0xig_7kd82RnNN4gUDqcAigVGEH3wvNRD3TqPS0tjkyE1A",
			},
			{
				title: "Where the Crawdads Sing",
				author: "By Delia Owens",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuAIM7GGEIJNMk2UJKsvZY2MfHXiW6xZXjeP_GF_itN0aZeKlCJmvk53AFWRmxWqAaZ41YzJ_CQYyrUxF5jgvtcU59rtlHeIHu6S0G6yc3htgfPpdS6IkIQy879mm7S92Ea5Q6qM-pN5HPnkJJ2vuKqs6oCCc0gBeiLvgV57vflwDe4RAASp76OVOSo-FSjvzllJMYlnvGJFzYfjQwFvVftl0ucGK9ARb0xig_7kd82RnNN4gUDqcAigVGEH3wvNRD3TqPS0tjkyE1A",
			},
			{
				title: "Educated",
				author: "By Tara Westover",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuArzffI3Ik6Aht_gvAo4nSiAFNL2XcEigNYv58SJQ0efar0tDfC6HMQUhhLb-vDWg0RM_HKjNaEcxXBuRzPzzAYUV97js9aUkI6C6ZOZWPM69mc7gZqbwk1Q722zFgUhnF_mg7AzcivGcEbyVGfnjoytKEH8mreoBF_-DqgIsY7uHCyAOhUUd6XouO-RoZsj12s-REI4RQoIdAsL-6Ojb4ybF50Y-4EdB0tRM4ayAzZPphgxQa0njUmj1WUGOtnrKxqin3bhsVJmIY",
			},
		],
	},
	{
		title: "Recommended Reads",
		books: [
			{
				title: "The Silent Patient",
				author: "By Alex Michaelides",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuAjd4PgjradvbczrvLTTlyZOKNqNTaVKbpT8EnM40tPkga1VIhAcF99dDyWTmHBMdFfnJTbdmhYH5LR8YZLDm8atMCFENSG7Hi_y_pA_6OnD36hAl6gBRx1Hvc3nOUZ0StEKbjpOwhIiijrdNBrB5xRW4b-usgq6uU6r7E7k1TW6FU1yIdPIsiiWrPl4NeuXbSn3alfF0VGZawpjlqt4ufESycb-PorfkIJ1TumiCv_xuInF0gUUhTFbQKUwfENk11zZ4EwokpUCI4",
			},
			{
				title: "Anxious People",
				author: "By Fredrik Backman",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuCm8HMWB7ncyHZUU4qkF3NE3XbWNHCrvXOfE68PXMN0c_ZvDbTRhAmK6xjtaEsSFZgxpZsH5CZ41v86_WGCI3x9TWJv4uwhMhvPlA8CzQDnekiI3i62IuooVkhoXztip_Dg9MjYgfXXL5cqcL2gtveZrle5jIIovf8Gk7y2qyxuFL7NJn5dAFKEZjYX0HIbkRLIGN6JjeL6pfWrmV-rMhKZ3lE3rEFVAVqpk5rxorJ6ocsRGMkUKAWdy2Hngox7L-dO8vXFsuHiqRY",
			},
			{
				title: "The Guest List",
				author: "By Lucy Fokley",
				imageUrl:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuCk9S3Hm6QkiXiivwfJxAD2o15FBddYX_MlrrqEf6ptoJUvn8I-NIfw6Ji8wSy1EyOwFm2Hrka-Ri8DLhGo0ur-jYJX3HWyTh0C8aj7qgxCFHm_y1qfnw3YUj4l7I5STtI2-BrK2VQUhwe9TyWjuedl8KDl0DWCtVm1kMl4Gg_tAmnKbLTXFi2soXPhD-MNfvZ_P5pSlRFVMOYkQQavxc53fGNveE0FXMFwfNYl8bm-7XNYukZK5fvlg92sT-5j3UUTw1gvm9BjmYY",
			},
		],
	},
];

interface Book {
	title: string;
	author: string;
	imageUrl: string;
}

const BookCard: React.FC<{ book: Book }> = ({ book }) => (
	<div className="flex h-full min-w-60 flex-1 flex-col gap-4 rounded-lg bg-background-light shadow-[0_4px_12px_rgba(0,0,0,0.05)] ">
		<div
			className="aspect-[3/4] w-full rounded-lg bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: `url("${book.imageUrl}")` }}
		></div>
		<div className="flex flex-1 flex-col justify-between gap-4 p-4 pt-0">
			<div>
				<p className="font-display text-lg font-medium   text-secondary-link">
					{book.title}
				</p>
				<p className="font-body text-sm font-normal leading-normal text-text-light/70 dark:text-text-main-dark/70">
					{book.author}
				</p>
			</div>
			<button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 font-body text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-colors hover:bg-primary/30 ">
				<span className="truncate">Add to Cart</span>
			</button>
		</div>
	</div>
);

const BookSection: React.FC<{ title: string; books: Book[] }> = ({
	title,
	books,
}) => (
	<section>
		<h2 className="font-display px-4 pb-3 pt-5 text-3xl font-bold leading-tight tracking-tight text-secondary-link ">
			{title}
		</h2>
		<div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<div className="flex items-stretch gap-6 p-4">
				{books.map((book) => (
					<BookCard key={book.title} book={book} />
				))}
			</div>
		</div>
	</section>
);

const HomePage: React.FC = () => {
	return (
		<div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-body ">
			<div className="layout-container flex h-full grow flex-col">
				<Header />
				<div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-20 xl:px-40">
					<div className="layout-content-container flex w-full max-w-screen-xl flex-1 flex-col">
						<main className="mt-5 flex flex-col gap-10">
							<div className="@container">
								<div className="@[480px]:p-4">
									<div
										className="@[480px]:gap-8 @[480px]:rounded-xl flex min-h-[480px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-4"
										style={{
											backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8BqqkIZl_dq3xAsgE4Sh42f0Hqyxg0fEacrUYmJN5rKAUCLj_uuRqITMuuuzATnIArBn9FLh-IvLOqlL7TPN8H4VESZ7vXyI7b3gIv1WQIWyCzm9xvtyFwgkDp1mW_8Zh47mlf34UwEA1KNt5Enub7_j4FHviX_cyElKgwPnWVlWaG5k0wZ9LxeCBTHke0giBnHifhZYmWWA9WacY0fDzg8fZPhYfK_6akxJhzpHzSlBuZBeMdkSgFxmTgFPH2340MqqBeG9fQcY")`,
										}}
									>
										<div className="flex flex-col gap-4 text-center">
											<h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white @[480px]:text-6xl @[480px]:font-bold @[480px]:leading-tight @[480px]:tracking-tight">
												Find Your Next Great Read
											</h1>
											<h2 className="font-body text-lg font-normal leading-normal text-white @[480px]:text-xl @[480px]:font-normal @[480px]:leading-normal">
												Discover a world of stories, from timeless classics to
												modern bestsellers.
											</h2>
										</div>
										<button className="@[480px]:h-14 @[480px]:px-8 @[480px]:text-lg @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 font-body text-base font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-primary/90">
											<span className="truncate">Shop Now</span>
										</button>
									</div>
								</div>
							</div>
							{bookSections.map((section) => (
								<BookSection
									key={section.title}
									title={section.title}
									books={section.books}
								/>
							))}
						</main>
						{/* <footer className="mt-20 border-t border-solid border-primary/20 px-4 pb-5 pt-10 font-body text-text-light/80 dark:text-text-main-dark/80 sm:px-6 lg:px-10">
							<div className="grid grid-cols-1 gap-10 md:grid-cols-3">
								<div>
									<h3 className="mb-4 font-display text-lg font-bold text-text-light dark:text-text-main-dark">
										Stay Connected
									</h3>
									<div className="flex gap-2 text-text-light/80 dark:text-text-main-dark/80">
										<a
											href="#"
											className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 bg-primary/10 hover:text-primary"
										>
											<Facebook className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
										</a>
										<a
											href="#"
											className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 bg-primary/10 hover:text-primary"
										>
											<Twitter className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
										</a>
										<a
											href="#"
											className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 bg-primary/10 hover:text-primary"
										>
											<Instagram className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
										</a>
									</div>
								</div>
								<div>
									<h3 className="mb font-display text-lg font-bold text-text-light dark:text-text-main-dark">
										Join Our Newsletter
									</h3>
									<form className="flex ">
										<input
											className="form-input flex-grow rounded-l-lg border-primary bg-transparent font-body text-text-light placeholder-text-light/50 focus:border-primary focus:ring-primary dark:text-text-main-dark dark:placeholder-text-main-dark/50 border px-3 py-2 "
											placeholder="Your email address"
											type="email"
										/>
										<button
											className="rounded-r-lg bg-primary px-4 font-body text-white transition-colors hover:bg-primary/90"
											type="submit"
										>
											Subscribe
										</button>
									</form>
								</div>
							</div>
							<div className="mt-10 text-center text-sm text-text-light/60 dark:text-text-main-dark/60">
								<p>© 2024 Hithabodha Book Store. All Rights Reserved.</p>
							</div>
						</footer> */}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
};

export default HomePage;
