import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getAnalyticsOverviewThunk,
  getRevenueChartThunk,
  getTopBooksThunk,
  getTopCustomersThunk,
  getCategorySalesThunk,
  exportAnalyticsReportThunk,
} from "../redux/slice/authSlice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Calendar,
  ChevronDown,
  PieChart as PieChartIcon
} from "lucide-react";
import { addChartToExcel } from "../utils/excelChartHelper";

// Color palette from design
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#6366f1"];

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Prepare Chart Data
  const chartData = useMemo(() => revenueChart?.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Number(item.revenue) || 0,
    fullDate: new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  })) || [], [revenueChart]);

  const donutData = useMemo(() => categorySales?.map(item => ({
    name: item.category,
    value: item.sold
  })) || [], [categorySales]);

  // Calculations for Area Chart
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 100);
  
  const getX = (index: number) => (index / (chartData.length - 1 || 1)) * 100;
  // Normalized Y (0-100 scale, where 100 is bottom/0 revenue, 0 is top/max revenue)
  // Adding 10% padding on top
  const getY = (value: number) => {
    const paddedMax = maxRevenue * 1.1;
    return 100 - (value / paddedMax) * 100;
  };

  const points = chartData.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(' ');
  const areaPath = `M0,100 ${points.split(' ').map(p => 'L' + p).join(' ')} L100,100 Z`;
  const linePath = `M${points.split(' ').join(' L')}`;

  // Donut Chart Calculations
  const totalCategorySales = donutData.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;
  
  const donutSegments = donutData.map((item, index) => {
    const percent = totalCategorySales > 0 ? item.value / totalCategorySales : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...item,
      percent,
      startPercent,
      color: COLORS[index % COLORS.length]
    };
  });

  const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chartData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const index = Math.min(
      Math.max(0, Math.round((x / width) * (chartData.length - 1))),
      chartData.length - 1
    );
    setHoveredIndex(index);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const resultAction = await dispatch(exportAnalyticsReportThunk());
      if (exportAnalyticsReportThunk.fulfilled.match(resultAction)) {
        let finalBlob = resultAction.payload;
        
        // Add graph to the excel sheet
        try {
          const excelData = {
            revenueChart: chartData,
            topBooks: topBooks,
            topCustomers: topCustomers,
            categorySales: categorySales,
            overview: analyticsOverview
          };
          
          if (chartData.length > 0 || topBooks.length > 0 || topCustomers.length > 0 || categorySales.length > 0) {
            finalBlob = await addChartToExcel(finalBlob, excelData);
          }
        } catch (err) {
          console.error("Failed to add chart to excel", err);
          // Continue with original blob if chart addition fails
        }

        // Create a URL for the blob
        const url = window.URL.createObjectURL(finalBlob);
        const link = document.createElement('a');
        link.href = url;
        // Set default filename, can be adjusted based on needs or headers
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `analytics_report_${date}.xlsx`); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Report downloaded successfully");
      } else {
        toast.error(resultAction.payload as string || "Failed to download report");
      }
    } catch (error) {
      toast.error("An error occurred during export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Insights</h1>
              <p className="text-gray-500 mt-1">Real-time performance overview</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Monthly</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                  isExporting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                {isExporting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? "Downloading..." : "Download Report"}</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/30">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                      From sales
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{analyticsOverview ? formatCurrency(analyticsOverview.revenue) : "0.00"}
                    </p>
                  </div>
                </motion.div>

                {/* Total Profit */}
                 <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-purple-500 rounded-xl text-white shadow-lg shadow-purple-500/30">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                      Net profit
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Profit (Est.)</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{analyticsOverview ? formatCurrency(analyticsOverview.revenue * 0.2) : "0.00"}
                    </p>
                  </div>
                </motion.div>

                {/* Total Orders */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/30">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                      Completed orders
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsOverview?.orders || "0"}
                    </p>
                  </div>
                </motion.div>

                {/* Avg Order Value */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500 rounded-xl text-white shadow-lg shadow-green-500/30">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                     <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                      Per order
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Avg. Order Value</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{analyticsOverview ? formatCurrency(analyticsOverview.avg_order_value) : "0.00"}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Charts Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Analytics Chart - CUSTOM SVG + FRAMER MOTION */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                         <TrendingUp className="w-5 h-5 text-blue-500" />
                         Revenue Analytics
                      </h3>
                       <p className="text-sm text-gray-500 mt-1">
                         {chartData.length > 0 
                           ? `${chartData[0].name} - ${chartData[chartData.length - 1].name}, ${new Date().getFullYear()}`
                           : "Month to Date"}
                       </p>
                    </div>
                     <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">Monthly</span>
                  </div>
                  
                  <div className="h-[300px] w-full relative group">
                    {chartData.length > 0 ? (
                      <div 
                        className="w-full h-full cursor-crosshair relative"
                        onMouseMove={handleChartMouseMove}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                         {/* Axis Labels (simple overlay) */}
                         <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400 pointer-events-none z-10">
                            <span>₹{formatCurrency(maxRevenue)}</span>
                            <span>₹{formatCurrency(maxRevenue * 0.5)}</span>
                            <span>₹0</span>
                         </div>
                         
                         {/* SVG Chart */}
                         <svg className="w-full h-full pl-14 pb-8" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <defs>
                             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                               <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                             </linearGradient>
                           </defs>

                           {/* Y-Axis Grid Lines */}
                           <line x1="0" y1="0" x2="100" y2="0" stroke="#f3f4f6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                           <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                           <line x1="0" y1="100" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

                           {/* Area Fill */}
                           <motion.path 
                             d={areaPath}
                             fill="url(#chartGradient)"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ duration: 0.8 }}
                           />

                           {/* Line Stroked */}
                           <motion.path 
                             d={linePath}
                             fill="none"
                             stroke="#3b82f6"
                             strokeWidth="3"
                             vectorEffect="non-scaling-stroke"
                             initial={{ pathLength: 0 }}
                             animate={{ pathLength: 1 }}
                             transition={{ duration: 1, ease: "easeInOut" }}
                           />

                           {/* Hover Indicator Line */}
                            <AnimatePresence>
                              {hoveredIndex !== null && (
                                <motion.line
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  x1={getX(hoveredIndex)}
                                  x2={getX(hoveredIndex)}
                                  y1="0"
                                  y2="100"
                                  stroke="#3b82f6"
                                  strokeWidth="1"
                                  strokeDasharray="4"
                                  vectorEffect="non-scaling-stroke"
                                />
                              )}
                            </AnimatePresence>
                            
                            {/* Hover Dot */}
                            <AnimatePresence>
                               {hoveredIndex !== null && (
                                  <motion.circle 
                                    initial={{ r: 0 }}
                                    animate={{ r: 4 }} 
                                    r="1.5"
                                    fill="#fff"
                                    stroke="#3b82f6"
                                    strokeWidth="0.5"
                                    cx={getX(hoveredIndex)}
                                    cy={getY(chartData[hoveredIndex].revenue)}
                                    vectorEffect="non-scaling-stroke"
                                  />
                               )}
                            </AnimatePresence>
                         </svg>

                         {/* X-Axis Labels */}
                         <div className="absolute bottom-0 left-14 right-0 h-8 flex justify-between items-center text-xs text-gray-400 pointer-events-none px-1">
                           {chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((item, i) => (
                             <span key={i}>{item.name}</span>
                           ))}
                         </div>

                         {/* Tooltip Popup */}
                         <AnimatePresence>
                           {hoveredIndex !== null && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10, scale: 0.9 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.9 }}
                               transition={{ duration: 0.2 }}
                               className="absolute top-0 z-20 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl pointer-events-none transform -translate-x-1/2 -mt-12"
                               style={{ 
                                 left: `calc(${getX(hoveredIndex)}% + 56px)`, // + padding-left component
                                 top: `calc(${getY(chartData[hoveredIndex].revenue)}% - 20px)` 
                               }} 
                             >
                                <p className="font-bold mb-1">{chartData[hoveredIndex].fullDate}</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <span>Revenue: <span className="font-mono font-bold">₹{formatCurrency(chartData[hoveredIndex].revenue)}</span></span>
                                </div>
                             </motion.div>
                           )}
                         </AnimatePresence>

                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                        No revenue data available
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Top Selling Products List */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <div className="p-1 bg-purple-100 rounded text-purple-600">
                        <TrendingUp className="w-4 h-4" />
                     </div>
                     Top Selling Products
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {topBooks.slice(0, 5).map((book, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        key={index} 
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                           <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold group-hover:bg-white group-hover:shadow-sm transition-all">
                              #{index + 1}
                           </span>
                           <div>
                              <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[120px]" title={book.title}>{book.title}</p>
                              <p className="text-xs text-gray-400">{book.sold} sales</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-gray-900 text-sm">₹{formatCurrency(book.sold * 100)}</p>
                           <p className="text-xs text-green-500 font-medium">Profit: ₹{formatCurrency(book.sold * 20)}</p>
                        </div>
                      </motion.div>
                    ))}
                    {topBooks.length === 0 && <p className="text-gray-400 text-center text-sm py-4">No top books data</p>}
                  </div>
                  <button className="w-full mt-4 py-2 text-sm text-purple-600 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                     View All Products
                  </button>
                </motion.div>
              </div>

              {/* Secondary Content: Categories & Customers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sales by Category Donut Chart - CUSTOM SVG + FRAMER MOTION */}
                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                   <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <PieChartIcon className="w-5 h-5 text-blue-500" />
                     Sales by Category
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                     <div className="w-48 h-48 relative">
                         {donutSegments.length > 0 ? (
                           <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                             {donutSegments.map((segment, index) => {
                               return (
                                 <motion.circle
                                   key={index}
                                   cx="50"
                                   cy="50"
                                   r="40"
                                   fill="transparent"
                                   stroke={segment.color}
                                   strokeWidth="12"
                                   strokeDasharray={`${segment.percent * 251.32} ${251.32 - (segment.percent * 251.32)}`}
                                   style={{ strokeDashoffset: -(segment.startPercent * 251.32) }}
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   transition={{ duration: 0.5, delay: index * 0.1 }}
                                   
                                   // Interaction
                                   onMouseEnter={() => setHoveredCategoryIndex(index)}
                                   onMouseLeave={() => setHoveredCategoryIndex(null)}
                                   className="cursor-pointer hover:opacity-80 transition-opacity"
                                 />
                               );
                             })}
                             {/* Center Text */}
                            </svg>
                         ) : (
                            <div className="w-full h-full rounded-full border-4 border-gray-100 flex items-center justify-center text-xs text-gray-400">No Data</div>
                         )}
                        
                        {/* Inner Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <AnimatePresence mode="wait">
                             {hoveredCategoryIndex !== null && donutSegments[hoveredCategoryIndex] ? (
                                <motion.div 
                                  key="hover"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col items-center"
                                >
                                   <p className="text-xs text-gray-400 font-medium uppercase text-center px-1 line-clamp-1 max-w-[120px]">
                                     {donutSegments[hoveredCategoryIndex].name}
                                   </p>
                                   <p className="text-xl font-bold text-gray-900">
                                      {donutSegments[hoveredCategoryIndex].value}
                                   </p>
                                   <p className="text-[10px] text-blue-500 font-medium">
                                      {Math.round(donutSegments[hoveredCategoryIndex].percent * 100)}%
                                   </p>
                                </motion.div>
                             ) : (
                                <motion.div 
                                  key="total"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col items-center"
                                >
                                   <p className="text-xs text-gray-400 font-medium uppercase">Total Sales</p>
                                   <p className="text-xl font-bold text-gray-900">
                                      {donutData.reduce((acc, curr) => acc + curr.value, 0)}
                                   </p>
                                </motion.div>
                             )}
                          </AnimatePresence>
                        </div>
                     </div>

                     {/* Legend */}
                     <div className="space-y-3 flex-1">
                        {donutSegments.map((segment, index) => (
                              <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                className={`flex items-center justify-between text-sm p-2 rounded-lg transition-colors ${hoveredCategoryIndex === index ? 'bg-gray-50' : ''}`}
                                onMouseEnter={() => setHoveredCategoryIndex(index)}
                                onMouseLeave={() => setHoveredCategoryIndex(null)}
                              >
                                 <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></span>
                                    <span className="text-gray-600 font-medium">{segment.name}</span>
                                 </div>
                                 <span className="font-bold text-gray-900">{Math.round(segment.percent * 100)}%</span>
                              </motion.div>
                           )
                        )}
                     </div>
                  </div>
                </motion.div>

                {/* Top Customers Table */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Top Customers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 font-medium">Customer</th>
                          <th className="px-4 py-3 font-medium text-right">Orders</th>
                          <th className="px-4 py-3 font-medium text-right">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {topCustomers.slice(0, 5).map((customer, index) => (
                          <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (index * 0.05) }}
                            key={index} 
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                     {customer.email.substring(0, 2)}
                                  </div>
                                  <div>
                                     <p className="font-semibold text-gray-900 line-clamp-1">{customer.email.split('@')[0]}</p>
                                     <p className="text-xs text-gray-400 line-clamp-1 max-w-[150px]">{customer.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-4 py-4 text-right text-gray-600 font-medium">{customer.orders}</td>
                            <td className="px-4 py-4 text-right">
                              <span className="font-bold text-blue-600">₹{formatCurrency(customer.spent)}</span>
                            </td>
                          </motion.tr>
                        ))}
                        {topCustomers.length === 0 && (
                          <tr><td colSpan={3} className="text-center py-8 text-gray-400">No customer data</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
