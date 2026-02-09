import React from "react";
import {
  BookOpen,
  CreditCard,
  ShoppingCart,
  Package,
  Settings,
  Tags,
  LogOut,
  Bell,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store/store";
import { logoutThunk } from "../redux/slice/authSlice";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to }) => {
  const match = useMatch(to);
  const active = !!match;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-[#e1aa12]/20 border border-[#e1aa12]/40"
          : "hover:bg-white/10"
      }`}
    >
      {icon}
      <p className="text-white text-base font-bold">{label}</p>
    </Link>
  );
};

interface SidebarProps {
  sidebarOpen: boolean;
}

const navItems = [
  { icon: <BookOpen size={20} />, label: "Dashboard", to: "/admin/dashboard" },
  {
    icon: <BookOpen size={20} />,
    label: "Books",
    to: "/admin/book-management",
  },
  { icon: <Tags size={20} />, label: "Categories", to: "/admin/categories" },
  { icon: <CreditCard size={20} />, label: "Payments", to: "/admin/payment" },
  { icon: <ShoppingCart size={20} />, label: "Orders", to: "/admin/orders" },
  { icon: <XCircle size={20} />, label: "Cancellations", to: "/admin/cancellations" },
  { icon: <Bell size={20} />, label: "Notifications", to: "/admin/notifications" },
  { icon: <Package size={20} />, label: "Inventory", to: "/admin/inventory" },
  { icon: <HelpCircle size={20} />, label: "Help Docs", to: "/admin/help" },
  { icon: <Settings size={20} />, label: "Settings", to: "/admin/settings" },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-0"
      } transition-all duration-300 bg-[#013a67] text-white flex flex-col overflow-hidden`}
    >
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 flex-shrink-0"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI2h7a_FRpSKGMSzil9yBpG3v5o_k5gTrG5IBzeg8V_vi__AX_y5rL-9T5hfRWKVnDfF6aKuaR7AYqWy9fOvOooQXHvDNB4CYvGogEybC4Vg2l4VWDMDAUGMaJ_xK0bYGbrodNd0MSPXHgz-JKBsp-fhXpk2AlQrkK2kIy4MsYmv93n80WhPXTTlHRQNkuHLaEy_xzNf0k55xEoy0Ayts70wbwJ4jtzx1yurIqsPZmrk_Z_EU9XEaUhI-JQSOAlAAZ9HecNS9jp1A")`,
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold">Hithabodha</h1>
            <p className="text-gray-300 text-sm">Admin Panel</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              to={item.to}
            />
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10 w-full text-left"
          >
            <LogOut size={20} />
            <p className="text-white text-base font-bold">Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
