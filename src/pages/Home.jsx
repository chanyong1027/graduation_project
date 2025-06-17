// import React, { useEffect, useState } from "react";
// import { Container, Spinner } from "react-bootstrap";
// import MainCard from "../components/MainCard";
// import BestsellerList from "../components/BestsellerList";
// import NewReleaseList from "../components/NewReleaseList";

// const Home = () => {
//   const [bestsellers, setBestsellers] = useState([]);
//   const [newReleases, setNewReleases] = useState([]);

//   // loading 상태는 더 이상 렌더링에 사용되지 않지만, 데이터가 완전히 로드되었는지 여부를 추적할 수는 있습니다.
//   // 여기서는 로딩 스피너를 제거하기 위해 직접적인 렌더링 조건에서 제외합니다.
//   const [loading, setLoading] = useState(true); // 여전히 데이터 로딩 완료 여부를 추적합니다.
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const [bestsellerData, newReleaseData] = await Promise.all([
//           getBestsellers(),
//           getNewReleases(),
//         ]);
//         setBestsellers(bestsellerData);
//         setNewReleases(newReleaseData);
//       } catch (err) {
//         console.error("Failed to fetch books:", err);
//         setError(
//           new Error("도서를 불러오는 데 실패했습니다. 다시 시도해주세요.")
//         );
//       } finally {
//         setLoading(false); // 로딩 완료
//       }
//     };

//     fetchBooks();
//   }, []);

//   return (
//     <Container className="mt-4">
//       <div className="text-center">
//         <div className="mt-4">
//           <MainCard />
//         </div>
//       </div>

//       {/* 로딩 스피너를 직접적으로 렌더링하는 조건부를 제거합니다. */}
//       {/* 오류 발생 시에만 메시지를 표시합니다. */}
//       {error ? (
//         <div className="text-center mt-5">
//           <p className="text-danger">{error.message}</p>
//         </div>
//       ) : (
//         // 데이터 로딩이 완료되거나 오류가 없을 때 목록을 표시합니다.
//         // books prop이 비어있으면 각 컴포넌트 내부에서 "데이터 없음" 메시지를 처리합니다.
//         <>
//           <BestsellerList books={bestsellers} />
//           <NewReleaseList books={newReleases} />
//         </>
//       )}

//       {/* 참고: 만약 데이터 로딩 중 완전히 빈 화면을 피하고 싶다면,
//         skeleton UI (스피너 대신 콘텐츠의 윤곽선을 미리 보여주는 방식)를 고려할 수 있습니다.
//       */}
//     </Container>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import MainCard from "../components/MainCard";
//import BestsellerList from "../components/BestsellerList";
//import NewReleaseList from "../components/NewReleaseList";

// ⭐️ 베스트셀러 데이터를 가져오는 함수 (Serverless Function 호출)
const fetchBestsellers = async () => {
  try {
    // '/api/aladin-bestsellers'는 Vercel Serverless Function의 엔드포인트입니다.
    // 이 Serverless Function은 실제 알라딘 Bestseller API를 호출합니다.
    const response = await fetch(
      "/api/aladin-bestsellers?categoryId=0&queryType=Bestseller"
    );
    const data = await response.json();
    // 알라딘 API 응답 구조에 따라 'item' 배열을 반환하도록 설정 (ItemList.aspx 응답 기준)
    return data.item || [];
  } catch (error) {
    console.error("베스트셀러 정보를 불러오는 데 실패했습니다:", error);
    return [];
  }
};

// ⭐️ 신간 데이터를 가져오는 함수 (Serverless Function 호출)
const fetchNewReleases = async () => {
  try {
    // '/api/aladin-new-releases'는 Vercel Serverless Function의 엔드포인트입니다.
    // 이 Serverless Function은 실제 알라딘 ItemNewAll API를 호출합니다.
    const response = await fetch(
      "/api/aladin-new-releases?categoryId=0&queryType=ItemNewAll"
    );
    const data = await response.json();
    // 알라딘 API 응답 구조에 따라 'item' 배열을 반환하도록 설정
    return data.item || [];
  } catch (error) {
    console.error("신간 정보를 불러오는 데 실패했습니다:", error);
    return [];
  }
};

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
        // ⭐️ getBestsellers()와 getNewReleases() 대신 위에서 정의한 함수들을 호출합니다.
        const [bestsellerData, newReleaseData] = await Promise.all([
          fetchBestsellers(),
          fetchNewReleases(),
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
