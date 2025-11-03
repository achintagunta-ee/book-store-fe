import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import BookPage from "./pages/Book";
import BookDetailPage from "./pages/BookDetail";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/books" element={<BookPage />} />
				<Route path="/book/detail" element={<BookDetailPage />} />
			</Routes>
		</BrowserRouter>
	);
}
export default App;
