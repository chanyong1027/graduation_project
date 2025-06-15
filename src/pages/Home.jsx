import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import MainCard from "../components/MainCard";
import { getBestsellers, getNewReleases } from "../api/aladin";
import BestsellerList from "../components/BestsellerList";
import NewReleaseList from "../components/NewReleaseList";

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  // loading 상태는 더 이상 렌더링에 사용되지 않지만, 데이터가 완전히 로드되었는지 여부를 추적할 수는 있습니다.
  // 여기서는 로딩 스피너를 제거하기 위해 직접적인 렌더링 조건에서 제외합니다.
  const [loading, setLoading] = useState(true); // 여전히 데이터 로딩 완료 여부를 추적합니다.
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [bestsellerData, newReleaseData] = await Promise.all([
          getBestsellers(),
          getNewReleases(),
        ]);
        setBestsellers(bestsellerData);
        setNewReleases(newReleaseData);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError(
          new Error("도서를 불러오는 데 실패했습니다. 다시 시도해주세요.")
        );
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchBooks();
  }, []);

  return (
    <Container className="mt-4">
      <div className="text-center">
        <div className="mt-4">
          <MainCard />
        </div>
      </div>

      {/* 로딩 스피너를 직접적으로 렌더링하는 조건부를 제거합니다. */}
      {/* 오류 발생 시에만 메시지를 표시합니다. */}
      {error ? (
        <div className="text-center mt-5">
          <p className="text-danger">{error.message}</p>
        </div>
      ) : (
        // 데이터 로딩이 완료되거나 오류가 없을 때 목록을 표시합니다.
        // books prop이 비어있으면 각 컴포넌트 내부에서 "데이터 없음" 메시지를 처리합니다.
        <>
          <BestsellerList books={bestsellers} />
          <NewReleaseList books={newReleases} />
        </>
      )}

      {/* 참고: 만약 데이터 로딩 중 완전히 빈 화면을 피하고 싶다면,
        skeleton UI (스피너 대신 콘텐츠의 윤곽선을 미리 보여주는 방식)를 고려할 수 있습니다.
      */}
    </Container>
  );
};

export default Home;
