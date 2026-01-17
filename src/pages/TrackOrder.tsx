import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { trackOrderThunk, verifyOrderStatusThunk } from "../redux/slice/authSlice";
import { type AppDispatch } from "../redux/store/store";
import { type TrackOrderResponse } from "../redux/utilis/authApi";
import { Search, Package, Calendar, Clock, AlertCircle } from "lucide-react";

const TrackOrderPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [orderData, setOrderData] = useState<TrackOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    // Parse order ID (remove # if present)
    const cleanOrderId = orderId.replace("#", "").trim();
    const numericId = parseInt(cleanOrderId, 10);

    if (isNaN(numericId)) {
      setError("Please enter a valid numeric Order ID (e.g., 12 or #12).");
      setStatus("failed");
      return;
    }

    setStatus("loading");
    setError(null);
    setOrderData(null);

    try {
      const result = await dispatch(trackOrderThunk(numericId)).unwrap();
      
      // Verify latest status including cancellations/refunds
      try {
        const verifyResult = await dispatch(verifyOrderStatusThunk(numericId)).unwrap();
        if (verifyResult && verifyResult.status) {
             result.status = verifyResult.status;
        }
      } catch (e) {
        // Ignore verification error, fall back to track order status
        console.warn("Status verification failed", e);
      }

      setOrderData(result);
      setStatus("succeeded");
    } catch (err) {
      setError(
        (err as string) ||
          "Failed to track order. Please check the ID and try again."
      );
      setStatus("failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-body text-text-light">
      <div className="flex flex-1 justify-center px-4 py-10 md:px-10 lg:px-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-secondary-link">
              Track Your Order
            </h1>
            <p className="mt-2 text-text-light/70">
              Enter your order ID to check its status.
            </p>
          </div>

          <form
            onSubmit={handleTrackOrder}
            className="mb-8 flex flex-col gap-4"
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-light/50">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID (e.g., #12)"
                className="form-input w-full rounded-lg border border-primary/20 bg-white py-3 pl-10 pr-4 text-text-light placeholder-text-light/50 focus:border-primary focus:ring-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {status === "loading" ? "Tracking..." : "Track Order"}
            </button>
          </form>

          {status === "failed" && (
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-600 border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {status === "succeeded" && orderData && (
            <div className="rounded-lg bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-primary/10">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="font-bold text-secondary-link">
                  Order Status
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary capitalize">
                  {orderData.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-text-light/60" />
                  <div>
                    <p className="text-xs text-text-light/60">Order ID</p>
                    <p className="font-medium">{orderData.order_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-text-light/60" />
                  <div>
                    <p className="text-xs text-text-light/60">Date Placed</p>
                    <p className="font-medium">
                      {new Date(orderData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-text-light/60" />
                  <div>
                    <p className="text-xs text-text-light/60">Time</p>
                    <p className="font-medium">
                      {new Date(orderData.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
