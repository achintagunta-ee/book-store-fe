
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getAnalyticsOverviewThunk,
  getRevenueChartThunk,
  getTopBooksThunk,
  getTopCustomersThunk,
  getCategorySalesThunk,
} from "../redux/slice/authSlice";

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const {
    analyticsOverview,
    analyticsOverviewStatus,
    revenueChart,
    revenueChartStatus,
    topBooks,
    topBooksStatus,
    topCustomers,
    topCustomersStatus,
    categorySales,
    categorySalesStatus,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getAnalyticsOverviewThunk());
    dispatch(getRevenueChartThunk());
    dispatch(getTopBooksThunk());
    dispatch(getTopCustomersThunk());
    dispatch(getCategorySalesThunk());
  }, [dispatch]);

  const isLoading =
    analyticsOverviewStatus === "loading" ||
    revenueChartStatus === "loading" ||
    topBooksStatus === "loading" ||
    topCustomersStatus === "loading" ||
    categorySalesStatus === "loading";

  // Calculate max revenue for chart scaling
  const maxRevenue = revenueChart.reduce(
    (max, item) => (item.revenue > max ? item.revenue : max),
    0
  );

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{analyticsOverview ? formatCurrency(analyticsOverview.revenue) : "0.00"}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {analyticsOverview?.orders || "0"}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Avg Order Value</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{analyticsOverview ? formatCurrency(analyticsOverview.avg_order_value) : "0.00"}
                  </p>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend</h3>
                <div className="h-64 flex items-end gap-2 overflow-x-auto pb-4">
                  {revenueChart.length > 0 ? (
                    revenueChart.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 group min-w-[40px]">
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group"
                          style={{ height: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 0}px` }}
                        >
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              ₹{formatCurrency(item.revenue)}
                           </div>
                        </div>
                        <span className="text-xs text-gray-500 rotate-45 origin-top-left translate-y-2">
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center w-full">No revenue data available</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Books */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Books</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Title</th>
                          <th className="px-4 py-3 text-right rounded-r-lg">Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topBooks.length > 0 ? (
                          topBooks.map((book, index) => (
                            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]" title={book.title}>
                                {book.title}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600">{book.sold}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={2} className="text-center py-4 text-gray-500">No data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Customers */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Top Customers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Customer</th>
                          <th className="px-4 py-3 text-right">Orders</th>
                          <th className="px-4 py-3 text-right rounded-r-lg">Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.length > 0 ? (
                          topCustomers.map((customer, index) => (
                            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[150px]" title={customer.email}>
                                {customer.email}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600">{customer.orders}</td>
                              <td className="px-4 py-3 text-right font-medium text-green-600">
                                ₹{formatCurrency(customer.spent)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} className="text-center py-4 text-gray-500">No data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Category Sales */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Category Sales</h3>
                <div className="space-y-4">
                  {categorySales.length > 0 ? (
                    categorySales.map((cat, index) => {
                       const totalSold = categorySales.reduce((acc, curr) => acc + curr.sold, 0);
                       const percentage = totalSold > 0 ? (cat.sold / totalSold) * 100 : 0;
                       
                       return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{cat.category}</span>
                            <span className="text-gray-500">{cat.sold} sold ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                       );
                    })
                  ) : (
                     <p className="text-gray-500 text-center">No category data available</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
