import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import {
  saveAddressThunk,
  placeOrderThunk,
  getAddressSummaryThunk,
  confirmOrderThunk,
  createRazorpayOrderThunk,
  verifyRazorpayPaymentThunk,
  createGuestRazorpayOrderThunk,
  verifyGuestRazorpayPaymentThunk,
  getGuestOrderDetailsThunk,
} from "../redux/slice/authSlice";
import { fetchCartAsync } from "../redux/slice/cartSlice";
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
        ${(item.total || 0).toFixed(2)}
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
          <span>${(subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-light/70 ">
          <span>Shipping</span>
          <span>${(shipping || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-light/70 ">
          <span>Tax</span>
          <span>${(tax || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-text-light dark:text-text-dark mt-2">
          <span>Total</span>
          <span>${(total || 0).toFixed(2)}</span>
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
  isGuest: boolean;
  setGuestAddress?: React.Dispatch<React.SetStateAction<AddressData | null>>;
  guestAddress?: AddressData | null;
  setGuestEmail?: React.Dispatch<React.SetStateAction<string>>;
  setGuestPhone?: React.Dispatch<React.SetStateAction<string>>;
}

// -- Address Step (Replaces Billing Step) --
const AddressStep: React.FC<StepProps> = ({
  setStep,
  setAddressId,
  isGuest,
  setGuestAddress,
  setGuestEmail,
  setGuestPhone,
}) => {
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
      phone_number: (formData.get("phone_number") || formData.get("phone")) as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip_code: formData.get("zip_code") as string,
    };
    
    if (isGuest && setGuestAddress && setGuestEmail && setGuestPhone) {
        setGuestAddress(data);
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        setGuestEmail(email);
        setGuestPhone(phone);
        setStep("review");
        return;
    }

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

  if (!isGuest && hasAddress && !showAddForm) {
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
        {isGuest && (
             <div className="flex flex-col gap-3 px-4 py-3">
             <label className="flex flex-col">
               <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
                 Email Address (Required for Guest Checkout)
               </p>
               <input
                 className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                 name="email"
                 type="email"
                 placeholder="your@email.com"
                 required
               />
             </label>
             <label className="flex flex-col">
               <p className="text-text-light dark:text-gray-500 text-base font-medium leading-normal pb-2">
                 Phone Number (Required for Guest Checkout)
               </p>
               <input
                 className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                 name="phone"
                 type="tel"
                 placeholder="9876543210"
                 required
               />
             </label>
           </div>
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
              Phone Number
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border border-primary/30 bg-background-light  focus:border-primary h-14 placeholder:text-text-light/50 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
              name="phone_number"
              type="tel"
              placeholder="9876543210"
              defaultValue=""
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
        {!isGuest && (
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
        )}
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
  isGuest,
  guestAddress
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { confirmOrderData } = useSelector((state: RootState) => state.auth);

  const handlePlaceOrder = async () => {
    if (isGuest) {
        setStep("payment");
        return;
    }
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

  const address = isGuest ? guestAddress : confirmOrderData?.address;

  if (!address) return <div>Loading review...</div>;

  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Review Order
      </h2>
      <div className="px-4 py-3">
        <div className="bg-white p-4 rounded-lg border border-primary/20 mb-4">
          <h3 className="font-bold mb-2">Shipping Address</h3>
          <p>
            {address.first_name}{" "}
            {address.last_name}
          </p>
          <p>{address.address}</p>
          <p>
            {address.city}, {address.state}{" "}
            {address.zip_code}
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

// -- Payment Step (Razorpay Integration using react-razorpay) --

interface PaymentStepProps extends StepProps {
    guestEmail?: string;
    guestPhone?: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ setStep, addressId, orderId, isGuest, guestEmail, guestPhone, guestAddress }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartState = useSelector((state: RootState) => state.cart);
  const { isLoading, Razorpay } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRazorpayPayment = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    if (isLoading || !Razorpay) {
        // alert("Razorpay SDK is still loading. Please wait a moment.");
        // setIsProcessing(false);
        // return;
        // Commenting out alert to prevent blocking. The button press might work on subsequent tries or if SDK loads fast enough.
        console.warn("Razorpay SDK not fully loaded yet.");
    }

    if (!isGuest && !addressId) {
      toast.error("Address ID is missing. Please select an address.");
      return;
    }

    setIsProcessing(true);

    try {
        let resultAction;
        
        if (isGuest) {
            if(!guestEmail) {
                toast.error("Guest email invalid.");
                setIsProcessing(false);
                return;
            }
            if (!guestAddress) {
                toast.error("Guest address is missing.");
                setIsProcessing(false);
                return;
            }
            if (orderId) {
                // If we already have an order ID, fetch details instead of creating new
                resultAction = await dispatch(getGuestOrderDetailsThunk(orderId));
            } else {
                // Guest Payment
                // Pass cart items so backend can create order
                resultAction = await dispatch(createGuestRazorpayOrderThunk({
                    guest: {
                        name: `${guestAddress.first_name} ${guestAddress.last_name}`,
                        email: guestEmail,
                        phone: guestPhone || ""
                    },
                    items: cartState.items,
                    address: guestAddress
                }));
            }
        } else {
            // Authenticated Payment
            resultAction = await dispatch(createRazorpayOrderThunk(addressId!));
        }


        if (
            (isGuest && (createGuestRazorpayOrderThunk.fulfilled.match(resultAction) || getGuestOrderDetailsThunk.fulfilled.match(resultAction))) ||
            (!isGuest && createRazorpayOrderThunk.fulfilled.match(resultAction))
        ) {
          const payload = resultAction.payload as any;
          const {
            order_id,
            razorpay_order_id,
            amount, 
            amount_paise,
            razorpay_key,
            key_id,
            user_email,
            user_name,
            guest_email
          } = payload;
          
          const key = razorpay_key || key_id;
          const email = guest_email || user_email;
          const finalAmount = amount || amount_paise;


          // 3. Open Razorpay Payment Modal
          const options: any = {
            key: key,
            amount: finalAmount, 
            currency: "INR",
            name: "Book Store",
            description: "Payment Transaction",
            order_id: razorpay_order_id,
            handler: async function (response: any) {
              // 4. Verify Payment
              let verifyResult;
              if (isGuest) {
                 verifyResult = await dispatch(verifyGuestRazorpayPaymentThunk({
                     orderId: order_id,
                     razorpayPaymentId: response.razorpay_payment_id,
                     razorpayOrderId: response.razorpay_order_id,
                     razorpaySignature: response.razorpay_signature
                 }));
              } else {
                 verifyResult = await dispatch(
                    verifyRazorpayPaymentThunk({
                    orderId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    })
                 );
              }
            

              if (
                (isGuest && verifyGuestRazorpayPaymentThunk.fulfilled.match(verifyResult)) ||
                (!isGuest && verifyRazorpayPaymentThunk.fulfilled.match(verifyResult))
              ) {
                navigate(`/order-confirmation/${order_id}`);
              } else {
                 console.error("Verification failed", verifyResult);
                toast.error("Payment Verification Failed. Please try again or contact support.");
              }
            },
            prefill: {
              name: isGuest ? "Guest" : user_name,
              email: email,
              contact: "",
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
                ondismiss: function() {
                    setIsProcessing(false);
                }
            }
          };

          const paymentObject = new Razorpay(options);
          paymentObject.open();
        } else {
          console.error("Create order failed", resultAction);
          toast.error("Failed to initiate payment. Please try again.");
          setIsProcessing(false);
        }
    } catch (err) {
        console.error("Payment initiation error:", err);
        setIsProcessing(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-2xl font-bold font-display leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Payment Method
      </h2>
      <div className="px-4 py-6 bg-white dark:bg-primary/5 rounded-lg border border-primary/20 mx-4">
        <div className="flex flex-col items-center text-center space-y-4">
           <p className="text-text-light dark:text-text-dark font-medium">
             Complete your order securely using Razorpay.
           </p>
           <p className="text-sm text-text-light/70 dark:text-gray-400">
             You will be redirected to the secure payment gateway.
           </p>
        </div>
      </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            type="button"
            onClick={() => setStep("review")}
            disabled={isProcessing}
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary/20 text-text-light dark:text-text-dark gap-2 text-lg font-bold leading-normal tracking-[0.015em] transition-colors duration-300 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="w-full max-w-md mx-auto flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>
    </div>
  );
};

// --- 5. Main Checkout Page Component ---

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<CheckoutStep>("address");
  const [addressId, setAddressId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Guest State
  const [isGuest, setIsGuest] = useState(false);
  const [guestAddress, setGuestAddress] = useState<AddressData | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const { addressSummary } = useSelector((state: RootState) => state.auth);
  const cartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("auth_access");
    if (token) {
        setIsGuest(false);
        dispatch(getAddressSummaryThunk());
    } else {
        setIsGuest(true);
        dispatch(fetchCartAsync());
    }
  }, [dispatch]);

  // Map address summary to order summary props
  // For guest, we use cartState
  let summaryProps = null; 
  
  if (isGuest) {
      if (cartState.items.length > 0 || cartState.summary.final_total > 0) {
        summaryProps = {
            items: cartState.items.map((item) => ({
                book_title: item.book_name,
                price: item.effective_price,
                quantity: item.quantity,
                total: item.effective_price * item.quantity,
                imageUrl: item.cover_image_url
            })),
            subtotal: cartState.summary.subtotal,
            shipping: cartState.summary.shipping,
            tax: 0,
            total: cartState.summary.final_total,
        };
      }
  } else if (addressSummary?.summary) {
      summaryProps = {
        items: addressSummary.summary.items.map((item) => ({
          book_title: item.book_title,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          imageUrl: item.cover_image_url,
          imageAlt: item.book_title
        })),
        subtotal: addressSummary.summary.subtotal,
        shipping: addressSummary.summary.shipping,
        tax: addressSummary.summary.tax,
        total: addressSummary.summary.total,
      };
  }

  const renderStep = () => {
    switch (step) {
      case "address":
        return (
          <AddressStep
            setStep={setStep}
            setAddressId={setAddressId}
            setOrderId={setOrderId}
            isGuest={isGuest}
            setGuestAddress={setGuestAddress}
            setGuestEmail={setGuestEmail}
            setGuestPhone={setGuestPhone}
          />
        );
      case "payment":
        return (
          <PaymentStep
            setStep={setStep}
            addressId={addressId}
            orderId={orderId}
            isGuest={isGuest}
            guestEmail={guestEmail}
            guestPhone={guestPhone}
            guestAddress={guestAddress}
          />
        );
      case "review":
        return (
          <ReviewStep
            setStep={setStep}
            addressId={addressId}
            setOrderId={setOrderId}
            isGuest={isGuest}
            guestAddress={guestAddress}
          />
        );
      default:
        return (
          <AddressStep
            setStep={setStep}
            setAddressId={setAddressId}
            setOrderId={setOrderId}
            isGuest={isGuest}
            setGuestAddress={setGuestAddress}
            setGuestEmail={setGuestEmail}
            setGuestPhone={setGuestPhone}
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
          {isGuest ? "Guest Checkout" : "Checkout"}
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
