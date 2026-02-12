import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store/store";
import { trackOrderThunk, downloadInvoiceThunk, viewOrderInvoiceThunk, viewGuestOrderInvoiceThunk, downloadGuestInvoiceThunk } from "../redux/slice/authSlice";
import {
  type TrackOrderResponse,
} from "../redux/utilis/authApi";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [trackingInfo, setTrackingInfo] = useState<TrackOrderResponse | null>(
    null
  );
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (orderId) {
      // (f) Get Order at thankyou page
      const id = parseInt(orderId, 10);
      const token = localStorage.getItem("auth_access");
      
      if (!isNaN(id)) {
        if (token) {
          // Logged-in user
          dispatch(trackOrderThunk(id))
            .unwrap()
            .then((res) => setTrackingInfo(res))
            .catch((err) => console.error("Failed to track order", err));
        } else {
          // Guest user - attempt to get info via invoice API
          dispatch(viewGuestOrderInvoiceThunk(id))
            .unwrap()
            .then((res) => {
               setTrackingInfo({
                 order_id: `#${res.order_id}`,
                 status: res.order_status,
                 created_at: res.date
               });
            })
            .catch((err) => console.error("Failed to track guest order", err));
        }
      }
    }
  }, [orderId, dispatch]);

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      const id = parseInt(orderId, 10);
      if (isNaN(id)) throw new Error("Invalid Order ID");
      
      const token = localStorage.getItem("auth_access");
      const action = token ? downloadInvoiceThunk(id) : downloadGuestInvoiceThunk(id);
      
      const blob = await dispatch(action).unwrap();
      // Create a new blob with the correct type to ensure it's treated as a PDF
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Invoice download error:", error);
      toast.error("Failed to download invoice.");
    }
  };

  const handleViewInvoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!orderId) return;
    try {
      const id = parseInt(orderId, 10);
      if (isNaN(id)) throw new Error("Invalid Order ID");
      
      const token = localStorage.getItem("auth_access");
      const action = token ? viewOrderInvoiceThunk(id) : viewGuestOrderInvoiceThunk(id);
      
      const response = await dispatch(action).unwrap();
      
      let formattedData: any;
      const apiResponse = response as any;

      // Check if it's the guest response structure (has 'guest' property or 'summary' object)
      if ('guest' in apiResponse && 'summary' in apiResponse) {
          formattedData = {
              ...apiResponse,
              txn_id: apiResponse.payment.txn_id,
              payment_status: apiResponse.payment.status,
              subtotal: apiResponse.summary.subtotal,
              tax: apiResponse.summary.tax,
              total: apiResponse.summary.total,
              items: apiResponse.items.map((item: any) => ({
                  ...item,
                  qty: item.quantity
              }))
          };
      } else {
        // Logged-in user response structure (from ViewInvoiceResponse)
        formattedData = {
            ...apiResponse,
             txn_id: apiResponse.payment?.txn_id, // Access from payment object
             payment_status: apiResponse.payment?.status, // Access from payment object
             // Calculate subtotal if not present (API gives total)
             subtotal: apiResponse.total, 
             items: apiResponse.items
        };
      }
      
      setInvoiceData(formattedData);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error("Invoice view error:", error);
      toast.error("Failed to view invoice.");
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
                      Order Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[#333333]/60 dark:text-[#F8F4F1]/60 text-sm font-normal leading-normal">
                          Order ID
                        </p>
                        <p className="text-[#333333] dark:text-[#F8F4F1] text-base font-medium leading-normal">
                          {trackingInfo.order_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#333333]/60 dark:text-[#F8F4F1]/60 text-sm font-normal leading-normal">
                          Status
                        </p>                        <p className="text-[#333333] dark:text-[#F8F4F1] text-base font-medium leading-normal capitalize">
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
                <div className="flex justify-center items-center gap-4 mt-2">
                  <a
                    className="text-secondary-link hover:underline text-sm font-medium leading-normal cursor-pointer"
                    href="#"
                    onClick={handleViewInvoice}
                  >
                    View Invoice
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    className="text-secondary-link hover:underline text-sm font-medium leading-normal cursor-pointer"
                    href="#"
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showInvoiceModal && invoiceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1a100c] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800 animate-fade-in-up">
            
            {/* Header Section */}
            <div className="bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#333333] dark:text-[#F8F4F1]">
                            Invoice
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-[#333333]/60 dark:text-[#F8F4F1]/60">
                        Thank you for your purchase!
                    </p>
                </div>
                <div className="text-right">
                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                       invoiceData.payment_status === 'success' 
                       ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                       : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                   }`}>
                       {invoiceData.payment_status}
                   </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 space-y-8">
                
                {/* Order Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-[#333333]/50 dark:text-[#F8F4F1]/50 uppercase tracking-wider font-semibold">Invoice ID</p>
                        <p className="mt-1 font-medium text-[#333333] dark:text-[#F8F4F1] truncate" title={invoiceData.invoice_id}>{invoiceData.invoice_id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#333333]/50 dark:text-[#F8F4F1]/50 uppercase tracking-wider font-semibold">Date</p>
                        <p className="mt-1 font-medium text-[#333333] dark:text-[#F8F4F1]">{new Date(invoiceData.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#333333]/50 dark:text-[#F8F4F1]/50 uppercase tracking-wider font-semibold">Order ID</p>
                        <p className="mt-1 font-medium text-[#333333] dark:text-[#F8F4F1] text-lg">#{invoiceData.order_id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#333333]/50 dark:text-[#F8F4F1]/50 uppercase tracking-wider font-semibold">Transaction ID</p>
                        <p className="mt-1 font-medium text-[#333333] dark:text-[#F8F4F1] text-xs truncate" title={invoiceData.txn_id}>{invoiceData.txn_id}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg border-gray-100 dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-[#333333]/70 dark:text-[#F8F4F1]/70">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Item Description</th>
                                <th className="py-3 px-4 font-semibold text-right">Price</th>
                                <th className="py-3 px-4 font-semibold text-center">Qty</th>
                                <th className="py-3 px-4 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {invoiceData.items.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 font-medium text-[#333333] dark:text-[#F8F4F1]">{item.title}</td>
                                    <td className="py-4 px-4 text-right text-[#333333]/80 dark:text-[#F8F4F1]/80">₹{item.price.toFixed(2)}</td>
                                    <td className="py-4 px-4 text-center text-[#333333]/80 dark:text-[#F8F4F1]/80">{item.qty}</td>
                                    <td className="py-4 px-4 text-right font-semibold text-[#333333] dark:text-[#F8F4F1]">₹{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end">
                    <div className="w-full sm:w-1/2 space-y-3">
                         {invoiceData.subtotal && (
                             <div className="flex justify-between text-sm text-[#333333]/70 dark:text-[#F8F4F1]/70">
                                <span>Subtotal</span>
                                <span>₹{invoiceData.subtotal.toFixed(2)}</span>
                            </div>
                        )}

                         {/* Divider */}
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                        
                        <div className="flex justify-between items-center text-lg font-bold text-[#333333] dark:text-[#F8F4F1]">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{invoiceData.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl flex justify-end gap-3">
                 <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm"
                  >
                    Close
                  </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
