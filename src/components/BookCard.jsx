import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  console.log("원본 book.cover URL:", book.cover);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${book.isbn}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        minWidth: "160px", // 🔸 고정 너비로 줄임
        maxWidth: "160px",
        flexShrink: 0, // 🔸 스크롤 되도록 줄어들지 않게
        textAlign: "center",
        border: "none",
        padding: "10px",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={book.cover}
        alt={book.title}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "contain",
          borderRadius: "4px",
          marginBottom: "8px",
        }}
      />
      <p
        className="text-ellipsis-single-line"
        style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}
      >
        {book.title}
      </p>
      <p
        className="text-ellipsis-single-line"
        style={{ fontSize: "12px", color: "#555", margin: 0 }}
      >
        {book.author}
      </p>
    </div>
  );
};

export default BookCard;
