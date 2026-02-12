import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "../redux/slice/cartSlice";
import type { AppDispatch } from "../redux/store/store";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export interface BookCardProps {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  slug: string;
  price: number;
  originalBook?: any; // To pass to addToCart
  className?: string;
  onRemove?: (id: number) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  id, 
  title, 
  author, 
  imageUrl, 
  slug, 
  price, 
  originalBook,
  className = "",
  onRemove
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();
    
    // Use originalBook if provided, otherwise construct a minimal book object
    const bookPayload = originalBook || { id, title, author, imageUrl, slug, price };
    
    dispatch(addToCartAsync({ book_id: id, quantity: 1, book: bookPayload }));
    toast.success("Added to cart");
  };

  return (
    <div className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100 dark:border-gray-700 ${className}`}>
      <Link to={`/book/detail/${slug}`} className="relative h-[250px] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
         <img 
            src={imageUrl || "https://via.placeholder.com/400x600.png?text=No+Image"} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
         />
         {/* Price Tag Overlay */}
         <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur-sm dark:bg-black/80 dark:text-white">
            ₹{price}
         </div>

      </Link>
      
      {/* Remove Button (if onRemove provided) */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(id);
          }}
          className="absolute top-2 left-2 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-100 dark:bg-black/80 dark:text-red-400"
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link to={`/book/detail/${slug}`}>
            <h3 className="line-clamp-2 text-base font-bold text-gray-900 hover:text-primary dark:text-white transition-colors" title={title}>
              {title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {author}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
