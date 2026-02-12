import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LoginPage from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import BookPage from "./pages/Book";
import BookDetailPage from "./pages/BookDetail";
import CartPage from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CheckoutPage from "./pages/Checkout";
import WishlistPage from "./pages/Wishlist";
import UserProfilePage from "./pages/Profile";
import DashboardPage from "./admin/Dashboard";
import BooksManagement from "./admin/BookManagement";
import PaymentsPage from "./admin/Payment";
import OrdersPage from "./admin/Order";
import InventoryDashboard from "./admin/Inventory";
import AdminSettings from "./admin/Setting";
import CategoryManagement from "./admin/CategoryManagement";
import AnalyticsPage from "./admin/Analytics";
import { hydrateFromStorage } from "./redux/slice/authSlice";
import { type AppDispatch } from "./redux/store/store";
import TrackOrderPage from "./pages/TrackOrder";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotificationsPage from "./pages/Notifications";
import AdminNotificationsPage from "./admin/Notifications";
import CancellationsPage from "./admin/Cancellations";
import HelpDocs from "./admin/Help";
import LibraryPage from "./pages/Library";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:code" element={<ResetPasswordPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/book/detail/:slug" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/book-management" element={<BooksManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/payment" element={<PaymentsPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/inventory" element={<InventoryDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/cancellations" element={<CancellationsPage />} />
          <Route path="/admin/help" element={<HelpDocs />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App;
