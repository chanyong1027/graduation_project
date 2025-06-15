import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import BookCard from "../components/BookCard";
import { searchBooks } from "../api/Aladin"; // 알맞게 경로 조정

const ITEMS_PER_PAGE = 20;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      setLoading(true);
      const results = await searchBooks(query, 500); // 최대 500권까지
      setBooks(results);
      setLoading(false);
    };

    fetchBooks();
  }, [query]);

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
