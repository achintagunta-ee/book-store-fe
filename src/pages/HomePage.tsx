import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHomeDataAsync,
} from "../redux/slice/bookSlice";
import { type RootState, type AppDispatch } from "../redux/store/store";
import { type Book as ApiBook } from "../redux/utilis/bookApi";
import { Link } from "react-router-dom";
import { addToCartAsync } from "../redux/slice/cartSlice";
import { Toaster, toast } from "react-hot-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  slug: string;
}

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="flex h-full min-w-60 flex-1 flex-col gap-4 rounded-lg bg-background-light shadow-[0_4px_12px_rgba(0,0,0,0.05)] ">
      <Link to={`/book/detail/${book.slug}`}>
        <div
          className="aspect-[3/4] w-full rounded-lg bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${
              book.imageUrl ||
              "https://via.placeholder.com/400x600.png?text=No+Image"
            }")`,
          }}
        ></div>
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-4 p-4 pt-0">
        <div>
          <Link to={`/book/detail/${book.slug}`}>
            <p className="font-display text-lg font-medium   text-secondary-link">
              {book.title}
            </p>
          </Link>
          <p className="font-body text-sm font-normal leading-normal text-text-light/70 dark:text-text-main-dark/70">
            By {book.author}
          </p>
        </div>
        <button
          onClick={() => {
            dispatch(addToCartAsync({ bookId: book.id, quantity: 1 }));
            toast.success("Added to cart");
          }}
          className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary/20 px-4 font-body text-sm font-bold leading-normal tracking-[0.015em] text-text-light transition-colors hover:bg-primary/30 "
        >
          <span className="truncate">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

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
  const dispatch: AppDispatch = useDispatch();
  const {
    featuredBooks,
    featuredAuthorsBooks,
    newArrivals,
    popularBooks,
    categories,
    homeDataStatus,
  } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (homeDataStatus === "idle") {
      dispatch(fetchHomeDataAsync());
    }
  }, [homeDataStatus, dispatch]);

  const bookSections = useMemo(
    () => [
      {
        title: "Featured Books",
        books: (featuredBooks || []).map((book: ApiBook) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug,
        })),
      },
      {
        title: "Featured Authors",
        books: (featuredAuthorsBooks || []).map((book: ApiBook) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug,
        })),
      },
      {
        title: "New Arrivals",
        books: (newArrivals || []).map((book: ApiBook) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug,
        })),
      },
      {
        title: "Popular Books",
        books: (popularBooks || []).map((book: ApiBook) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug,
        })),
      },
    ],
    [featuredBooks, featuredAuthorsBooks, newArrivals, popularBooks]
  );

  return (
    <div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-body ">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex w-full max-w-screen-xl flex-1 flex-col">
            <main className="mt-5 flex flex-col gap-10">
              <div className="@container">
                <div className="@[480px]:p-4">
                  <Link
                    to="/books"
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
                  </Link>
                </div>
              </div>
              
              {bookSections.map((section) => (
                <BookSection
                  key={section.title}
                  title={section.title}
                  books={section.books}
                />
              ))}

               {/* Categories Section */}
              <section>
                 <h2 className="font-display px-4 pb-3 pt-5 text-3xl font-bold leading-tight tracking-tight text-secondary-link ">
                  Categories
                </h2>
                <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-stretch gap-4 p-4">
                    {(categories || []).map((category) => (
                      <Link
                        key={category.id}
                        to={`/books?category=${category.name}`}
                        className="flex min-w-[150px] flex-col items-center justify-center gap-3 rounded-xl bg-background-light p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary/5 hover:shadow-md border border-transparent hover:border-primary/20"
                      >
                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {/* Simple icon placeholder or first letter */}
                            <span className="text-xl font-bold">{category.name.charAt(0).toUpperCase()}</span>
                         </div>
                        <span className="text-center font-display text-base font-semibold text-text-light dark:text-text-main-dark">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
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
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default HomePage;
