import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CreditCard,
  ShoppingCart,
  Package,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getDashboardStatsThunk,
  adminSearchThunk,
} from "../redux/slice/authSlice";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
    <div className="p-3 bg-gray-50 rounded-full text-[#013a67]">
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dashboardStats, dashboardStatsStatus, searchResults } = useSelector(
    (state: RootState) => state.auth
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    dispatch(getDashboardStatsThunk());
  }, [dispatch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        dispatch(adminSearchThunk(searchQuery));
      }
    }
  };

  const stats = [
    {
      title: "Total Books",
      value: dashboardStats?.cards.total_books.toString() || "0",
      icon: <BookOpen size={24} />,
    },
    {
      title: "Total Orders",
      value: dashboardStats?.cards.total_orders.toString() || "0",
      icon: <ShoppingCart size={24} />,
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats?.cards.total_revenue.toLocaleString() || "0"}`,
      icon: <CreditCard size={24} />,
    },
    {
      title: "Low Stock",
      value: dashboardStats?.cards.low_stock.toString() || "0",
      icon: <Package size={24} />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${!sidebarOpen ? "pl-20" : ""}`}>
        <div className="flex flex-col p-6 md:p-8 overflow-y-auto w-full h-full">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#261d1a]">Dashboard</h1>
            </div>
            
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="block w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#013a67] focus:border-transparent"
                  placeholder="Search..."
                />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={
                  dashboardStatsStatus === "loading" ? "..." : stat.value
                }
                icon={stat.icon}
              />
            ))}
          </div>

          {/* Dashboard Overview / Search Results */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {searchResults ? "Search Results" : "Dashboard Overview"}
            </h2>

            {searchResults ? (
              <div className="space-y-6">
                 {searchResults.books.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Books</h3>
                    <ul className="divide-y divide-gray-100">
                      {searchResults.books.map((book: any) => (
                        <li key={book.id} className="py-2 flex justify-between items-center hover:bg-gray-50 px-2 rounded cursor-pointer" onClick={() => navigate('/admin/inventory')}>
                           <span className="text-gray-800 font-medium">{book.title}</span>
                           <span className="text-gray-500 text-sm">{book.author}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {searchResults.orders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Orders</h3>
                     <ul className="divide-y divide-gray-100">
                      {searchResults.orders.map((order: any) => (
                        <li key={order.id} className="py-2 text-blue-600 hover:underline cursor-pointer px-2" onClick={() => navigate('/admin/orders')}>
                          Order #{order.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchResults.users.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Users</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.users.map((user: any) => (
                        <span key={user.id} className="inline-block px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                          {user.username}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.books.length === 0 &&
                  searchResults.orders.length === 0 &&
                  searchResults.users.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No results found.</p>
                  )}
                  
                  <button 
                    onClick={() => { setSearchQuery(""); dispatch(adminSearchThunk("")); }}
                    className="mt-4 text-sm text-[#013a67] font-medium hover:underline"
                >
                    Clear Search
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                     <LayoutDashboard size={32} className="text-[#013a67]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Welcome to your Dashboard</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Manage your inventory, track orders, and view reports from this central hub.
                </p>
                <button 
                    onClick={() => navigate("/admin/inventory")}
                    className="mt-6 px-6 py-2 bg-[#013a67] text-white rounded-lg hover:bg-[#013a67]/90 transition-colors font-medium"
                >
                    Go to Inventory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
