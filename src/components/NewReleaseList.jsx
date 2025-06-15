import React from "react";
import BookCard from "./BookCard";

const NewReleaseList = ({ books }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: "40px",
        border: "1px solid #e0e0e0",
      }}
    >
      <h4 className="fw-bold mb-3">📘 신간 도서</h4>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "16px",
          paddingBottom: "8px",
        }}
      >
        {books.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
    </div>
  );
};

export default NewReleaseList;
