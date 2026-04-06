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
    <div className={`group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 ${className}`}>
      <Link to={`/book/detail/${slug}`} className="relative h-[320px] w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
         <img 
            src={imageUrl || "https://via.placeholder.com/400x600.png?text=No+Image"} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
         />
      </Link>
      
      {/* Remove Button (if onRemove provided) */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(id);
          }}
          className="absolute top-2 left-2 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-100"
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-1 flex-col py-4">
        <div className="mb-4">
          <Link to={`/book/detail/${slug}`}>
            <h3 className="line-clamp-1 text-lg font-bold text-[#261d1a] hover:text-primary transition-colors font-serif" title={title}>
              {title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-[#8E5A4F] font-medium">
            By {author}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-auto flex w-full items-center justify-center rounded-lg bg-[#f5e9e2] py-2.5 text-sm font-bold text-[#261d1a] transition-all hover:bg-[#ebdcd3] active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
