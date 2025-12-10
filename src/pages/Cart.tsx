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

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch: AppDispatch = useDispatch();
  const imageUrl = item.cover_image
    ? `${import.meta.env.VITE_API_BASE_URL}/${item.cover_image}`
    : "https://via.placeholder.com/200x300.png?text=No+Image";

  const debouncedUpdate = useDebounce((itemId: number, quantity: number) => {
    dispatch(updateCartItemAsync({ itemId, quantity }));
  }, 500); // 500ms delay

  const handleQuantityChange = (newQuantity: number) => {
    // We allow invalid numbers temporarily while typing, but don't send the API request.
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= item.stock) {
      debouncedUpdate(item.item_id, newQuantity);
    }
  };

  const handleRemove = () => {
    dispatch(removeCartItemAsync(item.item_id));
  };

  return (
    <div className="flex items-center gap-4 bg-background-light  px-4 py-3 justify-between border-b border-primary/10">
      <div className="flex items-center gap-4">
        <div
          className="bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-lg h-28 w-20"
          data-alt={`Book cover of ${item.book_name}`}
          style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
        <div className="flex flex-col justify-center">
          <p className="text-lg font-medium leading-normal line-clamp-1">
            {item.book_name}
          </p>
          <p className="text-sm font-normal leading-normal line-clamp-2 text-text-light/70 dark:text-text-dark/70">
            {/* Author is not in the cart response, can be added if needed */}
          </p>
          <p className="text-lg font-bold mt-2">
            ${item.effective_price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 cursor-pointer"
          >
            -
          </button>
          <input
            className="text-lg font-medium leading-normal w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              // We call the handler even with NaN so the user can clear the input
              handleQuantityChange(value);
            }}
            min="1"
            max={item.stock}
          />
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={handleRemove}
          className="text-sm text-primary font-medium flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">delete</span>{" "}
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
  return (
    <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between gap-x-6 py-2 border-b border-primary/10">
          <p className="text-sm font-normal leading-normal text-text-light/70 dark:text-text-dark/70">
            Subtotal
          </p>
          <p className="text-sm font-medium leading-normal text-right">
            ${summary.subtotal.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between gap-x-6 py-2 border-b border-primary/10">
          <p className="text-sm font-normal leading-normal text-text-light/70 dark:text-text-dark/70">
            Shipping
          </p>
          <p className="text-sm font-medium leading-normal text-right">
            ${summary.shipping.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between gap-x-6 py-4">
          <p className="text-base font-bold leading-normal">Total</p>
          <p className="text-xl font-bold leading-normal text-right">
            ${summary.final_total.toFixed(2)}
          </p>
        </div>
      </div>
      <button className="w-full mt-6 bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300">
        Checkout
      </button>
    </div>
  );
};

// --- 5. Main CartPage Component ---
// This component assembles the layout and provides the data
const CartPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart); // Keep this line
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
    return <div className="text-center p-10">Loading Cart...</div>;
  }

  return (
    <main
      className={`flex-1 container mx-auto px-4 py-8 transition-opacity duration-300 ${
        status === "loading" ? "opacity-70" : "opacity-100"
      }`}
    >
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Your Cart
        </p>
        {cartItems.length > 0 && (
          <button
            onClick={() => dispatch(clearCartAsync())}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-800">
            Your Cart is Empty
          </h3>
          <p className="mt-2 text-gray-500">
            Looks like you haven't added any books yet.
          </p>
          <Link
            to="/books"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-white font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Column 1: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.item_id} item={item} />
            ))}

            <div className="pt-4">
              <Link
                to="/books"
                className="text-primary font-medium text-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Column 2: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary summary={summary} />
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
