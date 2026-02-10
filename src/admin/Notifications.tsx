import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Eye } from "lucide-react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getAdminNotificationsThunk,
  viewAdminNotificationThunk,
  notifyCustomerThunk,
  resendNotificationThunk,
} from "../redux/slice/authSlice";

const AdminNotificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminNotifications, currentAdminNotification } = useSelector(
    (state: RootState) => state.auth
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isNotifying, setIsNotifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const source = activeTab === "all" ? undefined : activeTab;
    dispatch(getAdminNotificationsThunk(source));
  }, [dispatch, activeTab]);

  const handleViewDetails = async (id: number) => {
    await dispatch(viewAdminNotificationThunk(id));
    setShowDetailModal(true);
  };

  const notifications = adminNotifications || [];

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        <div className="px-10 py-5">
          {/* Header */}

          <div className="flex flex-wrap justify-between gap-3 p-4">
            <h1 className="text-card-border text-4xl font-black leading-tight tracking-tight">
               Notifications
            </h1>
          </div>

          {/* Type Filter Tabs */}
          <div className="px-4 mb-4 flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "all"
                  ? "bg-[#B35E3F] text-white"
                  : "bg-white text-card-border hover:bg-gray-100"
              }`}
            >
              All
            </button>
            {/* Removed Inventory tab */ }
            <button
              onClick={() => setActiveTab("order")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === "order"
                  ? "bg-[#B35E3F] text-white"
                  : "bg-white text-card-border hover:bg-gray-100"
              }`}
            >
              Orders
            </button>
          </div>

          {/* Table */}
          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-lg border border-[#e2d8d4] bg-background-light">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background-light border-b border-[#e2d8d4]">
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Content
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Source
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-card-border text-sm font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2d8d4]">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <tr
                          key={notification.notification_id}
                          className="hover:bg-primary/5 transition-colors"
                        >
                          <td className="h-[72px] px-4 py-2 text-text-main text-sm">
                            #{notification.notification_id}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-text-main text-sm font-medium">
                            {notification.title}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-text-main text-sm truncate max-w-xs">
                            {notification.content}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-text-main text-sm capitalize">
                            {notification.trigger_source} #{notification.related_id ?? notification.order_id ?? notification.purchase_id}
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                              {notification.notification_status || notification.status}
                            </span>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-text-main text-sm">
                            {new Date(notification.created_at).toLocaleString()}
                          </td>
                          <td className="h-[72px] px-4 py-2">
                            <button
                              onClick={() =>
                                handleViewDetails(notification.notification_id)
                              }
                              className="text-[#B35E3F] hover:text-card-border text-sm font-bold transition-colors flex items-center gap-1"
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-4 text-gray-500"
                        >
                          No notifications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && currentAdminNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4 relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-card-border mb-6">
              Notification Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                  Title
                </h3>
                <p className="text-text-main text-lg font-medium">
                  {currentAdminNotification.title}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                  Content
                </h3>
                <p className="text-text-main bg-gray-50 p-3 rounded-md border border-gray-100 mt-1">
                  {currentAdminNotification.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                    Source
                  </h3>
                  <p className="text-text-main capitalize">
                    {currentAdminNotification.trigger_source} #
                    {currentAdminNotification.related_id ?? currentAdminNotification.order_id ?? currentAdminNotification.purchase_id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                    Status
                  </h3>
                  <p className="text-text-main capitalize">
                    {currentAdminNotification.notification_status || currentAdminNotification.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                    Channel
                  </h3>
                  <p className="text-text-main capitalize">
                    {currentAdminNotification.channel}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                    Recipient Role
                  </h3>
                  <p className="text-text-main capitalize">
                    {currentAdminNotification.recipient_role}
                  </p>
                </div>
              </div>

               <div>
                <h3 className="text-sm font-bold text-[#261d1a] uppercase tracking-wider">
                  Date
                </h3>
                <p className="text-text-main">
                  {new Date(currentAdminNotification.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {currentAdminNotification.trigger_source === "order" && (
                <button
                  onClick={() => {
                    const relatedId = currentAdminNotification.related_id ?? currentAdminNotification.order_id;
                    if (relatedId) {
                      setIsNotifying(true);
                      dispatch(notifyCustomerThunk(relatedId))
                        .unwrap()
                        .then(() => {
                           toast.success("Customer notified successfully!");
                        })
                        .catch((err) => {
                          toast.error(err || "Failed to notify customer");
                        })
                        .finally(() => setIsNotifying(false));
                    }
                  }}
                  disabled={isNotifying}
                  className="px-6 py-2 rounded-lg text-white bg-[#B35E3F] hover:bg-[#8e4b32] transition-colors disabled:opacity-50"
                >
                  {isNotifying ? "Sending..." : "Notify Customer"}
                </button>
              )}
              <button
                onClick={() => {
                  if (currentAdminNotification.notification_id) {
                    setIsResending(true);
                    dispatch(resendNotificationThunk(currentAdminNotification.notification_id))
                      .unwrap()
                      .then(() => {
                        toast.success("Notification resent successfully!");
                        setShowDetailModal(false);
                      })
                      .catch((err) => {
                        toast.error(err || "Failed to resend notification");
                      })
                      .finally(() => setIsResending(false));
                  }
                }}
                disabled={isResending}
                className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 rounded-lg text-white bg-card-border hover:bg-card-border/90 transition-colors"
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

export default AdminNotificationsPage;
