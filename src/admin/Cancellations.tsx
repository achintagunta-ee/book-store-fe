import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Menu, Ban, RefreshCcw } from "lucide-react";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getAdminCancellationRequestsThunk,
  getCancellationStatsThunk,
  processRefundThunk,
  rejectCancellationThunk,
  approveCancellationThunk,
} from "../redux/slice/authSlice";
import type { CancellationRequestItem } from "../redux/utilis/authApi";
import { Check } from "lucide-react";

const CancellationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cancellationRequests, cancellationStats } = useSelector(
    (state: RootState) => state.auth
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending as per user request example
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequestItem | null>(null);

  // Refund Form
  const [refundAmountType, setRefundAmountType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState<string>("");
  const [refundMethod, setRefundMethod] = useState("original_payment");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reject Form
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    dispatch(getCancellationStatsThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAdminCancellationRequestsThunk({
        page: currentPage,
        limit: 10,
        status: statusFilter === "All" ? "" : statusFilter,
      })
    );
  }, [dispatch, currentPage, statusFilter]);

  const requests = cancellationRequests?.results || [];
  const totalPages = cancellationRequests?.total_pages || 1;

  const handleOpenRefund = (req: CancellationRequestItem) => {
    setSelectedRequest(req);
    // Reset form
    setRefundAmountType("full");
    setPartialAmount("");
    setRefundMethod("original_payment");
    setAdminNotes("");
    setShowRefundModal(true);
  };
  const handleOpenReject = (req: CancellationRequestItem) => {
    setSelectedRequest(req);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleApprove = async (req: CancellationRequestItem) => {
    if (!window.confirm("Are you sure you want to approve this cancellation request?")) return;
    try {
      await dispatch(approveCancellationThunk(req.request_id)).unwrap();
      toast.success("Cancellation approved successfully");
      dispatch(getCancellationStatsThunk());
      dispatch(getAdminCancellationRequestsThunk({ page: currentPage, limit: 10, status: statusFilter === "All" ? "" : statusFilter }));
    } catch (error: any) {
      toast.error(error || "Failed to approve cancellation");
    }
  };

  const handleSubmitRefund = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await dispatch(
        processRefundThunk({
          requestId: selectedRequest.request_id,
          data: {
            refund_amount: refundAmountType,
            refund_method: refundMethod,
            admin_notes: adminNotes,
            partial_amount: refundAmountType === "partial" ? parseFloat(partialAmount) : undefined,
          },
        })
      ).unwrap();
      toast.success("Refund processed successfully");
      setShowRefundModal(false);
      // Refresh list and stats
      dispatch(getCancellationStatsThunk());
      dispatch(getAdminCancellationRequestsThunk({ page: currentPage, limit: 10, status: statusFilter === "All" ? "" : statusFilter }));
    } catch (error: any) {
      toast.error(error || "Failed to process refund");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await dispatch(
        rejectCancellationThunk({
          requestId: selectedRequest.request_id,
          data: { reason: rejectReason },
        })
      ).unwrap();
      toast.success("Cancellation rejected successfully");
      setShowRejectModal(false);
      // Refresh list and stats
      dispatch(getCancellationStatsThunk());
      dispatch(getAdminCancellationRequestsThunk({ page: currentPage, limit: 10, status: statusFilter === "All" ? "" : statusFilter }));
    } catch (error: any) {
      toast.error(error || "Failed to reject cancellation");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "refunded":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-10 py-5">
          {/* Header */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#261d1a] hover:text-[#013a67] transition-colors mb-4"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 className="text-card-border text-4xl font-black leading-tight tracking-tight mb-6">
            Cancellations & Refunds
          </h1>

          {/* Dashboard Stats */}
          {cancellationStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2D8D4]">
                <p className="text-gray-500 text-sm font-semibold">Pending Requests</p>
                <p className="text-2xl font-bold text-[#B35E3F]">{cancellationStats.pending_requests}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2D8D4]">
                <p className="text-gray-500 text-sm font-semibold">Processed Today</p>
                <p className="text-2xl font-bold text-[#261d1a]">{cancellationStats.processed_today}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2D8D4]">
                <p className="text-gray-500 text-sm font-semibold">Total Refunds (Month)</p>
                <p className="text-2xl font-bold text-[#261d1a]">{cancellationStats.total_refunds_this_month}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E2D8D4]">
                <p className="text-gray-500 text-sm font-semibold">Refunded Orders (Month)</p>
                <p className="text-2xl font-bold text-[#261d1a]">{cancellationStats.refunded_orders_this_month}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex justify-between items-center mb-4">
             <div className="relative">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 pl-3 pr-8 bg-white border border-[#E2D8D4] rounded-lg text-sm focus:outline-none focus:border-[#B35E3F]"
                >
                    <option value="All">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
             </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-[#E2D8D4] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-[#E2D8D4]">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Req ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Order ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Customer</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Reason</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Req Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Requested At</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8D4]">
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req.request_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-[#261d1a]">#{req.request_id}</td>
                        <td className="px-6 py-4 text-sm text-[#261d1a]">#{req.order_id}</td>
                        <td className="px-6 py-4 text-sm text-[#261d1a]">
                            <div>{typeof req.customer === 'string' ? req.customer : req.customer?.name}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#261d1a] max-w-xs truncate" title={req.reason}>
                            {req.reason}
                        </td>
                         <td className="px-6 py-4 text-sm text-[#261d1a]">₹{req.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#261d1a]">
                             {new Date(req.requested_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                            {req.status === 'pending' || req.status === 'pending_review' ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleApprove(req)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Approve Cancellation"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenRefund(req)}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        title="Approve & Refund"
                                    >
                                        <RefreshCcw size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenReject(req)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        title="Reject Request"
                                    >
                                        <Ban size={18} />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400">Processed</span>
                            )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No cancellation requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center p-4 border-t border-[#E2D8D4]">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            )}
          </div>
        </div>
      </main>

      {/* Refund Modal */}
      {showRefundModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#261d1a]">Process Refund</h2>
                    <button onClick={() => setShowRefundModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Refund Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    name="refundType" 
                                    value="full" 
                                    checked={refundAmountType === "full"}
                                    onChange={() => setRefundAmountType("full")}
                                    className="mr-2"
                                />
                                Full Refund
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    name="refundType" 
                                    value="partial" 
                                    checked={refundAmountType === "partial"}
                                    onChange={() => setRefundAmountType("partial")}
                                    className="mr-2"
                                />
                                Partial Refund
                            </label>
                        </div>
                    </div>

                    {refundAmountType === "partial" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partial Amount</label>
                            <input 
                                type="number" 
                                value={partialAmount}
                                onChange={(e) => setPartialAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#B35E3F] focus:border-[#B35E3F]"
                                placeholder="Enter amount"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                        <select 
                            value={refundMethod}
                            onChange={(e) => setRefundMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#B35E3F] focus:border-[#B35E3F]"
                        >
                            <option value="original_payment">Original Payment Method</option>
                            <option value="store_credit">Store Credit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                        <textarea 
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#B35E3F] focus:border-[#B35E3F]"
                            rows={3}
                            placeholder="Add notes..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setShowRefundModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmitRefund}
                            disabled={isProcessing}
                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : "Process Refund"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#261d1a]">Reject Cancellation</h2>
                    <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                        <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#B35E3F] focus:border-[#B35E3F]"
                            rows={4}
                            placeholder="e.g. Order already shipped"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setShowRejectModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmitReject}
                            disabled={isProcessing}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {isProcessing ? "Processing..." : "Reject Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CancellationsPage;
