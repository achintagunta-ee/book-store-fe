import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { type AppDispatch, type RootState } from "../redux/store/store";
import {
  fetchCartAsync,
  updateCartItemAsync,
  removeCartItemAsync,
  clearCartAsync,
} from "../redux/slice/cartSlice";
import { type CartViewItem, type CartSummary } from "../redux/utilis/bookApi";

// A simple debounce hook
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => callback(...args), delay);
      setTimeoutId(newTimeoutId);
    },
    [callback, delay, timeoutId]
  );
}
interface CartItemProps {
  item: CartViewItem;
}

// Imported icons - make sure to have react-icons installed or use material symbols if already available.
// Since the user asked for icons and previous code used material-symbols-outlined, I'll stick to that or standard text if preferred. 
// However, the user specifically mentioned "delete icon". I'll use the material symbol 'delete' with a larger size.

// Import MdDelete from react-icons/md
import { MdDelete } from "react-icons/md";

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch: AppDispatch = useDispatch();
  const imageUrl = item.cover_image_url || "https://via.placeholder.com/200x300.png?text=No+Image";

  const debouncedUpdate = useDebounce((itemId: number, quantity: number) => {
    dispatch(updateCartItemAsync({ itemId, quantity }));
  }, 500);

  const handleQuantityChange = (newQuantity: number) => {
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= item.stock) {
      debouncedUpdate(item.item_id, newQuantity);
    }
  };

  const handleRemove = () => {
    dispatch(removeCartItemAsync(item.item_id));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
      {/* Image & Main Info */}
      <div className="flex items-start gap-5 flex-grow">
        <Link to={`/book/detail/${item.slug}`} className="shrink-0">
          <div
            className="h-32 w-24 rounded-lg bg-cover bg-center shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105"
            data-alt={`Book cover of ${item.book_name}`}
            style={{ backgroundImage: `url("${imageUrl}")` }}
          ></div>
        </Link>
        
        <div className="flex flex-col gap-1 py-1">
          <Link to={`/book/detail/${item.slug}`}>
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark line-clamp-2 hover:text-primary transition-colors">
              {item.book_name}
            </h3>
          </Link>
          <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-medium">
             Paperback
          </p>
          <div className="mt-auto pt-2">
             <p className="text-xl font-bold text-primary">
                ${(item.effective_price || 0).toFixed(2)}
             </p>
          </div>
        </div>
      </div>

      {/* Controls & Total */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:border-none">
        {/* Quantity */}
        <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-colors bg-gray-50 hover:bg-gray-100 rounded-l-lg border-r border-gray-200"
          >
            -
          </button>
          <div className="w-14 h-12 flex items-center justify-center font-bold text-lg text-text-main dark:text-text-light">
            {item.stock > 0 ? (
                <input
                className="w-full h-full text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={item.stock}
              />
            ) : item.quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-colors bg-gray-50 hover:bg-gray-100 rounded-r-lg border-l border-gray-200"
          >
            +
          </button>
        </div>

        {/* Remove Button - Using MdDelete icon */}
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
          title="Remove item"
        >
          <MdDelete className="text-3xl group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- 4. OrderSummary Sub-Component ---
// This component renders the summary box with totals
interface OrderSummaryProps {
  summary: CartSummary;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ summary }) => {
  const token = localStorage.getItem("auth_access");
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold font-display text-text-main dark:text-text-main-dark mb-6">
        Order Summary
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-text-light/80 dark:text-text-dark/80">
          <span>Subtotal</span>
          <span className="font-medium text-text-main dark:text-text-main-dark">
            ${(summary?.subtotal || 0).toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-text-light/80 dark:text-text-dark/80 pb-4 border-b border-gray-100 dark:border-gray-700">
          <span>Shipping</span>
          <span className="font-medium text-text-main dark:text-text-main-dark">
            ${(summary?.shipping || 0).toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-text-main dark:text-text-main-dark">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${(summary?.final_total || 0).toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
      {!token ? (
         <>
             <Link to="/checkout" className="block w-full">
                <button className="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
                    Checkout as Guest
                </button>
            </Link>
            <Link to="/login?redirect=/checkout" className="block w-full">
                <button className="w-full border-2 border-primary/10 bg-white dark:bg-transparent text-primary font-bold py-3.5 px-4 rounded-lg hover:bg-primary/5 hover:border-primary/20 transition-colors">
                    Login to Checkout
                </button>
            </Link>
         </>
       ) : (
          <Link to="/checkout" className="block w-full">
            <button className="w-full bg-primary text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
              Proceed to Checkout
            </button>
        </Link>
       )}
       </div>
    </div>
  );
};

// --- 5. Main CartPage Component ---
// This component assembles the layout and provides the data
const CartPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart); 
  const {
    items: cartItems,
    summary,
    status,
  } = cartState || {
    items: [],
    summary: { subtotal: 0, shipping: 0, final_total: 0 },
    status: "idle",
  };

  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  if (status === "loading" && cartItems.length === 0) {
    return <div className="text-center p-10 font-medium text-lg">Loading Your Cart...</div>;
  }

  return (
    <main
      className={`flex-1 container mx-auto px-4 py-12 transition-opacity duration-300 min-h-screen ${
        status === "loading" ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold font-display text-text-main dark:text-text-main-dark">
            Your Cart
          </h1>
          <p className="text-text-main/60 mt-1 dark:text-text-light/60">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={() => dispatch(clearCartAsync())}
            className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
           
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-4xl text-gray-400">shopping_bag</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 font-display">
            Your Cart is Empty
          </h3>
          <p className="mt-2 text-gray-500 max-w-md text-center">
            Looks like you haven't added any books yet. Explore our collection to find your next favorite read.
          </p>
          <Link
            to="/books"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Column 1: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {cartItems.map((item) => (
                <CartItem key={item.item_id} item={item} />
                ))}
            </div>

            <div className="pt-2">
              <Link
                to="/books"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary font-bold text-sm px-6 py-3 hover:bg-primary hover:text-white transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Column 2: Order Summary */}
          <div className="lg:col-span-4">
             <div className="sticky top-24">
                <OrderSummary summary={summary} />
             </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
