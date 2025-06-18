import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import SignupPage from "./pages/SignUpPage";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import MyLibrary from "./pages/MyLibrary";
<<<<<<< HEAD
import History from "./pages/History";
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
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
<<<<<<< HEAD
          <Route path="/history" element={<History />} />
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
