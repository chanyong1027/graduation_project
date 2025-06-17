// src/Header.jsx

import { useNavigate, Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./NavCustom.css";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const handleLogout = () => {
    logout(); // 로그아웃 로직 실행
    navigate("/"); // 로그아웃 후 홈 페이지로 이동
  };

  // "내 도서관 관리" 링크 클릭 시 호출될 함수
  const handleMyLibraryClick = () => {
    // MyLibrary 컴포넌트의 검색 관련 상태를 초기화하도록 신호를 보냅니다.
    localStorage.setItem("myLibraryReset", "true");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CheckBook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Form className="mx-auto w-50">
            <InputGroup>
              <FormControl
                type="search"
                placeholder="도서명, 저자명으로 검색해보세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  height: "36px",
                  borderRight: "none",
                  boxShadow: "none",
                  outline: "none",
                  backgroundColor: "#f8f9fa",
                }}
              />
              <Button
                variant="light"
                onClick={handleSearchClick}
                style={{
                  border: "1px solid #ced4da",
                  borderLeft: "none",
                  height: "36px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/mylibrary" onClick={handleMyLibraryClick}>
              내 도서관 관리
            </Nav.Link>
            <Nav.Link as={Link} to="/history">
              내 기록
            </Nav.Link>

            {isLoggedIn ? (
              <>
                <span className="ms-2 fw-bold text-dark">
                  {user?.nickname || "사용자"}님
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline-dark" size="sm" className="ms-2">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline-dark" size="sm" className="ms-2">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
