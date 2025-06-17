// src/pages/History.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {
  FaPlay,
  FaTrashAlt,
  FaHeartBroken,
  FaStickyNote,
  FaBookOpen,
  FaStar,
} from "react-icons/fa"; // 필요한 아이콘 추가

const LOCAL_STORAGE_BOOK_STATUS_KEY = "userBookStatuses";
const LOCAL_STORAGE_WISH_LIST_KEY = "userWishList";
const LOCAL_STORAGE_MEMO_KEY = "userBookMemos"; // 후기/평점은 status에 통합, 이건 한줄 메모

const History = () => {
  const { user, isLoggedIn } = useAuth();
  const currentUserIdentifier = isLoggedIn ? user?.email : null;

  const [key, setKey] = useState("wishlist"); // 현재 활성화된 탭
  const [wishList, setWishList] = useState([]);
  const [readingBooks, setReadingBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);

  // 후기와 평점을 관리할 상태 (각 책의 ISBN을 키로 사용)
  const [bookReviews, setBookReviews] = useState({});
  const [bookRatings, setBookRatings] = useState({});
  // 찜한 책의 한줄 메모를 관리할 상태
  const [wishlistMemos, setWishlistMemos] = useState({});

  // 로컬 스토리지에서 책 상태, 후기, 평점, 찜한 책 메모 불러오기
  const loadBookData = useCallback(() => {
    if (!currentUserIdentifier) {
      setWishList([]);
      setReadingBooks([]);
      setReadBooks([]);
      setBookReviews({});
      setBookRatings({});
      setWishlistMemos({});
      return;
    }

    const storedWishList = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WISH_LIST_KEY) || "[]"
    );
    const userWishList = storedWishList.filter(
      (item) => item.userIdentifier === currentUserIdentifier
    );
    setWishList(userWishList);

    const storedBookStatuses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
    );
    const userReadingBooks = storedBookStatuses.filter(
      (item) =>
        item.userIdentifier === currentUserIdentifier &&
        item.status === "READING"
    );
    setReadingBooks(userReadingBooks);

    const userReadBooks = storedBookStatuses.filter(
      (item) =>
        item.userIdentifier === currentUserIdentifier && item.status === "READ"
    );
    setReadBooks(userReadBooks);

    // 저장된 후기와 평점 불러오기
    const initialReviews = {};
    const initialRatings = {};
    storedBookStatuses.forEach((item) => {
      if (item.userIdentifier === currentUserIdentifier && item.isbn) {
        initialReviews[item.isbn] = item.review || "";
        initialRatings[item.isbn] = item.rating || 0;
      }
    });
    setBookReviews(initialReviews);
    setBookRatings(initialRatings);

    // 찜한 책의 한줄 메모 불러오기
    const storedWishlistMemos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_MEMO_KEY) || "{}"
    );
    setWishlistMemos(storedWishlistMemos[currentUserIdentifier] || {});
  }, [currentUserIdentifier]);

  useEffect(() => {
    loadBookData();
  }, [loadBookData]);

  // 후기 변경 핸들러 (읽고 있는 책/다 읽은 책용)
  const handleReviewChange = (isbn, reviewContent) => {
    setBookReviews((prevReviews) => ({
      ...prevReviews,
      [isbn]: reviewContent,
    }));
  };

  // 평점 변경 핸들러 (읽고 있는 책/다 읽은 책용)
  const handleRatingClick = (isbn, newRating) => {
    setBookRatings((prevRatings) => ({
      ...prevRatings,
      [isbn]: newRating,
    }));
  };

  // 찜한 책의 한줄 메모 변경 핸들러
  const handleWishlistMemoChange = (isbn, memoContent) => {
    setWishlistMemos((prevMemos) => ({
      ...prevMemos,
      [isbn]: memoContent,
    }));
  };

  // 찜한 책의 한줄 메모 저장
  const saveWishlistMemo = (isbn) => {
    if (!currentUserIdentifier) {
      alert("로그인 후 메모를 저장할 수 있습니다.");
      return;
    }

    const allUserMemos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_MEMO_KEY) || "{}"
    );

    allUserMemos[currentUserIdentifier] = {
      ...allUserMemos[currentUserIdentifier],
      [isbn]: wishlistMemos[isbn],
    };

    localStorage.setItem(LOCAL_STORAGE_MEMO_KEY, JSON.stringify(allUserMemos));
    alert("한줄 메모가 저장되었습니다!");
  };

  // 후기 및 평점 저장 핸들러 (읽고 있는 책/다 읽은 책용)
  const saveBookStatus = (bookToSave) => {
    if (!currentUserIdentifier) {
      alert("로그인 후 기록을 저장할 수 있습니다.");
      return;
    }

    let storedBookStatuses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
    );

    const existingIndex = storedBookStatuses.findIndex(
      (item) =>
        item.userIdentifier === currentUserIdentifier &&
        item.isbn === bookToSave.isbn
    );

    const updatedBookData = {
      ...bookToSave, // 기존 책 정보 유지
      userIdentifier: currentUserIdentifier,
      review: bookReviews[bookToSave.isbn] || "", // 현재 상태의 후기 반영
      rating: bookRatings[bookToSave.isbn] || 0, // 현재 상태의 평점 반영
      // 만약 날짜 정보도 이곳에서 업데이트하고 싶다면 추가 (현재는 BookDetail에서만)
    };

    if (existingIndex > -1) {
      storedBookStatuses[existingIndex] = updatedBookData;
    } else {
      alert(
        "이 책은 아직 내 서재에 추가되지 않았습니다. '내 서재에 추가' 기능을 이용해주세요."
      );
      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_BOOK_STATUS_KEY,
      JSON.stringify(storedBookStatuses)
    );
    alert("기록이 저장되었습니다!");
    loadBookData(); // 저장 후 데이터 다시 로드하여 UI 업데이트
  };

  // 찜 해제 (WishList에서 제거)
  const handleRemoveFromWishlist = (isbnToRemove) => {
    if (!currentUserIdentifier) {
      alert("로그인 후 찜 해제 기능을 사용할 수 있습니다.");
      return;
    }
    const updatedWishList = wishList.filter(
      (item) =>
        !(
          item.userIdentifier === currentUserIdentifier &&
          item.isbn === isbnToRemove
        )
    );
    localStorage.setItem(
      LOCAL_STORAGE_WISH_LIST_KEY,
      JSON.stringify(updatedWishList)
    );
    setWishList(updatedWishList); // UI 업데이트
    alert("찜 목록에서 제거되었습니다.");
  };

  // 내 서재에서 기록 삭제 (읽고 있는 책, 다 읽은 책)
  const handleRemoveFromMyLibrary = (isbnToRemove) => {
    if (!currentUserIdentifier) {
      alert("로그인 후 기록 삭제 기능을 사용할 수 있습니다.");
      return;
    }

    if (window.confirm("정말로 이 책의 기록을 내 서재에서 삭제하시겠습니까?")) {
      let storedBookStatuses = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
      );

      const updatedBookStatuses = storedBookStatuses.filter(
        (item) =>
          !(
            item.userIdentifier === currentUserIdentifier &&
            item.isbn === isbnToRemove
          )
      );

      localStorage.setItem(
        LOCAL_STORAGE_BOOK_STATUS_KEY,
        JSON.stringify(updatedBookStatuses)
      );
      alert("내 서재에서 기록이 삭제되었습니다.");
      loadBookData(); // 데이터 다시 로드하여 UI 업데이트
    }
  };

  // '읽기 시작' 버튼 클릭 시 (찜한 책 -> 읽고 있는 책)
  const handleStartReading = (bookToMove) => {
    if (!currentUserIdentifier) {
      alert("로그인 후 이용할 수 있습니다.");
      return;
    }

    let storedBookStatuses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
    );

    // 이미 '읽고 있는 책' 또는 '읽은 책'으로 저장되어 있는지 확인
    const existingBook = storedBookStatuses.find(
      (item) =>
        item.userIdentifier === currentUserIdentifier &&
        item.isbn === bookToMove.isbn
    );

    if (existingBook) {
      alert(
        "이미 내 서재에 있는 책입니다. '읽고 있는 책' 탭에서 확인해주세요."
      );
      return;
    }

    // 새로운 '읽고 있는 책' 데이터 생성
    const newReadingBook = {
      userIdentifier: currentUserIdentifier,
      isbn: bookToMove.isbn,
      status: "READING", // 상태를 '읽고 있는 책'으로 설정
      addedDate: new Date().toISOString().split("T")[0], // 오늘 날짜
      readStartDate: new Date().toISOString().split("T")[0], // 오늘 날짜를 시작일로 설정
      title: bookToMove.title,
      cover: bookToMove.cover,
      author: bookToMove.author,
      publisher: bookToMove.publisher, // 찜 목록에는 publisher 정보가 없을 수 있음. BookDetail에서 저장 시 추가해야 함.
      review: "", // 초기 후기
      rating: 0, // 초기 평점
      libName: "", // 필요시 추가
    };

    storedBookStatuses.push(newReadingBook);
    localStorage.setItem(
      LOCAL_STORAGE_BOOK_STATUS_KEY,
      JSON.stringify(storedBookStatuses)
    );

    // 찜 목록에서 해당 책 제거
    handleRemoveFromWishlist(bookToMove.isbn);

    alert(
      `'${bookToMove.title}'을(를) 읽기 시작합니다! '읽고 있는 책'으로 이동되었습니다.`
    );
    setKey("reading"); // '읽고 있는 책' 탭으로 자동 이동
    loadBookData(); // 데이터 다시 로드하여 UI 업데이트
  };

  const renderBookList = (books, type) => {
    // type 인자 추가 ('wishlist', 'reading', 'read')
    if (!isLoggedIn) {
      return (
        <Alert variant="info" className="text-center mt-4">
          로그인 후 이용할 수 있는 서비스입니다.
        </Alert>
      );
    }
    if (!currentUserIdentifier) {
      return (
        <Alert variant="warning" className="text-center mt-4">
          사용자 정보를 불러올 수 없습니다.
        </Alert>
      );
    }

    if (books.length === 0) {
      return (
        <Alert variant="light" className="text-center mt-4">
          아직{" "}
          {type === "wishlist"
            ? "찜한 책이"
            : type === "reading"
            ? "읽고 있는 책이"
            : "다 읽은 책이"}{" "}
          없습니다.
        </Alert>
      );
    }

    return (
      <Row className="mt-4">
        {books.map((book) => (
          <Col xs={12} key={book.isbn} className="mb-4">
            <Card className="shadow-sm h-100">
              {" "}
              {/* h-100 추가 */}
              <Row className="g-0">
                {/* 왼쪽: 이미지, 제목, 지은이, (조건부) 독서 기간 */}
                <Col
                  xs={12}
                  md={type === "wishlist" ? 3 : 2}
                  className="d-flex flex-column align-items-center p-3"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{
                      width: "80px", // 썸네일 크기 조절
                      height: "100px",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                    className="mb-2"
                  />
                  <Card.Title
                    className="text-ellipsis-single-line text-center"
                    style={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                    {book.title}
                  </Card.Title>
                  <Card.Text
                    className="text-muted text-ellipsis-single-line text-center"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {book.author}
                  </Card.Text>

                  {/* 독서 기간 표시 (읽고 있는 책, 다 읽은 책만) */}
                  {(type === "read" || type === "reading") && (
                    <Card.Text
                      className="mt-2 text-center"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <small>
                        {book.status === "READ"
                          ? `기간: ${book.readStartDate || "미지정"} ~ ${
                              book.readEndDate || "미지정"
                            }`
                          : `시작일: ${book.readStartDate || "미지정"}`}
                      </small>
                    </Card.Text>
                  )}
                </Col>

                {/* 오른쪽: 설명, 버튼, (조건부) 후기/평점/메모 */}
                <Col
                  xs={12}
                  md={type === "wishlist" ? 9 : 10}
                  className="p-3 d-flex flex-column justify-content-between"
                >
                  {type === "wishlist" ? (
                    <>
                      {/* 찜한 책 - 간단 설명 (줄거리 요약) */}
                      <div className="mb-3">
                        <Card.Text
                          style={{ fontSize: "0.9rem", lineHeight: "1.4" }}
                        >
                          {book.description
                            ? book.description.length > 150
                              ? book.description.substring(0, 150) + "..."
                              : book.description
                            : "줄거리 요약이 없습니다."}
                        </Card.Text>
                      </div>

                      {/* 찜한 책 - 버튼 및 메모 */}
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStartReading(book)}
                        >
                          <FaPlay className="me-1" /> 읽기 시작
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(book.isbn)}
                        >
                          <FaHeartBroken className="me-1" /> 찜 해제
                        </Button>
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label
                          className="fw-bold d-block text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          한줄 메모
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2} // 한줄 메모이므로 높이 줄임
                          placeholder="이 책에 대한 간단한 메모를 남겨보세요."
                          value={wishlistMemos[book.isbn] || ""} // 찜한 책 메모 불러오기
                          onChange={(e) =>
                            handleWishlistMemoChange(book.isbn, e.target.value)
                          }
                        />
                      </Form.Group>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => saveWishlistMemo(book.isbn)}
                        className="w-100 mt-2"
                      >
                        메모 저장
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* 읽고 있는 책, 다 읽은 책 - 후기 입력창 및 평점 */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">나의 후기</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6} // 입력창 높이 크게
                          placeholder="이 책에 대한 후기를 작성해주세요."
                          value={bookReviews[book.isbn] || ""}
                          onChange={(e) =>
                            handleReviewChange(book.isbn, e.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">나의 평점</Form.Label>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{
                                cursor: "pointer",
                                fontSize: "1.8rem",
                                color:
                                  star <= (bookRatings[book.isbn] || 0)
                                    ? "#ffc107"
                                    : "#e4e5e9",
                              }}
                              onClick={() => handleRatingClick(book.isbn, star)}
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                      </Form.Group>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => saveBookStatus(book)}
                        className="w-100 mt-2"
                      >
                        기록 저장
                      </Button>
                      {/* 🔽 추가: 기록 삭제 버튼 🔽 */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveFromMyLibrary(book.isbn)}
                        className="w-100 mt-2"
                      >
                        <FaTrashAlt className="me-1" /> 기록 삭제
                      </Button>
                      {/* 🔼 추가: 기록 삭제 버튼 🔼 */}
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 fw-bold">내 기록</h2>
      <Tabs
        id="history-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="wishlist" title="찜한 책">
          {renderBookList(wishList, "wishlist")}
        </Tab>
        <Tab eventKey="reading" title="읽고 있는 책">
          {renderBookList(readingBooks, "reading")}
        </Tab>
        <Tab eventKey="read" title="다 읽은 책">
          {renderBookList(readBooks, "read")}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default History;
