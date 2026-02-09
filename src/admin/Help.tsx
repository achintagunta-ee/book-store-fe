import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Info,
  List,
  Monitor,
  BookOpen,
  Tags,
  CreditCard,
  Settings,
  LayoutDashboard,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Package,
  XCircle,
  Bell
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Help Inner Sidebar Component ---
// This sidebar is specific to the Help section and sits adjacent to the content
const HelpInnerSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToAdmin = () => {
    navigate("/admin/dashboard");
  };

const menuGroups = [
    {
      title: "MANAGEMENT",
      items: [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", id: "dashboard" },
        { icon: <BookOpen size={18} />, label: "Books", id: "books" },
        { icon: <Tags size={18} />, label: "Categories", id: "categories" },
        { icon: <Package size={18} />, label: "Inventory", id: "inventory" },
      ],
    },
    {
      title: "SALES & FINANCE",
      items: [
        { icon: <CreditCard size={18} />, label: "Payments", id: "payments" },
        { icon: <ShoppingCart size={18} />, label: "Orders", id: "orders", active: true },
        { icon: <XCircle size={18} />, label: "Cancellations", id: "cancellations" },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { icon: <Bell size={18} />, label: "Notifications", id: "notifications" },
        { icon: <Settings size={18} />, label: "Settings", id: "settings" },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-[#e5e7eb] flex-col hidden lg:flex h-full overflow-y-auto shrink-0 z-10">
      <div className="flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 px-2 mt-2">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
             <Info size={18} />
           </div>
          <div className="flex flex-col">
            <h1 className="text-[#261d1a] text-base font-bold">Help Center</h1>
            <p className="text-gray-400 text-xs">Documentation</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex flex-col gap-6">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3">
                {group.title}
              </h3>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors w-full text-left ${
                      item.active
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <p className="text-sm">
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Admin Button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={handleBackToAdmin}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-50 w-full text-left text-gray-600"
          >
            <ArrowLeft size={18} />
            <p className="text-sm font-medium">Back to Admin</p>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Custom Slider Arrows ---
function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center`}
      style={{ 
        ...style, 
        display: "flex", 
        background: "white", 
        borderRadius: "50%", 
        width: "40px", 
        height: "40px", 
        zIndex: 10, 
        right: "-20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      onClick={onClick}
    >
      <ChevronRight size={24} className="text-gray-700" />
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center`}
      style={{ 
        ...style, 
        display: "flex", 
        background: "white", 
        borderRadius: "50%", 
        width: "40px", 
        height: "40px", 
        zIndex: 10, 
        left: "-20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      onClick={onClick}
    >
      <ChevronLeft size={24} className="text-gray-700" />
    </div>
  );
}


// --- Main Help Component ---
const Help: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const workingProcessSteps = [
    "Access the Orders page to view a list of all orders with details like Order ID, Customer, Date, Total, and Status.",
    "Use the '+ Offline Order' button to manually create orders for offline sales.",
    "Search for specific orders using Order ID or Customer Name, or filter by Status and Date Range.",
    "Update order status directly from the list row dropdown (e.g., Pending, Processing, Shipped, Delivered, Cancelled, Paid).",
    "Use quick actions to View details, Notify customers, or Track shipments.",
    "Click 'View Invoice' to access billing documents or 'View' to open the detailed order modal.",
    "In the Order Details view, check Customer Info, Order Info, Items purchased, and use the 'Download Invoice' button."
  ];

  const previewImages = [
    "/admin/help/orders_list.png",
    "/admin/help/status_dropdown.png",
    "/admin/help/order_details.png",
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      {/* Global Admin Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Page Layout */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header for Global Sidebar Toggle */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#261d1a]"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
               <Info size={20} className="text-blue-600" />
               <h1 className="text-lg font-bold text-[#261d1a]">Help Center</h1>
            </div>
          </div>
        </div>

        {/* Content Area with Inner Sidebar for Desktop */}
        <div className="flex flex-1 overflow-hidden">
            {/* Inner Help Sidebar (visible on desktop) */}
            <HelpInnerSidebar />

            {/* Scrollable Article Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}>
            <div className="max-w-5xl mx-auto pb-10">
                {/* Page Header */}
                <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-100 rounded-lg text-[#013a67]">
                    <Info size={24} />
                </div>
                <h1 className="text-2xl font-bold text-[#013a67]">Help Center</h1>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#5c2e2e]/10 p-6 md:p-10 space-y-10">
                
                {/* Feature Title Section */}
                <div className="flex items-start gap-6 border-b border-gray-100 pb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                    <ShoppingCart size={32} />
                    </div>
                    <div className="pt-1">
                    <h2 className="text-3xl font-bold text-[#261d1a]">Orders</h2>
                    <p className="text-lg text-gray-500 mt-1">How to manage orders</p>
                    </div>
                </div>

                {/* Overview Section */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                    <Info className="text-blue-600" size={20} />
                    <h3 className="text-blue-900 font-bold text-lg">Overview</h3>
                    </div>
                    <p className="text-blue-800/80 font-medium leading-relaxed">
                    Track and manage customer orders from placement to delivery.
                    </p>
                </div>

                {/* Working Process Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                    <List className="text-gray-400" size={24} />
                    <h3 className="text-xl font-bold text-[#261d1a]">Working Process</h3>
                    </div>

                    <div className="space-y-4 pl-2">
                    {workingProcessSteps.map((step, index) => (
                        <div key={index} className="flex gap-4 group">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 text-gray-600 font-bold flex items-center justify-center text-sm border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {index + 1}
                        </span>
                        <p className="text-gray-600 pt-1 leading-relaxed group-hover:text-gray-900 transition-colors">
                            {step}
                        </p>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Screen Preview Information Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                    <Monitor className="text-gray-400" size={24} />
                    <h3 className="text-xl font-bold text-[#261d1a]">Screen Preview</h3>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-gray-50/50 p-6 md:p-8">
                    <div className="rounded-lg overflow-hidden shadow-sm bg-white px-8 md:px-12 py-4">
                        <Slider {...sliderSettings} className="custom-slick-slider">
                        {previewImages.map((imgUrl, index) => (
                            <div key={index} className="outline-none px-2">
                            <div className="aspect-video w-full bg-gray-100 relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                src={imgUrl} 
                                alt={`Screen Preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                            </div>
                            </div>
                        ))}
                        </Slider>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Swipe to view screens
                    </p>
                    </div>
                </div>

                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
