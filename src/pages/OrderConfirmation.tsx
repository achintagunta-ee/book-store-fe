import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store/store";
import { trackOrderThunk } from "../redux/slice/authSlice";
import type { TrackOrderResponse } from "../redux/utilis/authApi";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [trackingInfo, setTrackingInfo] = useState<TrackOrderResponse | null>(
    null
  );

  useEffect(() => {
    if (orderId) {
      // (f) Get Order at thankyou page
      const id = parseInt(orderId, 10);
      if (!isNaN(id)) {
        // Automatically fetch tracking info
        dispatch(trackOrderThunk(id))
          .unwrap()
          .then((res) => setTrackingInfo(res))
          .catch((err) => console.error("Failed to track order", err));
      }
    }
  }, [orderId, dispatch]);

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/checkout/orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Invoice download error:", error);
      alert("Failed to download invoice.");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#F8F4F1] dark:bg-[#211511] font-body">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center py-10 px-4">
          <div className="layout-content-container flex flex-col max-w-2xl flex-1">
            <div className="flex flex-col gap-8">
              <div className="text-center">
                <p className="text-[#333333] dark:text-[#F8F4F1] text-4xl lg:text-5xl font-display font-bold leading-tight">
                  Thank you for your order!
                </p>
                <p className="text-[#333333]/80 dark:text-[#F8F4F1]/80 mt-4 text-base font-normal leading-normal">
                  We've received your order and will process it shortly. You'll
                  receive a confirmation email with all the details.
                </p>
              </div>
              <div className="bg-white dark:bg-[#211511]/50 rounded-lg shadow-sm p-6">
                {trackingInfo && (
                  <div className="">
                    <h3 className="text-[#333333] dark:text-[#F8F4F1] text-lg font-bold mb-4">
                      Tracking Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[#333333]/60 dark:text-[#F8F4F1]/60 text-sm font-normal leading-normal">
                          Tracking ID
                        </p>
                        <p className="text-[#333333] dark:text-[#F8F4F1] text-base font-medium leading-normal">
                          {trackingInfo.order_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#333333]/60 dark:text-[#F8F4F1]/60 text-sm font-normal leading-normal">
                          Status
                        </p>
                        <p className="text-[#333333] dark:text-[#F8F4F1] text-base font-medium leading-normal capitalize">
                          {trackingInfo.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#333333]/60 dark:text-[#F8F4F1]/60 text-sm font-normal leading-normal">
                          Date
                        </p>
                        <p className="text-[#333333] dark:text-[#F8F4F1] text-base font-medium leading-normal">
                          {new Date(
                            trackingInfo.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-text-base text-base font-bold leading-normal shadow-md hover:bg-opacity-90 transition-all"
                >
                  <span>Continue Shopping</span>
                </button>
              </div>
              <div className="text-center pt-4">
                <p className="text-[#333333]/80 dark:text-[#F8F4F1]/80 text-sm font-normal leading-normal">
                  A confirmation email has been sent to your email address.
                </p>
                <a
                  className="text-secondary-link  hover:underline text-sm font-medium leading-normal mt-2 inline-block cursor-pointer"
                  // (e) Download Invoice
                  href="#"
                  onClick={handleDownloadInvoice}
                >
                  Download Invoice
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderConfirmation;
