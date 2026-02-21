import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { User, X, Clock } from "lucide-react";
import { type RootState, type AppDispatch } from "../redux/store/store";
import {
  updateUserProfileThunk,
  getCurrentUserThunk,
  getOrderHistoryThunk,
  getOrderDetailsThunk,
  getUserPaymentsThunk,
  downloadInvoiceThunk,
  requestCancellationThunk,
  getCancellationStatusThunk,
  completePaymentAfterExpiryThunk,
  getOrderTimelineThunk,
} from "../redux/slice/authSlice";
import {
  getAddressesThunk,
  addAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
} from "../redux/slice/authSlice";
import {
  type AddressItem,
  type AddressData,
  type OrderHistoryItem,
  type OrderDetailResponse,
  type UserProfile,
  type UserPayment,
  type OrderTimelineItem,
} from "../redux/utilis/authApi";
import AdminPagination from "../components/admin/AdminPagination";

// --- Order History Table Sub-Component ---

const OrderHistoryTable: React.FC<{
  orders: OrderHistoryItem[];
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: number) => void;
  onViewTimeline: (id: number) => void;
}> = ({ orders, page, totalPages, totalItems, onPageChange, onViewDetails, onViewTimeline }) => {
  const statusStyles: Record<string, string> = {
    Shipped: "bg-shipped",
    Delivered: "bg-delivered",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <section className="mt-8">
      <h2 className="text-[#333333] text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-display">
        Order History
      </h2>
      <div className="px-4 py-3">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-[#e6d8d1] bg-[#fbf9f8] shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f3ebe8]">
              <tr>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Order ID</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Customer Name</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Date</th>
                <th className="px-4 py-4 text-left text-[#333333] w-auto text-sm font-semibold leading-normal font-body">Book Title</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Price</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Qty</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Total</th>
                <th className="px-4 py-4 text-left text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Status</th>
                <th className="px-4 py-4 text-right text-[#333333] whitespace-nowrap text-sm font-semibold leading-normal font-body">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d8d1]">
              {safeOrders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top">
                    <button
                      onClick={() => onViewDetails(order.raw_id)}
                      className="text-primary hover:underline font-semibold"
                    >
                      {order.order_id.replace("#", "")}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top capitalize">
                    {order.customer_name || "-"}
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top">{order.date}</td>
                  
                  {/* Book Titles */}
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top">
                    <div className="flex flex-col gap-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="h-6 flex items-center">
                           <span className="truncate max-w-[300px]" title={item.book_title}>{item.book_title}</span>
                        </div>
                      ))}
                      {(!order.items || order.items.length === 0) && <div className="h-6 flex items-center"><span className="text-gray-400 italic">No items</span></div>}
                    </div>
                  </td>

                  {/* Prices */}
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top">
                    <div className="flex flex-col gap-2">
                       {order.items?.map((item, idx) => (
                          <div key={idx} className="h-6 flex items-center">
                             <span>₹{item.price.toFixed(2)}</span>
                          </div>
                       ))}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-4 text-gray-600 text-sm font-normal font-body align-top">
                    <div className="flex flex-col gap-2">
                       {order.items?.map((item, idx) => (
                          <div key={idx} className="h-6 flex items-center pl-2">
                             <span>{item.quantity}</span>
                          </div>
                       ))}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-600 text-sm font-bold font-body align-top">₹{order.total.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm font-normal align-top">
                    <span className={`inline-flex items-center justify-center rounded-full h-7 px-3 text-xs font-bold font-body capitalize ${statusStyles[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right align-top">
                    <button 
                      className="px-3 py-1.5 border border-primary text-primary text-xs font-bold rounded hover:bg-primary hover:text-white transition-colors"
                      onClick={() => onViewDetails(order.raw_id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="ml-2 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-100 transition-colors flex inline-flex items-center gap-1"
                      onClick={() => onViewTimeline(order.raw_id)}
                      title="View Timeline"
                    >
                      <Clock size={12} /> Timeline
                    </button>
                  </td>
                </tr>
              ))}
              {safeOrders.length === 0 && (
                <tr>
                   <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {safeOrders.map((order) => (
            <div key={order.order_id} className="bg-[#fbf9f8] border border-[#e6d8d1] rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order ID</span>
                    <p className="font-bold text-[#333333]">
                      <button
                        onClick={() => onViewDetails(order.raw_id)}
                        className="text-primary hover:underline"
                      >
                        {order.order_id.replace("#", "")}
                      </button>
                    </p>
                    {order.customer_name && (
                      <>
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mt-2">Customer Name</span>
                        <p className="text-sm font-bold text-[#333333] capitalize">{order.customer_name}</p>
                      </>
                    )}
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[order.status.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                    {order.status}
                 </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-[#e6d8d1] pt-3 mt-1">
                 <div>
                    <span className="text-xs text-gray-500 block">Date</span>
                    <p className="text-sm text-gray-700">{order.date}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total</span>
                    <p className="text-sm font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                 </div>
              </div>

               {/* Mobile Items List */}
               <div className="border-t border-[#e6d8d1] pt-3 mt-1">
                  <span className="text-xs text-gray-500 block mb-2 font-semibold uppercase tracking-wider">Order Items</span>
                  <div className="flex flex-col gap-2 bg-white/50 p-2 rounded-lg border border-gray-100">
                    <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 mb-1 border-b border-gray-100 pb-1">
                       <div className="col-span-6">Title</div>
                       <div className="col-span-3 text-right">Price</div>
                       <div className="col-span-3 text-right">Qty</div>
                    </div>
                    {order.items?.map((item, idx) => (
                       <div key={idx} className="grid grid-cols-12 text-sm items-center">
                          <div className="col-span-6 truncate pr-1" title={item.book_title}>{item.book_title}</div>
                          <div className="col-span-3 text-right text-xs">₹{item.price}</div>
                          <div className="col-span-3 text-right text-xs">x{item.quantity}</div>
                       </div>
                    ))}
                    {(!order.items || order.items.length === 0) && <span className="text-gray-400 italic text-xs">No items details available</span>}
                  </div>
               </div>

              <button 
                onClick={() => onViewDetails(order.raw_id)}
                className="w-full mt-2 py-2.5 bg-white border border-[#e6d8d1] rounded-lg text-primary text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => onViewTimeline(order.raw_id)}
                className="w-full mt-2 py-2.5 bg-white border border-[#e6d8d1] rounded-lg text-gray-600 text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Clock size={14} /> View Timeline
              </button>
            </div>
          ))}
          {safeOrders.length === 0 && <p className="text-gray-500 text-center py-4">No orders found.</p>}
        </div>
        {/* Pagination Controls */}
        {/* Pagination Controls */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={totalItems}
        />
      </div>
    </section>
  );

};


// --- Payment Details Modal ---
const PaymentDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  payment: UserPayment | null;
}> = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-5 md:p-8 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold text-[#333333] mb-6">
          Payment Details
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Payment ID</p>
            <p className="font-semibold">{payment.payment_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-semibold break-all">{payment.txn_id || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">
              {new Date(payment.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-semibold">₹{payment.amount.toFixed(2)}</p>
          </div>
          <div>
             <p className="text-sm text-gray-500">Method</p>
             <p className="font-semibold capitalize">{payment.method}</p>
          </div>
          <div>
             <p className="text-sm text-gray-500">Type</p>
             <p className="font-semibold capitalize">{payment.type || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-flex items-center justify-center rounded-full h-6 px-3 text-xs font-bold capitalize ${
                payment.status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {payment.status}
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transaction-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UserPaymentsTable: React.FC<{
  payments: UserPayment[];
  customerName?: string;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onDownloadInvoice: (orderId: number) => Promise<void>;
}> = ({ payments, customerName, page, totalPages, totalItems, onPageChange, onDownloadInvoice }) => {
  const [selectedPayment, setSelectedPayment] = useState<UserPayment | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (id: number) => {
    setDownloadingId(id);
    try {
      await onDownloadInvoice(id);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-[#333333] text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-display">
        My Payments
      </h2>
      <div className="px-4 py-3">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-[#e6d8d1] bg-[#fbf9f8] shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f3ebe8]">
              <tr>
                <th className="px-6 py-4 text-left text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Payment ID</th>
                <th className="px-6 py-4 text-left text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-4 text-left text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-right text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 text-center text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Method</th>
                <th className="px-6 py-4 text-center text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Type</th>
                <th className="px-6 py-4 text-center text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-[#333333] text-sm font-semibold font-body whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d8d1]">
              {payments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 text-sm font-body align-middle whitespace-nowrap">
                     <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-primary hover:underline font-bold"
                     >
                        {payment.payment_id}
                     </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body align-middle">
                    <span className="block max-w-[150px] truncate" title={payment.txn_id}>
                      {payment.txn_id || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body align-middle capitalize whitespace-nowrap">
                    {payment.customer_name || customerName || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body align-middle whitespace-nowrap">{new Date(payment.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body align-middle text-right whitespace-nowrap">₹{payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body capitalize align-middle text-center">{payment.method}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm font-body capitalize align-middle text-center">{payment.type || "-"}</td>
                  <td className="px-6 py-4 text-sm align-middle text-center">
                    <span className={`inline-flex items-center justify-center rounded-full h-7 px-4 text-xs font-bold font-body capitalize ${
                      payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right align-middle whitespace-nowrap">
                    <button 
                      onClick={() => handleDownload((payment.raw_id || payment.order_id) as number)}
                      disabled={downloadingId === ((payment.raw_id || payment.order_id) as number)}
                      className="text-primary hover:underline font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === ((payment.raw_id || payment.order_id) as number) ? "Downloading..." : "Download Invoice"}
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {payments.map((payment) => (
            <div key={payment.payment_id} className="bg-[#fbf9f8] border border-[#e6d8d1] rounded-xl p-4 shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-center">
                 <div>
                   <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">Payment ID</span>
                   <button
                      onClick={() => setSelectedPayment(payment)}
                      className="font-bold text-[#333333] hover:text-primary hover:underline"
                   >
                      {payment.payment_id}
                   </button>
                 </div>
                 <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                      payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {payment.status}
                 </span>
               </div>
               
               <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Txn ID</span>
                    <span className="text-gray-900 break-all pl-4 text-right">{payment.txn_id || "-"}</span>
                  </div>
                  {(payment.customer_name || customerName) && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Customer Name</span>
                      <span className="text-gray-900 capitalize text-right">{payment.customer_name || customerName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900 text-right">{new Date(payment.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-gray-900 font-bold text-right">₹{payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Method</span>
                    <span className="text-gray-900 capitalize text-right">{payment.method}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900 capitalize text-right">{payment.type || "-"}</span>
                  </div>
               </div>

               <button 
                  onClick={() => handleDownload((payment.raw_id || payment.order_id) as number)}
                  disabled={downloadingId === ((payment.raw_id || payment.order_id) as number)}
                  className="w-full mt-2 py-2 bg-white border border-[#e6d8d1] text-primary rounded-lg font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {downloadingId === ((payment.raw_id || payment.order_id) as number) ? "Downloading..." : "Download Invoice"}
               </button>
            </div>
          ))}
          {payments.length === 0 && <p className="text-gray-500 text-center py-4">No payments found.</p>}
        </div>
        
        {/* Pagination Controls */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={totalItems}
        />
        
        {/* Modal */}
        <PaymentDetailsModal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} payment={selectedPayment} />
      </div>
    </section>
  );
};

// --- Timeline Modal ---
const TimelineModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  timeline: OrderTimelineItem[] | null;
  loading: boolean;
}> = ({ isOpen, onClose, timeline, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-5 md:p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#333333]">Order Timeline</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} /> 
          </button>
        </div>

        {loading ? (
             <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
        ) : (
             <div className="space-y-6 relative pl-2">
                {timeline && timeline.length > 0 ? (
                    timeline.map((event, index) => (
                        <div key={index} className="flex gap-4 relative">
                             {/* Line connector */}
                             {index !== timeline.length - 1 && (
                                 <div className="absolute left-[5px] top-3 bottom-[-24px] w-0.5 bg-gray-200"></div>
                             )}
                             
                             <div className={`shrink-0 w-3 h-3 rounded-full mt-1.5 ${index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-300'}`}></div>
                             
                             <div className="pb-1">
                                 <p className="font-bold text-[#333333] text-sm">{event.label}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">{new Date(event.time).toLocaleString()}</p>
                                 <p className="text-xs text-gray-400 capitalize mt-0.5">{event.status.replace('_', ' ')}</p>
                             </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No timeline data available.</p>
                )}
             </div>
        )}
        
        <div className="mt-8 flex justify-end">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transaction-colors text-sm"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

// --- Address Components ---

const AddressModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  address?: AddressItem;
}> = ({ isOpen, onClose, address }) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  useEffect(() => {
    if (address) {
      // Attempt to split full_name if first/last are missing (GET vs PUT response diff)
      let fName = address.first_name || "";
      let lName = address.last_name || "";
      if (!fName && !lName && address.full_name) {
        const parts = address.full_name.split(" ");
        fName = parts[0];
        lName = parts.slice(1).join(" ");
      }

      setFormData({
        first_name: fName,
        last_name: lName,
        phone_number: address.phone_number || "",
        address: address.address,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
      });
    }
  }, [address, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formData as AddressData; // unsafe cast but sufficient for now as we added field to state
    try {
      if (address) {
        await dispatch(
          updateAddressThunk({ id: address.id, data: payload })
        ).unwrap();
        toast.success("Address updated");
      } else {
        await dispatch(addAddressThunk(payload)).unwrap();
        toast.success("Address added");
      }
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to save address");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-5 md:p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="mb-4 text-2xl font-bold text-[#333333]">
          {address ? "Edit Address" : "Add Address"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
          </div>
          <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="h-12 w-full rounded-lg border border-black/10 p-4"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
              required
            />
          </div>
          <input
            type="text"
            name="zip_code"
            placeholder="Zip Code"
            value={formData.zip_code}
            onChange={handleChange}
            className="h-12 w-full rounded-lg border border-black/10 p-4"
            required
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteAddressModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-5 md:p-8 shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-[#333333]">
          Delete Address
        </h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { addresses, addressMeta } = useSelector(
    (state: RootState) => state.auth
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | undefined>(
    undefined
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use state for pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAddressesThunk(page));
  }, [dispatch, page]);

  const handleDelete = (id: number) => {
    if (!id) {
      toast.error("Invalid address ID");
      return;
    }
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAddressThunk(addressToDelete)).unwrap();
      toast.success("Address deleted");
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (err: any) {
      toast.error(err || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  return (
    <section className="mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#333333]">Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(undefined);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90"
        >
          Add Address
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {safeAddresses.map((addr) => (
          <div
            key={addr.id}
            className="border border-[#e6d8d1] p-4 rounded-lg shadow-sm bg-[#fbf9f8]"
          >
            <p className="font-bold text-[#333333]">
              {addr.full_name || `${addr.first_name} ${addr.last_name}`}
            </p>
            <p className="text-gray-600">{addr.phone_number}</p>
            <p className="text-gray-600">{addr.address}</p>
            <p className="text-gray-600">
              {addr.city}, {addr.state} {addr.zip_code}
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => {
                  setEditingAddress(addr);
                  setIsModalOpen(true);
                }}
                className="text-primary text-sm font-semibold hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-red-600 text-sm font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {safeAddresses.length === 0 && (
          <p className="text-gray-500">No addresses found.</p>
        )}
      </div>
      
      {/* Pagination Controls */}
      {addressMeta && addressMeta.total_pages && addressMeta.total_pages > 1 && (
        <AdminPagination
          currentPage={page}
          totalPages={addressMeta.total_pages || 1}
          onPageChange={setPage}
          totalResults={addressMeta.total || 0}
        />
      )}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={editingAddress}
      />
      <DeleteAddressModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </section>
  );
};

// --- Main Profile Page Component ---

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; username: string };
}> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    setFormData({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("username", formData.username);
    if (profileImage) {
      data.append("profile_image", profileImage);
    }
    try {
      await dispatch(updateUserProfileThunk(data)).unwrap();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to update profile.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-5 md:p-8 shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-text-main">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/10 p-4"
            />
          </div>
          <div>
            <label
              htmlFor="profile_image"
              className="pb-2 text-sm font-semibold text-text-main"
            >
              Profile Image
            </label>
            <input
              type="file"
              name="profile_image"
              id="profile_image"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-secondary-link hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetailResponse | null;
}> = ({ isOpen, onClose, order }) => {
  const dispatch: AppDispatch = useDispatch();
  const { cancellationStatus } = useSelector((state: RootState) => state.auth);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNotes, setCancelNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      dispatch(getCancellationStatusThunk(order.order.id));
      setShowCancelForm(false);
      setCancelReason("");
      setCancelNotes("");
    }
  }, [isOpen, order, dispatch]);

  const handleRequestCancellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        requestCancellationThunk({
          orderId: order.order.id,
          data: { reason: cancelReason, additional_notes: cancelNotes },
        })
      ).unwrap();
      await dispatch(getCancellationStatusThunk(order.order.id));
      toast.success("Cancellation request submitted");
      setShowCancelForm(false);
    } catch (err: any) {
      toast.error(err || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePayment = async () => {
    if (!order) return;
    try {
      const res = await dispatch(completePaymentAfterExpiryThunk(order.order.id)).unwrap();
      if (res.detail) {
        toast.error(res.detail);
      } else {
        toast.success(res.message || "Payment completed successfully");
        onClose();
      }
    } catch (err: any) {
      let msg = "Payment failed or expired";
      if (err?.detail) msg = err.detail;
      else if (err?.message) msg = err.message;
      else if (typeof err === "string") {
          try {
              const parsed = JSON.parse(err);
              if (parsed.detail) msg = parsed.detail;
              else msg = err;
          } catch {
              msg = err;
          }
      }
      toast.error(msg);
    }
  };

  const getCancellationStatusColor = (status: string) => {
    switch (status) {
       case 'pending': return 'text-yellow-600 bg-yellow-100';
       case 'approved': return 'text-green-600 bg-green-100';
       case 'rejected': return 'text-red-600 bg-red-100';
       default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen || !order) return null;

  const canCancel = ['pending', 'paid', 'processing'].includes(order.order.status.toLowerCase()) && !cancellationStatus?.request_id;
  const hasRequest = !!cancellationStatus?.request_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6">
      <div className="w-full max-w-2xl rounded-lg bg-white p-5 md:p-8 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#333333]">
            Order Details #{order.order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">
              {new Date(order.order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold capitalize">{order.order.status}</p>
          </div>
        </div>
        
        {/* Cancellation Info */}
        {hasRequest && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm font-semibold mb-1">Cancellation Request</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Request ID: #{cancellationStatus.request_id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getCancellationStatusColor(cancellationStatus.status)}`}>
                        {cancellationStatus.status}
                    </span>
                </div>
                 <p className="text-xs text-gray-500 mt-1">{cancellationStatus.message}</p>
            </div>
        )}

        <div className="mb-6">
          <h4 className="font-bold text-lg mb-3">Items</h4>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                   <p className="font-medium text-gray-800">{item.book_title}</p>
                   <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">
              ₹{(order.order.subtotal || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold">
              ₹{(order.order.shipping || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">
              ₹{(order.order.total || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {order.order.status.toLowerCase() === 'pending' && (
          <div className="mt-6 flex justify-end gap-3">
             <button 
                onClick={handleCompletePayment}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                Complete Payment
              </button>
             {!showCancelForm && (
              <button 
                  onClick={() => setShowCancelForm(true)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                  Request Cancellation
              </button>
             )}
          </div>
        )}
        
        {canCancel && !showCancelForm && order.order.status.toLowerCase() !== 'pending' && (
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={() => setShowCancelForm(true)}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                    Request Cancellation
                </button>
            </div>
        )}

        {showCancelForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg mb-3">Request Cancellation</h4>
                <form onSubmit={handleRequestCancellation} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <select 
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Found better price">Found better price</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea 
                            value={cancelNotes}
                            onChange={(e) => setCancelNotes(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={2}
                            placeholder="Optional details..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                         <button 
                            type="button"
                            onClick={() => setShowCancelForm(false)}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                         <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        )}

      </div>
    </div>
  );
};

const ProfileInfo: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <section className="mt-8 px-4">
      <h2 className="text-[#333333] text-2xl font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 font-display">
        Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-8xl">
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Username</p>
          <p className="font-semibold text-[#333333] break-all">{user.username}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="font-semibold text-[#333333] break-all">{user.email}</p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Full Name</p>
          <p className="font-semibold text-[#333333]">
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Role</p>
          <p className="font-semibold text-[#333333] capitalize">{user.role}</p>
        </div>

        <div className="p-4 rounded-lg bg-[#fbf9f8] border border-[#e6d8d1]">
          <p className="text-sm text-gray-500 mb-1">Account Created</p>
          <p className="font-semibold text-[#333333]">
            {new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </section>
  );
};

const UserProfilePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userProfile, orderHistory, currentOrder, userPayments, orderTimeline, orderTimelineStatus } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses" | "payments"
  >("profile");

  useEffect(() => {
    dispatch(getCurrentUserThunk());
  }, [dispatch]);

  const { profileStatus } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userProfile && profileStatus === "failed") {
      navigate("/login");
    }
  }, [userProfile, profileStatus, navigate]);

  useEffect(() => {
    if (activeTab === "orders") {
      dispatch(getOrderHistoryThunk(orderPage));
    } else if (activeTab === "payments") {
      dispatch(getUserPaymentsThunk(paymentsPage));
    }
  }, [activeTab, orderPage, paymentsPage, dispatch]);


  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const blob = await dispatch(downloadInvoiceThunk(orderId)).unwrap();
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Invoice downloaded successfully");
    } catch (e) {
      toast.error("Failed to download invoice");
    }
  };

  const handleViewDetails = async (id: number) => {
    await dispatch(getOrderDetailsThunk(id));
    setIsOrderModalOpen(true);
  };

  const handleViewTimeline = async (id: number) => {
    setIsTimelineModalOpen(true);
    await dispatch(getOrderTimelineThunk(id));
  };

  // Render a loading state or null while redirecting
  if (!userProfile) {
    return null;
  }



  return (
    <>
      <main className="flex-grow mt-4 md:mt-8 p-3 md:p-5">
        <div className="p-2 md:p-4">
          <div className="flex w-full flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
              <div className="flex shrink-0 h-32 w-32 items-center justify-center rounded-full bg-gray-100 border border-gray-200 shadow-sm overflow-hidden">
                {userProfile.profile_image_url || userProfile.profile_image ? (
                  <img
                    src={
                      (userProfile.profile_image_url || userProfile.profile_image) ?? undefined
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-[#333333] text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
                  {userProfile.first_name} {userProfile.last_name}
                </h1>
                <p className="text-gray-500 text-base font-normal leading-normal font-body break-all">
                  {userProfile.email}
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full md:w-auto gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f3ebe8] hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#333333] dark:text-white text-sm font-semibold transition-colors flex-1 md:flex-auto"
              >
                <span className="truncate font-body">Edit Profile</span>
              </button>

            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="pb-3">
            <div className="flex border-b border-[#e6d8d1] px-2 md:px-4 gap-4 md:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors px-2 md:px-0 ${
                  activeTab === "profile"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Profile Info
                </p>
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors px-2 md:px-0 ${
                  activeTab === "orders"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Order History
                </p>
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors px-2 md:px-0 ${
                  activeTab === "addresses"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Addresses
                </p>
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors px-2 md:px-0 ${
                  activeTab === "payments"
                    ? "border-b-primary text-[#333333]"
                    : "border-b-transparent text-gray-500 hover:text-[#333333]"
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] font-body">
                  Payments
                </p>
              </button>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-logout dark:text-red-400 pb-[13px] pt-4 hover:text-red-700 transition-colors px-2 md:px-0"
                href="#"
              >
              </a>
            </div>
          </div>
        </div>

        {activeTab === "profile" && <ProfileInfo user={userProfile} />}
        {activeTab === "orders" && (
          <OrderHistoryTable
            orders={orderHistory?.results || []}
            page={orderPage}
            totalPages={orderHistory?.total_pages || 1}
            totalItems={orderHistory?.total_items || 0}
            onPageChange={setOrderPage}
            onViewDetails={handleViewDetails}
            onViewTimeline={handleViewTimeline}
          />

        )}
        {activeTab === "addresses" && <AddressList />}
        {activeTab === "payments" && (
          <UserPaymentsTable 
            payments={userPayments?.results || []}
            customerName={userPayments?.filters?.customer_name}
            page={paymentsPage}
            totalPages={userPayments?.total_pages || 1}
            totalItems={userPayments?.total_items || 0}
            onPageChange={setPaymentsPage}
            onDownloadInvoice={handleDownloadInvoice} 
          />
        )}
      </main>
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        user={{
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          username: userProfile.username,
        }}
      />
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={currentOrder}
      />
      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        timeline={orderTimeline}
        loading={orderTimelineStatus === 'loading'}
      />
      <Toaster position="top-right" />
    </>
  );
};

export default UserProfilePage;
