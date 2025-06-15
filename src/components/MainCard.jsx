import { Card, Row, Col } from "react-bootstrap";
import bookImage from "../assets/books-41930_640.png"; // 이미지 경로 맞게 조정 필요

const MainCard = () => {
  return (
    <Card
      className="p-4 border-0 rounded-4 shadow-sm"
      style={{ backgroundColor: "#F0FAF0" }} // 연한 아이보리
    >
      <Row className="align-items-center">
        <Col md={4} className="text-center">
          <img
            src={bookImage}
            alt="책 더미"
            className="img-fluid"
            style={{ maxHeight: "250px" }}
          />
        </Col>
        <Col md={8}>
          <h4 className="fw-bold mb-3">오늘의 독서를 기록해보세요!</h4>
          <p className="mb-0 text-muted" style={{ fontSize: "1rem" }}>
            책을 읽다가 감명 깊었던 내용이 기억나지 않는 경험이 있나요?
            <br />
            이곳에서 당신의 독서를 기록하고 공유해 보세요!
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default MainCard;
