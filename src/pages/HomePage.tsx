import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import BookCard from "../components/BookCard";
import {
  fetchHomeDataAsync,
} from "../redux/slice/bookSlice";
import { type RootState, type AppDispatch } from "../redux/store/store";
import { type Book as ApiBook } from "../redux/utilis/bookApi";
import { Link, useNavigate } from "react-router-dom";


interface Book {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  slug: string;
  price: number;
}



const BookSection: React.FC<{ title: string; books: Book[] }> = ({
  title,
  books,
}) => (
  <section className="py-12">
    <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-bold text-[#261d1a]">
            {title}
        </h2>
        <Link to="/books" className="text-sm font-semibold text-[#8E5A4F] hover:text-[#261d1a] transition-colors">
            View All &rarr;
        </Link>
    </div>
    
    <div className="relative group/slider">
        <div className="flex overflow-x-auto pb-4 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 md:mx-0 snap-x snap-mandatory">
            <div className="flex gap-6 md:gap-8 pr-4 ">
                {books.map((book) => (
                <div key={book.id} className="snap-start flex-shrink-0 w-[240px]">
                    <BookCard 
                      id={book.id}
                      title={book.title}
                      author={book.author}
                      imageUrl={book.imageUrl}
                      slug={book.slug}
                      price={book.price}
                      originalBook={book}
                    />
                </div>
                ))}
            </div>
        </div>
    </div>
  </section>
);

import Slider from "react-slick";

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const {
    newArrivals,
    popularBooks,
    categories,
    homeDataStatus,
  } = useSelector((state: RootState) => state.books);
  const { userProfile } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userProfile?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    if (homeDataStatus === "idle") {
      dispatch(fetchHomeDataAsync());
    }
  }, [homeDataStatus, dispatch]);

  const bookSections = useMemo(
    () => [
      {
        title: "New Arrivals",
        books: (newArrivals || []).map((book: ApiBook) => ({
          id: book.book_id || book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug || "",
          price: book.price,
        })),
      },
      {
        title: "Popular Books",
        books: (popularBooks || []).map((book: ApiBook) => ({
          id: book.book_id || book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.cover_image_url || "",
          slug: book.slug || "",
          price: book.price,
        })),
      },
    ],
    [newArrivals, popularBooks]
  );

  const categorySliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="group/design-root relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-body ">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex w-full max-w-screen-xl flex-1 flex-col">
            <main className="mt-5 flex flex-col gap-10">
              <div className="w-full">
                  <div 
                    onClick={() => navigate("/books")}
                    className="relative w-full overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
                  >
                     <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8BqqkIZl_dq3xAsgE4Sh42f0Hqyxg0fEacrUYmJN5rKAUCLj_uuRqITMuuuzATnIArBn9FLh-IvLOqlL7TPN8H4VESZ7vXyI7b3gIv1WQIWyCzm9xvtyFwgkDp1mW_8Zh47mlf34UwEA1KNt5Enub7_j4FHviX_cyElKgwPnWVlWaG5k0wZ9LxeCBTHke0giBnHifhZYmWWA9WacY0fDzg8fZPhYfK_6akxJhzpHzSlBuZBeMdkSgFxmTgFPH2340MqqBeG9fQcY")`,
                        }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                     
                     <div className="relative z-10 flex min-h-[400px] md:min-h-[500px] flex-col justify-center px-6 md:px-16 lg:px-24">
                       
                        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-sm">
                           Find Your Next <br/> <span className="text-primary-light text-blue-200">Great Read</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-lg font-medium text-gray-200 md:text-xl leading-relaxed drop-shadow-sm">
                           Discover a world of stories, from timeless classics to modern bestsellers. Elevate your mind with our curated collection.
                        </p>
                        
                        <div className="mt-10 flex flex-wrap gap-4">
                           <button className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg active:scale-95">
                                 Shop Now
                           </button>
                           <Link to="/about" onClick={(e) => e.stopPropagation()}>
                                 <button className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
                                 Learn More
                                 </button>
                           </Link>
                        </div>
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

               {/* Categories Section */}
              <section className="py-12">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-3xl font-bold text-[#261d1a]">
                      Browse by Category
                    </h2>
                 </div>
                 
                 <div className="category-slider-wrapper">
                    <Slider {...categorySliderSettings}>
                        {(categories || []).map((category) => (
                          <div key={category.id} className="px-2">
                             <Link
                              to={`/books?category=${category.name}`}
                              className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100 h-[220px] w-full"
                            >
                               <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-inner">
                                  <span className="text-3xl font-bold">{category.name.charAt(0).toUpperCase()}</span>
                               </div>
                              <span className="text-center font-serif text-sm font-bold text-[#261d1a] leading-tight">
                                {category.name}
                              </span>
                            </Link>
                          </div>
                        ))}
                    </Slider>
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
