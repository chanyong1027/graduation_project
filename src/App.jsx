import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import SignupPage from "./pages/SignUpPage";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import MyLibrary from "./pages/MyLibrary";
import History from "./pages/History";
import "./styles/common.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:isbn" element={<BookDetail />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mylibrary" element={<MyLibrary />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
