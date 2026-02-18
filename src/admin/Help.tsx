import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {

  ShoppingCart,
  Info,
  List,
  Monitor,
  BookOpen,
  Tags,
  CreditCard,
  Settings,
  LayoutDashboard,
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
// --- Help Inner Sidebar Component ---
// This sidebar is specific to the Help section and sits adjacent to the content
// --- Help Inner Sidebar Component ---
// This sidebar is specific to the Help section and sits adjacent to the content
interface HelpInnerSidebarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const HelpInnerSidebar: React.FC<HelpInnerSidebarProps> = ({ activeTab, onTabChange, isOpen, onToggle }) => {


const menuGroups = [
    {
      title: "MANAGEMENT",
      items: [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", id: "dashboard" },
        { icon: <BookOpen size={20} />, label: "Books", id: "books" },
        { icon: <Tags size={20} />, label: "Categories", id: "categories" },
        { icon: <Package size={20} />, label: "Inventory", id: "inventory" },
      ],
    },
    {
      title: "SALES & FINANCE",
      items: [
        { icon: <CreditCard size={20} />, label: "Payments", id: "payments" },
        { icon: <ShoppingCart size={20} />, label: "Orders", id: "orders" },
        { icon: <XCircle size={20} />, label: "Cancellations", id: "cancellations" },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { icon: <Bell size={20} />, label: "Notifications", id: "notifications" },
        { icon: <Settings size={20} />, label: "Settings", id: "settings" },
      ],
    },
  ];

  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-[#e5e7eb] flex flex-col hidden lg:flex h-full transition-all duration-300 ease-in-out shrink-0 z-10 relative`}
    >
      {/* Header Area with Toggle */}
      <div className={`h-16 flex items-center px-4 border-b border-gray-100 shrink-0 relative ${!isOpen && 'justify-center'}`}>
         <div className="flex items-center gap-3 overflow-hidden">
             <div className="min-w-[32px] w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Info size={18} />
             </div>
            {isOpen && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden transition-opacity duration-300">
                <h1 className="text-[#261d1a] text-base font-bold">Help Center</h1>
                <p className="text-gray-400 text-xs">Documentation</p>
              </div>
            )}
         </div>

          {/* Toggle Button in Header */}
          <button
            onClick={onToggle}
            className={`absolute top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 text-gray-500 z-20 ${isOpen ? 'right-4' : '-right-3'}`}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-4">
        {/* Navigation Groups */}
        <div className="flex flex-col gap-6 px-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              {isOpen && (
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 whitespace-nowrap overflow-hidden">
                  {group.title}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors w-full text-left group relative ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${!isOpen && 'justify-center'}`}
                    title={!isOpen ? item.label : ''}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    {isOpen && (
                      <p className="text-sm whitespace-nowrap overflow-hidden">
                        {item.label}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


// --- Custom Slider Arrows ---
// Glassmorphism styled arrows
function NextArrow({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 border border-white/20 text-white backdrop-blur-sm shadow-lg transition-all hover:bg-black/40 hover:scale-105 focus:outline-none group"
      aria-label="Next slide"
      type="button"
    >
      <ChevronRight size={28} className="opacity-90 group-hover:opacity-100" />
    </button>
  );
}

function PrevArrow({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/20 border border-white/20 text-white backdrop-blur-sm shadow-lg transition-all hover:bg-black/40 hover:scale-105 focus:outline-none group"
      aria-label="Previous slide"
      type="button"
    >
      <ChevronLeft size={28} className="opacity-90 group-hover:opacity-100" />
    </button>
  );
}


// --- Main Help Component ---
// --- Main Help Component ---
type HelpSection = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  overview: string;
  steps: string[];
  images: string[];
};

const helpContent: Record<string, HelpSection> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your store's performance",
    icon: <LayoutDashboard size={32} />,
    overview: "The central hub for your bookstore administration. Get a quick snapshot of your business performance including total books, orders, revenue, and low stock alerts.",
    steps: [
       "KPI Cards: View essential metrics like Total Books, Orders, Revenue, and Low Stock at a glance.",
       "Navigation: Use the sidebar to access other modules like Books, Orders, and Settings.",
       "Low Stock Alerts: Quickly identify products that need restocking."
    ],
    images: ["/admin/help/dashboard_screen.png"]
  },
  books: {
    title: "Books Management",
    subtitle: "Add, edit, and manage your book inventory",
    icon: <BookOpen size={32} />,
    overview: "Comprehensive tools to manage your book catalog, including adding new titles, editing details, uploading e-books, and managing cover images.",
    steps: [
        "Book List: View all books with key details like Title, Author, Category, Price, and Stock.",
        "Add New Book: Click 'Add New Book' to open a form for entering details like title, author, price, and stock.",
        "Edit Book: Update existing book information easily by clicking the edit icon.",
        "Upload E-book: Attach PDF files for digital distribution directly to the book record.",
        "Manage Images: Upload and reorder multiple product images to showcase the book."
    ],
    images: [
        "/admin/help/books_management.png",
        "/admin/help/add_book_modal.png",
        "/admin/help/edit_book_modal.png",
        "/admin/help/upload_ebook_modal.png",
        "/admin/help/manage_images_modal.png",
    ]
  },
  categories: {
    title: "Categories",
    subtitle: "Organize your book collection",
    icon: <Tags size={32} />,
    overview: "Manage book categories to help customers navigate your store effectively. Use categories to group similar books together.",
    steps: [
        "Category List: View all existing categories with their descriptions.",
        "Add Category: Create new categories to expand your store's organization.",
        "Edit/Delete: Modify category details or remove unused categories using the action buttons."
    ],
    images: [
        "/admin/help/category_list.png",
        "/admin/help/edit_category_modal.png"
    ]
  },
  payments: {
    title: "Payments",
    subtitle: "Track and manage transactions",
    icon: <CreditCard size={32} />,
    overview: "Monitor all financial transactions, including online payments and manual offline entries.",
    steps: [
        "Payment Log: View a comprehensive list of all payments with details like Amount, Date, and Status.",
        "Record Offline Payment: Manually record cash or other offline transactions for accurate bookkeeping.",
        "Filtering: Filter payments by date range or status (e.g., Complete, Pending) to find specific records.",
        "Invoices & Receipts: Generate and download payment receipts for customers."
    ],
    images: [
        "/admin/help/payments_list.png",
        "/admin/help/record_payment_modal.png",
        "/admin/help/payment_date_filter.png",
        "/admin/help/payment_receipt_modal.png",
        "/admin/help/invoice_details_modal.png"
    ]
  },
  inventory: {
    title: "Inventory",
    subtitle: "Track and manage stock levels",
    icon: <Package size={32} />,
    overview: "Monitor product availability and update stock counts to prevent out-of-stock situations.",
    steps: [
        "Stock Overview: View real-time stock levels for all products, identifying low or out-of-stock items.",
        "Search: Quickly find specific books by title or author to check their availability.",
        "Update Stock: Manually adjust stock quantities for individual items using the 'Edit' action."
    ],
    images: [
        "/admin/help/inventory_list.png",
        "/admin/help/update_stock_modal.png"
    ]
  },
  orders: {
    title: "Orders",
    subtitle: "How to manage orders",
    icon: <ShoppingCart size={32} />,
    overview: "Track and manage customer orders from placement to delivery.",
    steps: [
        "Dashboard Overview: View all orders in a centralized table, including Order ID, Customer Name, Date, Total Amount, and current Status.",
        "Order Filtering: Use the top bar to filter orders by Date Range or Status (e.g., Pending, Paid, Delivered) to quickly locate specific records.",
        "Status Updates: Change an order's status directly from the list using the status dropdown for quick processing.",
        "In-Depth Details: Click 'View' to open the Order Details modal, displaying comprehensive customer information and purchased items.",
        "Invoicing: Generate and review invoices with a single click to manage billing and financial records.",
        "Customer Notifications: Keep customers informed by sending manual email notifications for Order Confirmations or Shipping updates.",
        "Shipment Tracking: Add tracking numbers and carrier URLs to orders so customers can monitor their deliveries in real-time."
    ],
    images: [
        "/admin/help/orders_screen_1.png",
        "/admin/help/filter_status.png",
        "/admin/help/orders_screen_2.png",
        "/admin/help/order_details.png",
        "/admin/help/view_invoice.png",
        "/admin/help/send_notification.png",
        "/admin/help/add_tracking.png",
    ]
  },
  cancellations: {
    title: "Cancellations & Refunds",
    subtitle: "Manage refund requests",
    icon: <XCircle size={32} />,
    overview: "Review and process customer cancellation requests and handle refunds efficiently.",
    steps: [
        "Request List: View all cancellation requests with relevant details like Reason, Amount, and Status.",
        "Status Filtering: Filter requests by status (e.g., Pending, Approved, Rejected) to focus on actionable items.",
        "Process Actions: Approve or reject requests and manage the refund process directly from the dashboard."
    ],
    images: [
        "/admin/help/cancellations_list.png",
        "/admin/help/cancellations_filter.png"
    ]
  },
  notifications: {
    title: "Notifications",
    subtitle: "System alerts and updates",
    icon: <Bell size={32} />,
    overview: "Stay informed about critical store activities, new orders, and payment alerts.",
    steps: [
        "Activity Feed: Monitor a real-time feed of all system notifications such as new orders, payments, and stock alerts.",
        "View Details: Click on any notification to view comprehensive details about the specific event.",
        "Manage Alerts: Resend notifications to customers or mark alerts as read/cleared."
    ],
    images: [
        "/admin/help/notifications_list.png",
        "/admin/help/notification_details.png"
    ]
  },
  settings: {
    title: "Settings",
    subtitle: "Configure store preferences",
    icon: <Settings size={32} />,
    overview: "Manage global store configuration, update your admin profile, and connect social media accounts.",
    steps: [
        "General Settings: Update your store's name, logo, address, and contact email.",
        "My Profile: Manage your admin account details, change your password, and update your profile picture.",
        "Social Media: Link your store's Facebook, YouTube, Twitter, and WhatsApp accounts for customer engagement."
    ],
    images: [
        "/admin/help/settings_general.png",
        "/admin/help/settings_profile.png",
        "/admin/help/settings_social.png"
    ]
  }
};

const Help: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isInnerSidebarOpen, setIsInnerSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: any) => (
      <div className="absolute bottom-[5px] w-full flex justify-center items-center pointer-events-none z-[20]" style={{ bottom: "5px" }}>
         <ul className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-center gap-2 m-0 pointer-events-auto list-none shadow-sm w-fit">
           {dots}
         </ul>
      </div>
    ),
    customPaging: (_: any) => (
      <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white transition-all cursor-pointer dot-item" />
    ),
  };

  const currentContent = helpContent[activeTab] || helpContent.dashboard;

  return (
    <div className="flex h-screen w-full bg-[#f8f4f1] overflow-hidden">
      {/* Global Admin Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Page Layout */}
      <div className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-300 ${!sidebarOpen ? "pl-20" : ""}`}>
        {/* Mobile Header for Global Sidebar Toggle */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">
               <Info size={20} className="text-blue-600" />
               <h1 className="text-lg font-bold text-[#261d1a]">Help Center</h1>
            </div>
          </div>
        </div>

        {/* Content Area with Inner Sidebar for Desktop */}
        <div className="flex flex-1 overflow-hidden">
            {/* Inner Help Sidebar (visible on desktop) */}
            <HelpInnerSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                isOpen={isInnerSidebarOpen}
                onToggle={() => setIsInnerSidebarOpen(!isInnerSidebarOpen)}
            />

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
                    {currentContent.icon}
                    </div>
                    <div className="pt-1">
                    <h2 className="text-3xl font-bold text-[#261d1a]">{currentContent.title}</h2>
                    <p className="text-lg text-gray-500 mt-1">{currentContent.subtitle}</p>
                    </div>
                </div>

                {/* Overview Section */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                    <Info className="text-blue-600" size={20} />
                    <h3 className="text-blue-900 font-bold text-lg">Overview</h3>
                    </div>
                    <p className="text-blue-800/80 font-medium leading-relaxed">
                    {currentContent.overview}
                    </p>
                </div>

                {/* Working Process Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                    <List className="text-gray-400" size={24} />
                    <h3 className="text-xl font-bold text-[#261d1a]">Working Process</h3>
                    </div>

                    <div className="space-y-4 pl-2">
                    {currentContent.steps.map((step, index) => (
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

                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white relative">
                        {/* Custom styles for active dots */}
                        <style>{`
                          .slick-active .dot-item {
                            background-color: #ffffff !important;
                            transform: scale(1.4);
                            opacity: 1 !important;
                          }
                          .custom-slick-slider .slick-dots li {
                            margin: 0 !important;
                            width: auto !important;
                            height: auto !important;
                          }
                        `}</style>
                        <div className="relative px-0 bg-gray-900/5">
                          <Slider key={activeTab} {...sliderSettings} className="custom-slick-slider h-full">
                          {currentContent.images.map((imgUrl, index) => (
                              <div key={index} className="outline-none">
                                <div className="aspect-video w-full relative group">
                                    <img 
                                    src={imgUrl} 
                                    alt={`Screen Preview ${index + 1}`} 
                                    className="w-full h-full object-contain bg-gray-100"
                                    />
                                    {/* Overlay gradient for text readability if needed, though we use dots container background */}
                                </div>
                              </div>
                          ))}
                          </Slider>
                        </div>
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