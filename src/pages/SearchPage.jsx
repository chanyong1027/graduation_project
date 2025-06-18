import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import BookCard from "../components/BookCard";
<<<<<<< HEAD
// import { searchBooks } from "../api/Aladin"; // 🚨 이 줄을 제거합니다.

const ITEMS_PER_PAGE = 20;

// ⭐️ searchBooks 함수를 대체할 fetchSearchBooks 함수 정의
// 이 함수는 /api/aladin-search Serverless Function을 직접 호출합니다.
const fetchSearchBooks = async (query, maxResults = 20, start = 1) => {
  try {
    const response = await fetch(
      `/api/aladin-search?query=${encodeURIComponent(
        query
      )}&MaxResults=${maxResults}&start=${start}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `검색 API 요청 실패: ${response.status}`
      );
    }

    const data = await response.json();
    return data.item || [];
  } catch (error) {
    console.error("검색 결과를 불러오는 데 실패했습니다:", error);
    // 오류 발생 시 빈 배열 또는 적절한 오류 처리를 반환합니다.
    return [];
  }
};

=======
import { searchBooks } from "../api/Aladin"; // 알맞게 경로 조정

const ITEMS_PER_PAGE = 20;

>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) return;

<<<<<<< HEAD
    const performSearch = async () => {
      // 함수 이름 변경 (fetchBooks 대신)
      setLoading(true);
      try {
        // ⭐️ searchBooks 대신 새로 정의한 fetchSearchBooks를 호출합니다.
        const results = await fetchSearchBooks(query, 500); // 최대 500권까지 (Serverless Function으로 전달)
        setBooks(results);
      } catch (error) {
        console.error("검색 결과 불러오기 실패:", error);
        setBooks([]); // 오류 발생 시 책 목록 초기화
        // 사용자에게 오류 메시지를 표시할 수 있도록 setError 상태도 고려할 수 있습니다.
      } finally {
        setLoading(false);
      }
    };

    performSearch(); // performSearch 함수 호출
  }, [query]); // query가 변경될 때마다 검색 실행
=======
    const fetchBooks = async () => {
      setLoading(true);
      const results = await searchBooks(query, 500); // 최대 500권까지
      setBooks(results);
      setLoading(false);
    };

    fetchBooks();
  }, [query]);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const currentBooks = books.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pagesPerBlock = 10;
    const currentBlock = Math.floor((page - 1) / pagesPerBlock);
    const startPage = currentBlock * pagesPerBlock + 1;
    const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

    const pageItems = [];
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        />
        {pageItems}
        <Pagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container className="mt-4">
      <h4 className="fw-bold mb-3">🔍 "{query}" 검색 결과</h4>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2">검색 중입니다...</p>
        </div>
      ) : books.length === 0 ? (
        <p className="text-center text-muted mt-5">검색 결과가 없습니다.</p>
      ) : (
        <>
          <Row className="gy-4">
            {currentBooks.map((book) => (
              <Col key={book.isbn} xs={6} md={3}>
                <BookCard book={book} />
              </Col>
            ))}
          </Row>
          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default SearchPage;
