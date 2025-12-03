import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
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

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/book/detail/:id" element={<BookDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/book-management" element={<BooksManagement />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/admin/payment" element={<PaymentsPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/inventory" element={<InventoryDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
