import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveAddressThunk,
  placeOrderThunk,
  getAddressSummaryThunk,
  completePaymentThunk,
  confirmOrderThunk,
} from "../redux/slice/authSlice";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  type AddressData,
  type PlaceOrderResponse,
  type AddressItem,
} from "../redux/utilis/authApi";

// --- 1. Type Definitions ---

type CheckoutStep = "address" | "review" | "payment";

type OrderItemType = {
  book_title: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string; // Optional for UI
  imageAlt?: string; // Optional for UI
};

// --- 3. Order Summary Components ---

interface OrderSummaryItemProps {
  item: OrderItemType;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ item }) => {
  // Provide a default image if one isn't available
  const imageUrl =
    item.imageUrl || "https://via.placeholder.com/64x80.png?text=Book";
  const imageAlt = item.imageAlt || `Cover of ${item.book_title}`;

  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <img
          className="w-16 h-20 object-cover rounded"
          alt={imageAlt}
          src={imageUrl}
        />
        <div>
          <p className="font-bold text-text-light dark:text-text-dark">
            {item.book_title}
          </p>
          <p className="text-sm text-text-light/70 dark:text-gray-400">
            Qty: {item.quantity}
          </p>
        </div>
      </div>
      <p className="font-bold text-text-light dark:text-text-dark">
        ${item.total.toFixed(2)}
      </p>
    </div>
  );
};

interface OrderSummaryProps {
  items: OrderItemType[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
}) => {
  return (
    <div className="lg:col-span-1 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 h-fit">
      <h3 className="text-text-light dark:text-text-dark text-xl font-bold font-display leading-tight tracking-[-0.015em] pb-4 border-b border-primary/20">
        Order Summary
      </h3>
      <div className="mt-4 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <OrderSummaryItem key={item.book_title} item={item} />
          ))
        ) : (
          <p className="text-text-light/70 dark:text-gray-400">
            Your cart is empty.
          </p>
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-primary/20 space-y-2">
        <div className="flex justify-between text-text-light/70 ">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-light/70 ">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-light/70 ">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-text-light dark:text-text-dark mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// --- 4. Checkout Step Components ---

interface StepProps {
  setStep: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  setAddressId?: React.Dispatch<React.SetStateAction<number | null>>;
  addressId?: number | null;
  setOrderResponse?: React.Dispatch<
    React.SetStateAction<PlaceOrderResponse | null>
  >;
  setOrderId?: React.Dispatch<React.SetStateAction<number | null>>;
  orderId?: number | null;
}

// -- Address Step (Replaces Billing Step) --
const AddressStep: React.FC<StepProps> = ({ setStep, setAddressId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile, addressSummary } = useSelector(
    (state: RootState) => state.auth
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const handleBillingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: AddressData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip_code: formData.get("zip_code") as string,
    };

    if (setAddressId) {
      const result = await dispatch(saveAddressThunk(data));
      if (saveAddressThunk.fulfilled.match(result)) {
        const newAddressId = result.payload.address_id;
        setAddressId(newAddressId);
        // Proceed to confirm order (Review Step)
        await dispatch(confirmOrderThunk(newAddressId));
        setStep("review");
      }
    }
  };

  const handleContinue = async () => {
    if (selectedAddressId && setAddressId) {
      setAddressId(selectedAddressId);
      await dispatch(confirmOrderThunk(selectedAddressId));
      setStep("review");
    }
  };

  const addresses = addressSummary?.addresses || [];
  const hasAddress = addressSummary?.has_address && addresses.length > 0;

  if (hasAddress && !showAddForm) {
    return (
      <div className="lg:col-span-2">
        <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Select Shipping Address
        </h2>
        <div className="space-y-4 px-4">
          {addresses.map((addr: AddressItem) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-primary/20 hover:border-primary/50"
              }`}
            >
              <p className="font-bold">
                {addr.first_name} {addr.last_name}
              </p>
              <p>{addr.address}</p>
              <p>
                {addr.city}, {addr.state} {addr.zip_code}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 px-4 flex gap-4">
          <button
            onClick={handleContinue}
            disabled={!selectedAddressId}
            className="flex-1 h-12 bg-primary text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex-1 h-12 border border-primary text-primary rounded-lg font-bold"
          >
            Add New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {hasAddress ? "Add New Address" : "Shipping Address"}
      </h2>
      <form onSubmit={handleBillingSubmit}>
        {hasAddress && (
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 text-primary underline mb-4"
          >
            Back to saved addresses
          </button>
        )}
        <div className="flex flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              First Name
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="first_name"
              placeholder="John"
              defaultValue={userProfile?.first_name || ""}
              required
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Last Name
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="last_name"
              placeholder="Doe"
              defaultValue={userProfile?.last_name || ""}
              required
            />
          </label>
        </div>
        <div className="px-4 py-3">
          <label className="flex flex-col">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Address
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="address"
              placeholder="123 Bookworm Lane"
              defaultValue=""
              required
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              City
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="city"
              placeholder="Storyville"
              defaultValue=""
              required
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              State
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="state"
              placeholder="Readington"
              defaultValue=""
              required
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Zip Code
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="zip_code"
              placeholder="12345"
              defaultValue=""
              required
            />
          </label>
        </div>
        <div className="px-4 py-3">
          <label className="flex items-center gap-3">
            <input
              className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary/50 border-primary/30 bg-background-light  dark:checked:bg-primary"
              type="checkbox"
            />
            <span className="text-text-light dark:text-gray-500 text-base">
              Same as shipping address
            </span>
          </label>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// -- Review Step (New) --
const ReviewStep: React.FC<StepProps> = ({
  setStep,
  addressId,
  setOrderId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { confirmOrderData } = useSelector((state: RootState) => state.auth);

  const handlePlaceOrder = async () => {
    if (addressId && setOrderId) {
      const result = await dispatch(placeOrderThunk(addressId));
      if (placeOrderThunk.fulfilled.match(result)) {
        // Parse order ID if it comes as "#23"
        const rawId = result.payload.order_id;
        const numericId =
          typeof rawId === "string"
            ? parseInt(rawId.replace("#", ""), 10)
            : rawId;
        setOrderId(numericId);
        setStep("payment");
      }
    }
  };

  if (!confirmOrderData) return <div>Loading review...</div>;

  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Review Order
      </h2>
      <div className="px-4 py-3">
        <div className="bg-white p-4 rounded-lg border border-primary/20 mb-4">
          <h3 className="font-bold mb-2">Shipping Address</h3>
          <p>
            {confirmOrderData.address.first_name}{" "}
            {confirmOrderData.address.last_name}
          </p>
          <p>{confirmOrderData.address.address}</p>
          <p>
            {confirmOrderData.address.city}, {confirmOrderData.address.state}{" "}
            {confirmOrderData.address.zip_code}
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => setStep("address")}
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary/20 text-text-light dark:text-text-dark gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-colors duration-300"
          >
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

// -- Payment Step (New Content) --
const PaymentStep: React.FC<StepProps> = ({ setStep, orderId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orderId) {
      console.error("Order ID is missing.");
      return;
    }
    // (c) Payment page - Complete payment
    const result = await dispatch(completePaymentThunk(orderId));
    if (completePaymentThunk.fulfilled.match(result)) {
      navigate(`/order-confirmation/${orderId}`);
    } else {
      console.error("Payment failed");
    }
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Payment Details
      </h2>
      <form onSubmit={handlePaymentSubmit}>
        <div className="px-4 py-3">
          <label className="flex flex-col">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Card Number
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="0000 0000 0000 0000"
              defaultValue=""
              required
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Expiry Date
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="MM / YY"
              defaultValue=""
              required
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              CVC
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="123"
              defaultValue=""
              required
            />
          </label>
        </div>
        <div className="px-4 py-3">
          <label className="flex flex-col">
            <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
              Name on Card
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              placeholder="John M. Doe"
              defaultValue=""
              required
            />
          </label>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => setStep("review")}
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary/20 text-text-light dark:text-text-dark gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-colors duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300"
          >
            Complete Payment
          </button>
        </div>
      </form>
    </div>
  );
};

// --- 5. Main Checkout Page Component ---

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<CheckoutStep>("address");
  const [addressId, setAddressId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const { addressSummary } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAddressSummaryThunk());
  }, [dispatch]);

  // Map address summary to order summary props
  const summaryProps = addressSummary?.summary
    ? {
        items: addressSummary.summary.items.map((item) => ({
          ...item,
          total: item.total || item.price * item.quantity, // Ensure total exists
        })),
        subtotal: addressSummary.summary.subtotal,
        shipping: addressSummary.summary.shipping,
        tax: addressSummary.summary.tax,
        total: addressSummary.summary.total,
      }
    : null;

  const renderStep = () => {
    switch (step) {
      case "address":
        return (
          <AddressStep
            setStep={setStep}
            setAddressId={setAddressId}
            setOrderId={setOrderId}
          />
        );
      case "payment":
        return (
          <PaymentStep
            setStep={setStep}
            addressId={addressId}
            orderId={orderId}
          />
        );
      case "review":
        return (
          <ReviewStep
            setStep={setStep}
            addressId={addressId}
            setOrderId={setOrderId}
          />
        );
      default:
        return (
          <AddressStep
            setStep={setStep}
            setAddressId={setAddressId}
            setOrderId={setOrderId}
          />
        );
    }
  };

  const getTabClassName = (tabStep: CheckoutStep) => {
    const baseClasses =
      "flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 flex-1 cursor-pointer";
    if (step === tabStep) {
      return `${baseClasses} border-b-secondary-link text-text-light dark:text-text-dark`;
    }
    return `${baseClasses} border-b-transparent text-text-light/70 dark:text-gray-400`;
  };

  return (
    <main className="flex-1 mt-8 px-0 sm:px-10">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-text-light dark:text-text-dark text-4xl lg:text-5xl font-black font-display leading-tight tracking-[-0.033em] min-w-72">
          Checkout
        </p>
      </div>

      {/* Tabs */}
      <div className="pb-3 mt-4">
        <div className="flex border-b border-secondary-link  justify-between">
          <a
            className={getTabClassName("address")}
            onClick={() => setStep("address")}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              1. Address
            </p>
          </a>
          <a className={getTabClassName("review")}>
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              2. Review
            </p>
          </a>
          <a className={getTabClassName("payment")}>
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              3. Payment
            </p>
          </a>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
        {/* Conditional Step Content */}
        {renderStep()}

        {/* Order Summary (always visible) */}
        {summaryProps ? (
          <OrderSummary
            items={summaryProps.items}
            subtotal={summaryProps.subtotal}
            shipping={summaryProps.shipping}
            tax={summaryProps.tax}
            total={summaryProps.total}
          />
        ) : (
          <div className="lg:col-span-1">Loading summary...</div>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
