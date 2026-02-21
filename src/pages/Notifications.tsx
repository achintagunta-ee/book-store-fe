import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store/store";
import {
  fetchNotificationsThunk,
  viewNotificationThunk,
} from "../redux/slice/authSlice";
import {
  Bell,
  CheckCircle,
  Truck,
  Package,
  Info,
  X,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import AdminPagination from "../components/admin/AdminPagination";

const NotificationsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    notifications,
    notificationsStatus,
    notificationsError,
    currentNotification,
    currentNotificationStatus,
    notificationsMeta,
  } = useSelector((state: RootState) => state.auth);

  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotificationsThunk({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewNotification = (id: number) => {
    setSelectedNotificationId(id);
    dispatch(viewNotificationThunk(id));
  };

  const closeDetail = () => {
    setSelectedNotificationId(null);
  };

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("delivered"))
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (title.toLowerCase().includes("shipped"))
      return <Truck className="h-6 w-6 text-blue-500" />;
    if (title.toLowerCase().includes("processing"))
      return <Package className="h-6 w-6 text-orange-500" />;
    return <Info className="h-6 w-6 text-primary" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Stay updated with your orders and account activity
            </p>
          </div>
        </header>

        {notificationsStatus === "loading" && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {notificationsStatus === "failed" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <Info className="h-5 w-5" />
            <p>{notificationsError || "Failed to load notifications."}</p>
          </div>
        )}

        {notificationsStatus === "succeeded" && notifications.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              You're all caught up! We'll notify you when you have new activity.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {(notifications || []).map((notification) => (
            <div
              key={notification.notification_id}
              onClick={() => handleViewNotification(notification.notification_id)}
              className="group flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Status Indicator Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex-shrink-0 mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-primary/10 transition-colors">
                {getIcon(notification.title)}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {notification.content}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(notification.created_at)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {notification.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="h-5 w-5 text-primary/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {notificationsMeta && notificationsMeta.total_pages > 1 && (
          <div className="mt-8">
            <AdminPagination
              currentPage={notificationsMeta.current_page}
              totalPages={notificationsMeta.total_pages}
              onPageChange={handlePageChange}
              totalResults={notificationsMeta.total_items}
              itemsPerPage={notificationsMeta.limit}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotificationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div 
             className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
             onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notification Details
              </h2>
              <button
                onClick={closeDetail}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {currentNotificationStatus === "loading" ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : currentNotification ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        {getIcon(currentNotification.title)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {currentNotification.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(currentNotification.created_at)}
                        </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</h4>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                        {currentNotification.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <span className="text-xs text-gray-500 block">Trigger Source</span>
                        <span className="font-medium capitalize text-gray-900 dark:text-white">
                            {currentNotification.trigger_source}
                        </span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <span className="text-xs text-gray-500 block">Related ID</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            #{currentNotification.related_id}
                        </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Notification content not found.
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end">
              <button
                onClick={closeDetail}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
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

export default NotificationsPage;
