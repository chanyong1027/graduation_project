import { useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Container,
  Row,
  Col,
<<<<<<< HEAD
  Form, // Form 컴포넌트 필요
  Spinner,
  ListGroup,
  Collapse, // Collapse 컴포넌트 추가
} from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe, // FaGlobe 아이콘 추가 (홈페이지용)
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

// ... (기존 regionCodeMap, TTB_KEY, API_KEY_LIB, LOCAL_STORAGE_BOOK_STATUS_KEY, LOCAL_STORAGE_WISH_LIST_KEY, cachedAllLibraries 정의)
=======
  Modal,
  Form,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { FaHeart, FaRegHeart, FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
const regionCodeMap = {
  서울특별시: "11",
  부산광역시: "21",
  대구광역시: "22",
  인천광역시: "23",
  광주광역시: "24",
  대전광역시: "25",
  울산광역시: "26",
  세종특별자치시: "29",
  경기도: "31",
  강원도: "32",
  충청북도: "33",
  충청남도: "34",
  전라북도: "35",
  전라남도: "36",
  경상북도: "37",
  경상남도: "38",
  제주특별자치도: "39",
};

<<<<<<< HEAD
// const TTB_KEY = "ttbghdcksdyd1230357001";
// const API_KEY_LIB =
//   "ad79e8a862abd18051e4d11cc8cd80446c48d9273cd1f9b332292508d9422682"; // 도서관 API Key

const LOCAL_STORAGE_BOOK_STATUS_KEY = "userBookStatuses";
const LOCAL_STORAGE_WISH_LIST_KEY = "userWishList";
const LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX = "userPreferredLibraries_";

let cachedAllLibraries = null; // 모든 도서관 데이터를 캐싱할 변수

// const getRegionCodeFromLatLon = async (lat, lon) => {
//   try {
//     const res = await fetch(
//       `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
//       {
//         headers: {
//           Authorization: `KakaoAK 9f4c127055954893ddf23824b3c725ac`,
//         },
//       }
//     );
//     const data = await res.json();
//     const regionName = data.documents?.[0]?.region_1depth_name;
//     return regionCodeMap[regionName] || "11"; // default to 서울
//   } catch (error) {
//     console.error("역지오코딩 실패:", error);
//     return "11"; // fallback
//   }
// };

// 카카오 API 직접 호출 대신 Serverless Function 호출로 변경
const getRegionCodeFromLatLon = async (lat, lon) => {
  try {
    const res = await fetch(`/api/kakao-coord-to-region?x=${lon}&y=${lat}`); // 새 Serverless Function 호출
    const data = await res.json();
    const regionName = data.documents?.[0]?.region_1depth_name;
    return regionCodeMap[regionName] || "11";
  } catch (error) {
    console.error("역지오코딩 실패 (Serverless Function):", error);
    return "11";
=======
const TTB_KEY = "ttbghdcksdyd1230357001";
const API_KEY_LIB =
  "ad79e8a862abd18051e4d11cc8cd80446c48d9273cd1f9b332292508d9422682"; // 도서관 API Key

const LOCAL_STORAGE_BOOK_STATUS_KEY = "userBookStatuses";
const LOCAL_STORAGE_WISH_LIST_KEY = "userWishList";

let cachedAllLibraries = null; // 모든 도서관 데이터를 캐싱할 변수

const getRegionCodeFromLatLon = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK 9f4c127055954893ddf23824b3c725ac`,
        },
      }
    );
    const data = await res.json();
    const regionName = data.documents?.[0]?.region_1depth_name;
    return regionCodeMap[regionName] || "11"; // default to 서울
  } catch (error) {
    console.error("역지오코딩 실패:", error);
    return "11"; // fallback
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  }
};

// 거리 계산 함수 (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (킬로미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (킬로미터)
  return distance;
};

// 도서관 정보나루 API에서 모든 도서관 데이터 가져오는 함수 (MyLibrary와 유사)
const fetchAllLibraries = async () => {
  if (cachedAllLibraries) {
    console.log("캐시된 모든 도서관 데이터 사용");
    return cachedAllLibraries;
  }

  let allLibraries = [];
  let page = 1;

  while (true) {
    // 도서관 정보나루의 '정보공개 도서관 조회' API를 사용합니다.
<<<<<<< HEAD
    // const res = await fetch(
    //   `https://data4library.kr/api/libSrch?authKey=${API_KEY_LIB}&format=json&pageNo=${page}&pageSize=100`
    // );

    // if (!res.ok) {
    //   const errorText = await res.text();
    //   console.error("libSrch API 응답 오류:", res.status, errorText);
    //   throw new Error(`도서관 목록 요청 실패: ${res.status} ${res.statusText}`);
    // }
    const res = await fetch(`/api/lib-srch?pageNo=${page}&pageSize=100`); // Serverless Function 호출
=======
    const res = await fetch(
      `https://data4library.kr/api/libSrch?authKey=${API_KEY_LIB}&format=json&pageNo=${page}&pageSize=100`
    ); //

    if (!res.ok) {
      const errorText = await res.text();
      console.error("libSrch API 응답 오류:", res.status, errorText);
      throw new Error(`도서관 목록 요청 실패: ${res.status} ${res.statusText}`);
    }
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

    const data = await res.json();
    const libs = data.response?.libs || []; // API 응답 구조에 맞게 libs 추출

    if (libs.length === 0) break;
    allLibraries = allLibraries.concat(libs);
    page++;

    const totalCount = data.response?.numFound; // 전체 검색결과 건수
    if (totalCount && allLibraries.length >= totalCount) break;

<<<<<<< HEAD
    if (page > 50) break; // 최대 50페이지까지만 가져오도록 제한
=======
    if (page > 50) break;
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  }
  cachedAllLibraries = allLibraries;
  return allLibraries;
};

// 도서 소장 도서관 정보를 가져오는 함수 (data4library.kr의 '도서 소장 도서관 조회' API 사용)
const fetchBookHoldingLibraries = async (isbn13, regionCode) => {
<<<<<<< HEAD
  let allHoldingLibraries = [];
  let page = 1;
  const initialPageSize = 50; // 페이지 크기 조정
  let totalCount = null;

  try {
    while (true) {
      // '도서 소장 도서관 조회' API는 ISBN13을 필수로 요구합니다.
      // const url = `https://data4library.kr/api/libSrchByBook?authKey=${API_KEY_LIB}&isbn=${isbn13}&region=${regionCode}&pageSize=${initialPageSize}&pageNo=${page}&format=json`;
      // const res = await fetch(url);

      // if (!res.ok) {
      //   const errorText = await res.text();
      //   console.error("libSrchByBook API 응답 오류:", res.status, errorText);
      //   throw new Error(
      //     `책 소장 도서관 요청 실패: ${res.status} ${
      //       res.statusText
      //     }. 응답: ${errorText.substring(0, 100)}...`
      //   );
      // }
      const url = `/api/lib-srch-by-book?isbn=${isbn13}&region=${regionCode}&pageSize=${initialPageSize}&pageNo=${page}`; // Serverless Function 호출
      const res = await fetch(url);

      const data = await res.json();
      const libs = data.response?.libs || []; // API 응답 구조: data.response.libs 안에 lib 객체들이 있음

      if (libs.length === 0) break;

      allHoldingLibraries = allHoldingLibraries.concat(libs);

      if (totalCount === null) {
        totalCount = data.response?.numFound; // 첫 페이지에서 총 개수 확인
      }

      page++;

      if (totalCount && allHoldingLibraries.length >= totalCount) break;
      // API 정책에 따른 무한 루프 방지용 페이지 제한 (필요시 조정)
      if (page > 100) break; // 예시: 최대 100페이지
    }
    return allHoldingLibraries;
=======
  try {
    // '도서 소장 도서관 조회' API는 ISBN13을 필수로 요구합니다.
    // 요청 URL 형식: http://data4library.kr/api/libSrchByBook?authkey=[발급받은키]&isbn=[ISBN]&region=[지역코드]
    // 이 API는 region 파라미터를 필수로 요구하지만, 현재 코드에서는 사용자 위치 기반으로 필터링하므로,
    // 우선 모든 지역을 대상으로 조회하고 클라이언트에서 필터링하는 방식으로 진행할 수 있습니다.
    // 여기서는 region 파라미터를 제외하고 호출하여 모든 도서관을 가져온 뒤 필터링하는 방식으로 구현합니다.
    // 만약 region 필터링이 필수라면, 사용자 위치를 기반으로 region 코드를 먼저 찾아야 합니다.
    const url = `https://data4library.kr/api/libSrchByBook?authKey=${API_KEY_LIB}&isbn=${isbn13}&region=${regionCode}&pageSize=200&format=json`; //
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("libSrchByBook API 응답 오류:", res.status, errorText);
      throw new Error(
        `책 소장 도서관 요청 실패: ${res.status} ${
          res.statusText
        }. 응답: ${errorText.substring(0, 100)}...`
      );
    }

    const data = await res.json();
    // API 응답 구조를 보면 'libs' 배열 안에 'lib' 객체가 있습니다.
    return data.response?.libs || [];
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  } catch (error) {
    console.error("fetchBookHoldingLibraries 중 오류 발생:", error);
    throw error;
  }
};

<<<<<<< HEAD
// 도서관별 도서 소장여부 및 대출 가능여부 조회 (bookExist API)
const fetchLoanAvailability = async (libCode, isbn13) => {
  try {
    // const url = `https://data4library.kr/api/bookExist?authKey=${API_KEY_LIB}&libCode=${libCode}&isbn13=${isbn13}&format=json`;
    const url = `/api/book-exist?libCode=${libCode}&isbn13=${isbn13}`; // Serverless Function 호출
    const res = await fetch(url);
    // if (!res.ok) {
    //   console.error(
    //     `bookExist API 오류 (libCode: ${libCode}, isbn13: ${isbn13}):`,
    //     res.status,
    //     await res.text()
    //   );
    //   return null;
    // }
    const data = await res.json();
=======
// !!! 여기에 fetchLoanAvailability 함수를 정의해야 합니다. !!!
// 도서관별 도서 소장여부 및 대출 가능여부 조회 (bookExist API)
const fetchLoanAvailability = async (libCode, isbn13) => {
  try {
    const url = `https://data4library.kr/api/bookExist?authKey=${API_KEY_LIB}&libCode=${libCode}&isbn13=${isbn13}&format=json`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `bookExist API 오류 (libCode: ${libCode}, isbn13: ${isbn13}):`,
        res.status,
        await res.text()
      );
      return null;
    }
    const data = await res.json();
    // API 응답 구조: data.response.result.loanAvailable
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    return data.response?.result?.loanAvailable === "Y"; // "Y"면 true, 아니면 false (혹은 'N'인 경우)
  } catch (error) {
    console.error("fetchLoanAvailability 중 오류 발생:", error);
    return null;
  }
};

const BookDetail = () => {
<<<<<<< HEAD
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false); // 폼 표시 여부 상태 추가
  const [bookStatus, setBookStatus] = useState("");
  const [readStartDate, setReadStartDate] = useState(""); // 독서 시작일 상태
  const [readEndDate, setReadEndDate] = useState(""); // 독서 종료일 상태
  const [review, setReview] = useState(""); // 후기 상태
  const [rating, setRating] = useState(0); // 평점 상태 (별점)

=======
  const { isbn } = useParams(); // URL에서 넘어오는 ISBN (10자리 또는 13자리)
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookStatus, setBookStatus] = useState("");
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  const [isWished, setIsWished] = useState(false);

  const { user, isLoggedIn } = useAuth();
  const currentUserIdentifier = isLoggedIn ? user?.email : null;

  const [userLocation, setUserLocation] = useState(null);
  const [nearestLibraries, setNearestLibraries] = useState([]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  //페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
<<<<<<< HEAD
  const librariesPerPage = 10;
=======
  const librariesPerPage = 10; // 한 페이지에 10개씩
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  const [totalPageCount, setTotalPageCount] = useState(0);

  const loadUserBookData = useCallback(() => {
    if (!currentUserIdentifier) {
      setIsWished(false);
      setBookStatus("");
<<<<<<< HEAD
      setReadStartDate("");
      setReadEndDate("");
      setReview("");
      setRating(0);
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
      return;
    }

    const storedWishList = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WISH_LIST_KEY) || "[]"
    );
    setIsWished(
      storedWishList.some(
        (item) =>
          item.userIdentifier === currentUserIdentifier && item.isbn === isbn
      )
    );

    const storedBookStatuses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
    );
    const userBookStatus = storedBookStatuses.find(
      (item) =>
        item.userIdentifier === currentUserIdentifier && item.isbn === isbn
    );
<<<<<<< HEAD
    if (userBookStatus) {
      setBookStatus(userBookStatus.status);
      setReadStartDate(userBookStatus.readStartDate || "");
      setReadEndDate(userBookStatus.readEndDate || "");
      setReview(userBookStatus.review || ""); // 저장된 후기 불러오기
      setRating(userBookStatus.rating || 0); // 저장된 평점 불러오기
    } else {
      setBookStatus("");
      setReadStartDate("");
      setReadEndDate("");
      setReview("");
      setRating(0);
    }
=======
    setBookStatus(userBookStatus ? userBookStatus.status : "");
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  }, [currentUserIdentifier, isbn]);

  useEffect(() => {
    const fetchBookDetail = async () => {
      setBookLoading(true);
      setBookError(null);

      try {
<<<<<<< HEAD
        const itemIdType = isbn.length === 13 ? "ISBN13" : "ISBN";
        // const response = await fetch(
        //   `/aladin/ttb/api/ItemLookUp.aspx?ttbkey=${TTB_KEY}&itemIdType=${itemIdType}&ItemId=${isbn}&output=js&Version=20131101`
        // );
        // Aladin API 직접 호출 대신 Serverless Function 호출로 변경
        const response = await fetch(
          `/api/aladin-lookup?itemId=${isbn}&itemIdType=${itemIdType}`
        );
=======
        // Aladin 상품 조회 API 사용. ItemIdType은 ISBN 또는 ISBN13을 지원합니다.
        // itemIdType을 useParams에서 넘어온 isbn의 길이에 따라 결정합니다.
        const itemIdType = isbn.length === 13 ? "ISBN13" : "ISBN"; //
        const response = await fetch(
          `/aladin/ttb/api/ItemLookUp.aspx?ttbkey=${TTB_KEY}&itemIdType=${itemIdType}&ItemId=${isbn}&output=js&Version=20131101`
        ); //
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        const data = await response.json();

        if (data.item && data.item.length > 0) {
          setBook(data.item[0]);
        } else {
          console.warn("❗ 책 정보를 찾을 수 없습니다.");
          setBook(null);
          setBookError("책 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("❌ API 에러:", error);
        setBook(null);
        setBookError(`책 정보 로딩 중 오류 발생: ${error.message}`);
      } finally {
        setBookLoading(false);
      }
    };

    fetchBookDetail();
<<<<<<< HEAD
  }, [isbn]);
=======
  }, [isbn]); // isbn이 변경될 때마다 책 정보를 다시 가져오도록 합니다.
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  useEffect(() => {
    loadUserBookData();
  }, [loadUserBookData]);

  // 사용자 위치 정보 및 가까운 도서관 목록 가져오기
  useEffect(() => {
    const fetchLibrariesWithBookStatus = async () => {
      setLocationLoading(true);
      setLocationError(null);
<<<<<<< HEAD
      setCurrentPage(1);
=======
      setCurrentPage(1); // 새 검색 시작 시 페이지를 1로 초기화
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

      if (!navigator.geolocation) {
        setLocationError("Geolocation이 이 브라우저에서 지원되지 않습니다.");
        setLocationLoading(false);
        return;
      }

<<<<<<< HEAD
=======
      // 1. 사용자 위치 가져오기
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          try {
<<<<<<< HEAD
            // const regionCode = await getRegionCodeFromLatLon(
            //   latitude,
            //   longitude
            // );
            const regionCode = await getRegionCodeFromLatLon(
              latitude,
              longitude
            ); // Serverless Function 호출
            // const allLibrariesData = await fetchAllLibraries();
            const allLibrariesData = await fetchAllLibraries(); // Serverless Function 호출
            const allLibrariesMap = new Map(
              allLibrariesData.map((libObj) => [libObj.lib.libCode, libObj.lib])
            );

=======
            const regionCode = await getRegionCodeFromLatLon(
              latitude,
              longitude
            );
            // 2. 모든 도서관 데이터 가져오기 (캐싱된 데이터 활용)
            const allLibrariesData = await fetchAllLibraries(); //
            const allLibrariesMap = new Map(
              allLibrariesData.map((libObj) => [libObj.lib.libCode, libObj.lib]) //
            );

            // 3. 해당 책을 소장한 도서관 정보 가져오기 (반드시 book.isbn13 사용)
            // Aladin API에서 받은 book 객체에 isbn13이 있을 때만 호출합니다.
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
            if (!book || !book.isbn13) {
              setLocationError(
                "ISBN13 정보가 없어 도서 소장 도서관을 검색할 수 없습니다."
              );
              setNearestLibraries([]);
<<<<<<< HEAD
              setTotalPageCount(0);
=======
              setTotalPageCount(0); // 페이지 수 초기화
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
              setLocationLoading(false);
              return;
            }

<<<<<<< HEAD
            // const bookHoldingLibsResponse = await fetchBookHoldingLibraries(
            //   book.isbn13,
            //   regionCode
            // );
            const bookHoldingLibsResponse = await fetchBookHoldingLibraries(
              book.isbn13,
              regionCode
            ); // Serverless Function 호출

=======
            // data4library.kr의 '도서 소장 도서관 조회' API는 ISBN13을 요구합니다.
            const bookHoldingLibsResponse = await fetchBookHoldingLibraries(
              book.isbn13,
              regionCode
            );

            // bookHoldingLibsResponse 구조 확인: data.response.libs 안에 lib 객체들이 있음
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
            const bookHoldingLibs = bookHoldingLibsResponse.map(
              (item) => item.lib
            );

<<<<<<< HEAD
            // MyLibrary에서 저장된 사용자별 선호 도서관 목록을 불러옵니다.
            const userPreferredLibs = currentUserIdentifier
              ? JSON.parse(
                  localStorage.getItem(
                    LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX +
                      currentUserIdentifier
                  ) || "[]"
                )
              : [];

            // 선호 도서관의 libCode 또는 libName Set 생성
            const myPreferredLibCodes = new Set(
              userPreferredLibs.map((libObj) => libObj.lib.libCode)
            );
            const myPreferredLibNames = new Set(
              userPreferredLibs.map((libObj) => libObj.lib.libName)
            );

            const combinedLibs = bookHoldingLibs
              .map((holdingLib) => {
                const libCode = holdingLib.libCode;
                const matchedLibDetail = allLibrariesMap.get(libCode);

                if (matchedLibDetail) {
                  const libLat = parseFloat(matchedLibDetail.latitude);
                  const libLon = parseFloat(matchedLibDetail.longitude);

                  if (isNaN(libLat) || isNaN(libLon)) {
                    return null;
=======
            // 4. "내 서재"에 저장된 도서관 목록 추출 (libName으로 확인)
            const storedBookStatuses = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
            );
            const myPreferredLibNames = new Set(
              storedBookStatuses
                .filter((item) => item.userIdentifier === currentUserIdentifier)
                .map((item) => item.libName) // 사용자가 책을 추가할 때 libName도 저장했다고 가정
                .filter(Boolean)
            );

            // 5. 책 소장 도서관과 전체 도서관 정보를 병합하고 거리, 대출 가능 여부 추가
            const combinedLibs = bookHoldingLibs
              .map((holdingLib) => {
                // holdingLib은 libSrchByBook API의 lib 객체
                const libCode = holdingLib.libCode; //
                const matchedLibDetail = allLibrariesMap.get(libCode);

                if (matchedLibDetail) {
                  const libLat = parseFloat(matchedLibDetail.latitude); //
                  const libLon = parseFloat(matchedLibDetail.longitude); //

                  if (isNaN(libLat) || isNaN(libLon)) {
                    return null; // 위경도 정보가 없는 도서관 제외
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
                  }

                  const dist = calculateDistance(
                    latitude,
                    longitude,
                    libLat,
                    libLon
                  );

<<<<<<< HEAD
                  // isPreferred 판단 로직 수정: MyLibrary에서 등록된 도서관인지 확인
                  const isPreferred =
                    myPreferredLibCodes.has(matchedLibDetail.libCode) ||
                    myPreferredLibNames.has(matchedLibDetail.libName);

                  return {
                    ...matchedLibDetail,
=======
                  // bookSrchByBook API 응답에서 대출 가능 여부 확인 필드가 직접적으로 제공되지 않음.
                  // 이를 확인하려면 '도서관별 도서 소장여부 및 대출 가능여부 조회' API (bookExist)를
                  // 각 도서관마다 따로 호출해야 함. 이는 비효율적이므로, 현재는 bookSrchByBook의
                  // 응답에 대출 가능 여부 필드가 있다고 가정하거나, 이 필드를 생략합니다.
                  // 원본 코드에서는 loanAvailable을 사용했는데, 이는 bookSrch 응답에 있는 필드입니다.
                  // libSrchByBook (도서 소장 도서관 조회) API는 단순히 '소장 여부'만 알려줍니다.
                  // 여기서는 대출 가능 여부 정보가 없으므로 해당 필드를 제거하거나, 임의로 설정합니다.
                  // 원본 코드의 'bookSrch' API의 'loanItem'에서 가져왔던 'loanAvailable' 필드를
                  // 'libSrchByBook' API에서는 직접적으로 제공하지 않습니다.

                  // API 문서 '11. 도서관별 도서 소장여부 및 대출 가능여부 조회'  참조
                  // 이 API (bookExist)는 libCode와 isbn13을 받아서 hasBook과 loanAvailable을 반환합니다.
                  // 하지만 이 API를 각 도서관마다 호출하는 것은 비효율적이므로,
                  // 여기서는 data4library.kr의 '도서 소장 도서관 조회' API (libSrchByBook)에서
                  // 직접적인 대출 가능 여부 정보는 없다고 가정하고 처리합니다.

                  // 대출 가능 여부 정보를 표시하려면, 각 도서관에 대해 bookExist API를 개별적으로 호출해야 합니다.
                  // 이는 API 요청 횟수를 매우 늘리므로 주의해야 합니다.
                  // 현재 코드는 bookSrch API에서 loanAvailable을 가져온다고 가정했던 부분을
                  // libSrchByBook API 사용으로 변경했기 때문에 loanAvailable 정보를 직접 얻을 수 없습니다.
                  // 이 부분의 정확한 구현은 data4library.kr API의 제약사항을 고려해야 합니다.

                  // 임시로 isLoanAvailable을 true로 설정하거나, 별도의 API 호출 로직 추가 필요.
                  // 여기서는 일단 해당 정보를 제거하거나, API에서 제공하는 'statusCode' 필드를 활용할 수 있다면 고려해봅니다.
                  // 현재 'libSrchByBook' 응답에는 'statusCode'가 직접 명시되어 있지 않습니다.
                  // 따라서 `isLoanAvailable` 필드는 정확한 정보가 없으므로 제거하거나 임의의 값으로 둡니다.
                  const isPreferred = myPreferredLibNames.has(
                    matchedLibDetail.libName
                  ); //

                  return {
                    ...matchedLibDetail, // lib 상세 정보
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
                    distance: dist,
                    isLoanAvailable: undefined, // 정확한 정보 아님, API 스펙에 따름
                    isPreferred: isPreferred,
                  };
                }
                return null;
              })
<<<<<<< HEAD
              .filter(Boolean);

            // 정렬 로직은 기존과 동일 (isPreferred가 가장 높은 우선순위)
=======
              .filter(Boolean); // null 값 제거

            // 6. 도서관 목록 정렬 (우선순위: 내 도서관 > 대출 가능 > 거리 순)
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
            combinedLibs.sort((a, b) => {
              if (a.isPreferred && !b.isPreferred) return -1;
              if (!a.isPreferred && b.isPreferred) return 1;
              return a.distance - b.distance;
            });

<<<<<<< HEAD
            setNearestLibraries(combinedLibs);
            setTotalPageCount(
              Math.ceil(combinedLibs.length / librariesPerPage)
            );
=======
            setNearestLibraries(combinedLibs); // 모든 도서관을 상태에 저장
            setTotalPageCount(
              Math.ceil(combinedLibs.length / librariesPerPage)
            ); // 전체 페이지 수 계산
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
          } catch (err) {
            console.error("도서관 목록 가져오기 실패:", err);
            setLocationError(
              "도서관 목록을 불러오는 데 실패했습니다. (API 오류)"
            );
          } finally {
            setLocationLoading(false);
          }
        },
        (err) => {
          console.error("위치 정보 가져오기 실패:", err);
          if (err.code === err.PERMISSION_DENIED) {
            setLocationError("위치 정보 제공을 허용해주세요.");
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setLocationError("위치 정보를 사용할 수 없습니다.");
          } else if (err.code === err.TIMEOUT) {
            setLocationError("위치 정보 요청 시간이 초과되었습니다.");
          } else {
            setLocationError(
              "위치 정보 가져오기 중 알 수 없는 오류가 발생했습니다."
            );
          }
          setLocationLoading(false);
<<<<<<< HEAD
          setTotalPageCount(0);
=======
          setTotalPageCount(0); // 페이지 수 초기화
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        }
      );
    };

<<<<<<< HEAD
    if (!bookLoading && book && book.isbn13) {
      fetchLibrariesWithBookStatus();
    } else if (!bookLoading && (!book || !book.isbn13)) {
=======
    // 책 정보 로딩이 완료되고 book 객체가 존재할 때만 도서관 정보 요청 시작
    // book.isbn13이 확보되어야 data4library API를 호출할 수 있습니다.
    if (!bookLoading && book && book.isbn13) {
      fetchLibrariesWithBookStatus();
    } else if (!bookLoading && (!book || !book.isbn13)) {
      // 책 정보를 찾을 수 없거나 isbn13이 없는 경우 도서관 정보도 로드하지 않음
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
      setLocationError(
        "도서 정보를 찾을 수 없거나 ISBN13 정보가 없어 도서 소장 도서관을 검색할 수 없습니다."
      );
      setLocationLoading(false);
<<<<<<< HEAD
      setTotalPageCount(0);
    }
  }, [book, bookLoading, currentUserIdentifier]);

=======
      setTotalPageCount(0); // 페이지 수 초기화
    }
  }, [book, bookLoading, currentUserIdentifier]); // book, bookLoading 의존성 추가

  // 현재 페이지에 표시할 도서관 목록 계산
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  const indexOfLastLibrary = currentPage * librariesPerPage;
  const indexOfFirstLibrary = indexOfLastLibrary - librariesPerPage;
  const currentLibraries = nearestLibraries.slice(
    indexOfFirstLibrary,
    indexOfLastLibrary
  );

<<<<<<< HEAD
  useEffect(() => {
    if (currentLibraries.length > 0 && book?.isbn13) {
      const loadLoanAvailability = async () => {
=======
  // *** 대출 가능 여부 지연 로딩 useEffect ***
  useEffect(() => {
    if (currentLibraries.length > 0 && book?.isbn13) {
      const loadLoanAvailability = async () => {
        // 이미 대출 가능 여부가 로딩된 도서관은 스킵
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        const librariesToLoad = currentLibraries.filter(
          (lib) => lib.isLoanAvailable === undefined
        );

        if (librariesToLoad.length > 0) {
          const updatedCurrentLibs = await Promise.all(
            librariesToLoad.map(async (lib) => {
<<<<<<< HEAD
              // const loanAvailable = await fetchLoanAvailability(
              //   lib.libCode,
              //   book.isbn13
              // );
              const loanAvailable = await fetchLoanAvailability(
                lib.libCode,
                book.isbn13
              ); // Serverless Function 호출
=======
              const loanAvailable = await fetchLoanAvailability(
                lib.libCode,
                book.isbn13
              );
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
              return { ...lib, isLoanAvailable: loanAvailable };
            })
          );

<<<<<<< HEAD
=======
          // 전체 nearestLibraries 배열을 업데이트하여, 해당 페이지의 도서관 정보만 반영
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
          setNearestLibraries((prevLibraries) =>
            prevLibraries.map((lib) => {
              const updatedLib = updatedCurrentLibs.find(
                (ulib) => ulib.libCode === lib.libCode
              );
              return updatedLib ? updatedLib : lib;
            })
          );
        }
      };
      loadLoanAvailability();
    }
<<<<<<< HEAD
  }, [currentPage, currentLibraries, book?.isbn13]);
=======
  }, [currentPage, currentLibraries, book?.isbn13]); // 페이지, 현재 도서관, ISBN13 변경 시 재실행
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  const handleToggleWish = useCallback(() => {
    if (!isLoggedIn || !currentUserIdentifier) {
      alert("로그인 후 찜하기 기능을 사용할 수 있습니다.");
      return;
    }

    let storedWishList = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WISH_LIST_KEY) || "[]"
    );
    let updatedWishList;

    if (isWished) {
      updatedWishList = storedWishList.filter(
        (item) =>
          !(item.userIdentifier === currentUserIdentifier && item.isbn === isbn)
      );
    } else {
      updatedWishList = [
        ...storedWishList,
        {
          userIdentifier: currentUserIdentifier,
          isbn: isbn,
          title: book.title,
          cover: book.cover,
        },
      ];
    }
    localStorage.setItem(
      LOCAL_STORAGE_WISH_LIST_KEY,
      JSON.stringify(updatedWishList)
    );
    setIsWished(!isWished);
    alert(isWished ? "찜하기가 해제되었습니다." : "찜했습니다!");
  }, [isLoggedIn, currentUserIdentifier, isWished, isbn, book]);

<<<<<<< HEAD
  // '내 서재에 추가' 버튼 클릭 핸들러 (모달 대신 폼 표시 토글)
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  const handleAddBookToShelf = useCallback(() => {
    if (!isLoggedIn || !currentUserIdentifier) {
      alert("로그인 후 내 서재에 책을 추가할 수 있습니다.");
      return;
    }
<<<<<<< HEAD
    // 폼 표시/숨김 토글
    setShowAddForm((prev) => !prev);
    // 폼이 숨겨질 때 상태 초기화 (선택 사항)
    if (showAddForm) {
      setBookStatus("");
      setReadStartDate("");
      setReadEndDate("");
      setReview("");
      setRating(0);
    }
  }, [isLoggedIn, currentUserIdentifier, showAddForm]);
=======
    setShowAddModal(true);
  }, [isLoggedIn, currentUserIdentifier]);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  const handleSaveBookStatus = useCallback(() => {
    if (!bookStatus) {
      alert("책 상태를 선택해주세요.");
      return;
    }
<<<<<<< HEAD
    if (bookStatus === "READ" && (!readStartDate || !readEndDate)) {
      alert("읽은 책은 시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (bookStatus === "READING" && !readStartDate) {
      alert("읽고 있는 책은 시작일을 선택해주세요.");
      return;
    }
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

    let storedBookStatuses = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_BOOK_STATUS_KEY) || "[]"
    );

    const existingIndex = storedBookStatuses.findIndex(
      (item) =>
        item.userIdentifier === currentUserIdentifier && item.isbn === isbn
    );

<<<<<<< HEAD
    // 여기서 libName을 가장 가까운 (또는 사용자가 선택할) 도서관 이름으로 설정합니다.
    // 현재는 nearestLibraries가 거리순으로 정렬되어 있으므로 첫 번째 도서관을 사용할 수 있습니다.
    const associatedLibName =
      nearestLibraries.length > 0 ? nearestLibraries[0].libName : "";

=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    const newBookData = {
      userIdentifier: currentUserIdentifier,
      isbn: isbn,
      status: bookStatus,
      addedDate: new Date().toISOString().split("T")[0],
      title: book.title,
      cover: book.cover,
      author: book.author,
      publisher: book.publisher,
<<<<<<< HEAD
      readStartDate: readStartDate,
      readEndDate: bookStatus === "READ" ? readEndDate : "", // '읽은 책'일 때만 종료일 저장
      review: review, // 후기 추가
      rating: rating, // 평점 추가
      libName: associatedLibName, // 수정된 부분
=======
      // ** 중요: '내 도서관' 기능을 정확히 구현하려면
      // 여기에 사용자가 이 책을 어떤 도서관에서 읽었는지(예: libCode 또는 libName)
      // 선택하여 저장하는 로직이 필요합니다.
      // 현재는 단순히 userBookStatuses에 책을 저장하는 것이므로,
      // '내 도서관' 우선순위 로직은 저장된 책의 'publisher'와 도서관 이름을 매칭하거나
      // 다른 방식으로 '내 도서관'을 정의해야 합니다.
      // 이 예시 코드에서는 'libName'을 사용한다고 가정했습니다.
      libName: "My Library Example", // 실제 사용자가 선택한 도서관 이름
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    };

    if (existingIndex > -1) {
      storedBookStatuses[existingIndex] = newBookData;
    } else {
      storedBookStatuses.push(newBookData);
    }

    localStorage.setItem(
      LOCAL_STORAGE_BOOK_STATUS_KEY,
      JSON.stringify(storedBookStatuses)
    );
<<<<<<< HEAD
    setShowAddForm(false); // 저장 후 폼 숨기기
=======
    setShowAddModal(false);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    alert(
      `'${book.title}'이(가) ${
        bookStatus === "READ" ? "다 읽은 책" : "읽고 있는 책"
      }으로 저장되었습니다.`
    );
    loadUserBookData();
<<<<<<< HEAD
  }, [
    bookStatus,
    currentUserIdentifier,
    isbn,
    book,
    loadUserBookData,
    readStartDate,
    readEndDate,
    review,
    rating,
    nearestLibraries,
  ]);

  // 별점 클릭 핸들러
  const handleRatingClick = (newRating) => {
    setRating(newRating);
  };
=======
  }, [bookStatus, currentUserIdentifier, isbn, book, loadUserBookData]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setBookStatus("");
  }, []);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  // 책 로딩 중 또는 에러 발생 시 UI
  if (bookLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">책 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">오류: {bookError}</p>
        <p className="text-muted">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  // 책 정보가 없으면
  if (!book) {
    return <p className="text-center py-5">책 정보를 찾을 수 없습니다.</p>;
  }

  const descriptionText = book.description
    ? book.description.replace(/<[^>]*>?/gm, "")
    : "책 소개가 없습니다.";
  const imageUrl = book.cover
    ? book.cover.replace(/cover(sum|\d+)/, "cover500")
    : "";

<<<<<<< HEAD
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜

=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  return (
    <Container
      className="mt-4"
      style={{ minWidth: "768px", overflowX: "hidden" }}
    >
      <Row className="mb-4 flex-column flex-md-row">
        <Col
          xs={12}
          md={3}
          className="text-center mb-3 mb-md-0 d-flex justify-content-center align-items-start"
        >
          <img
            src={imageUrl}
            alt={book.title}
            className="img-fluid rounded shadow-sm"
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </Col>
        <Col xs={12} md={9}>
          <h2
            className="fw-bold mb-2 text-ellipsis-single-line"
            style={{ wordBreak: "break-word" }}
          >
            {book.title}
          </h2>
          <p
            className="text-muted mb-1 text-ellipsis-single-line"
            style={{ wordBreak: "break-word" }}
          >
            {book.categoryName} {book.categoryName && `> `} 국내도서
          </p>
          <p
            className="text-muted mb-2 text-ellipsis-single-line"
            style={{ fontSize: "0.9rem", wordBreak: "break-word" }}
          >
            {book.author} (지은이) | {book.publisher} | 평균평점{" "}
            {book.customerReviewRank}
            {book.customerReviewRank > 0 && "점"}
          </p>
          <p
            className="mb-3"
            style={{
              fontSize: "0.95rem",
              lineHeight: "1.5",
              wordBreak: "break-word",
            }}
          >
            {descriptionText.length > 200
              ? descriptionText.substring(0, 200) + "..."
              : descriptionText}
            {descriptionText.length > 200 && (
              <a href="#full-description" className="ms-2">
                더보기
              </a>
            )}
          </p>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Button
              variant="outline-secondary"
              onClick={handleToggleWish}
              className="d-flex align-items-center gap-1"
            >
              {isWished ? <FaHeart color="red" /> : <FaRegHeart />} 찜하기
            </Button>
            <Button
              variant="warning"
              onClick={handleAddBookToShelf}
              className="d-flex align-items-center gap-1"
            >
              <FaPlus /> 내 서재에 추가
            </Button>
          </div>
<<<<<<< HEAD

          {/* 🔽 추가: '내 서재에 추가' 폼 (Collapse 사용) 🔽 */}
          <Collapse in={showAddForm}>
            <div
              className="mt-4 p-3 border rounded shadow-sm"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <h5 className="mb-3">내 서재에 추가하기</h5>
              <Form>
                <Form.Group className="mb-3">
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      variant={
                        bookStatus === "READ" ? "primary" : "outline-primary"
                      }
                      onClick={() => setBookStatus("READ")}
                      className="flex-fill"
                    >
                      <FaCalendarAlt className="me-1" /> 읽은 책
                    </Button>
                    <Button
                      variant={
                        bookStatus === "READING" ? "primary" : "outline-primary"
                      }
                      onClick={() => setBookStatus("READING")}
                      className="flex-fill"
                    >
                      <FaCalendarAlt className="me-1" /> 읽고 있는 책
                    </Button>
                  </div>
                </Form.Group>

                {bookStatus && ( // 책 상태가 선택되었을 때만 날짜 선택 필드 표시
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">독서 기간</h6>
                    <Form.Group className="mb-2">
                      <Form.Label srOnly>시작일</Form.Label>
                      <div className="d-flex align-items-center">
                        <span className="me-2 text-muted">시작일</span>
                        <Form.Control
                          type="date"
                          value={readStartDate}
                          onChange={(e) => setReadStartDate(e.target.value)}
                          max={today} // 오늘 날짜 이후 선택 불가
                        />
                      </div>
                    </Form.Group>
                    {bookStatus === "READ" && ( // '읽은 책'일 때만 종료일 표시
                      <Form.Group className="mb-2">
                        <Form.Label srOnly>종료일</Form.Label>
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-muted">종료일</span>
                          <Form.Control
                            type="date"
                            value={readEndDate}
                            onChange={(e) => setReadEndDate(e.target.value)}
                            min={readStartDate} // 시작일 이전 선택 불가
                            max={today} // 오늘 날짜 이후 선택 불가
                            disabled={!readStartDate} // 시작일이 선택되어야 활성화
                          />
                        </div>
                      </Form.Group>
                    )}
                  </div>
                )}

                {bookStatus === "READ" && ( // '읽은 책'일 때만 후기와 평점 표시
                  <>
                    <Form.Group className="mb-3">
                      <h6 className="fw-bold mb-2">후기</h6>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="이 책에 대한 후기를 작성해주세요."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <h6 className="fw-bold mb-2">나의 평점은?</h6>
                      <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              cursor: "pointer",
                              fontSize: "2rem",
                              color: star <= rating ? "#ffc107" : "#e4e5e9",
                            }}
                            onClick={() => handleRatingClick(star)}
                          >
                            &#9733; {/* 별 유니코드 문자 */}
                          </span>
                        ))}
                      </div>
                    </Form.Group>
                  </>
                )}

                <Button
                  variant="primary"
                  onClick={handleSaveBookStatus}
                  disabled={
                    !bookStatus ||
                    (bookStatus === "READ" &&
                      (!readStartDate || !readEndDate)) ||
                    (bookStatus === "READING" && !readStartDate)
                  }
                  className="w-100 mt-3"
                >
                  내 서재에 저장
                </Button>
              </Form>
            </div>
          </Collapse>
          {/* 🔼 추가: '내 서재에 추가' 폼 (Collapse 사용) 🔼 */}
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        </Col>
      </Row>

      <hr />

      {/* 가까운 도서관 목록 표시 섹션 */}
      <Row className="my-4">
        <Col>
          <h4 className="fw-bold mb-3">
            <FaMapMarkerAlt className="me-2" />이 책을 소장한 내 주변 도서관
          </h4>
          {locationLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">도서 소장 도서관을 찾는 중...</p>
            </div>
          ) : locationError ? (
            <div className="text-center py-4">
              <p className="text-danger">오류: {locationError}</p>
              <p className="text-muted">
                위치 정보 제공을 허용하거나, 해당 도서의 ISBN13 정보를
                확인해주세요.
              </p>
            </div>
          ) : nearestLibraries.length > 0 ? (
            <>
              <ListGroup>
<<<<<<< HEAD
                {currentLibraries.map((lib) => (
                  <ListGroup.Item
                    key={lib.libCode}
                    className={`d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 p-3 rounded shadow-sm`}
                    // ⬆️⬆️⬆️ 여기 `lib.isPreferred ? "border-primary border-3" : ""` 부분을 제거했습니다.
                  >
                    <div className="flex-grow-1 me-md-3 mb-2 mb-md-0">
                      <h6 className="mb-1 d-flex align-items-center">
                        {lib.isPreferred && (
                          <span className="badge bg-primary me-2">
                            내 도서관
                          </span>
                        )}
                        {lib.libName}
                        {/* 대출 가능 여부 표시 */}
                        {lib.isLoanAvailable === undefined ? (
                          <span className="badge bg-secondary ms-2">
                            확인 중...
                          </span>
                        ) : lib.isLoanAvailable ? (
                          <span className="badge bg-success ms-2">
                            대출 가능
                          </span>
                        ) : (
                          <span className="badge bg-danger ms-2">
                            대출 불가
                          </span>
                        )}
                      </h6>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {lib.address}
                      </p>
                      <small className="text-info">
                        거리: {lib.distance.toFixed(2)} km
                      </small>
                    </div>
                    <div className="d-flex flex-row flex-md-column justify-content-end align-items-end gap-2">
                      {" "}
                      {/* gap-2 추가 */}
                      {lib.homepage && ( // 홈페이지 주소가 있을 때만 버튼 표시
                        <Button
                          variant="outline-info" // 홈페이지 버튼 색상
                          size="sm"
                          onClick={() => window.open(lib.homepage, "_blank")}
                        >
                          <FaGlobe className="me-1" /> 홈페이지
                        </Button>
                      )}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="mt-md-2"
                        onClick={() =>
                          window.open(
                            `https://map.kakao.com/link/map/${lib.libName},${lib.latitude},${lib.longitude}`,
                            "_blank"
                          )
                        }
                      >
                        <FaMapMarkerAlt className="me-1" />길 찾기
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
=======
                {currentLibraries.map(
                  (
                    lib // currentLibraries 사용
                  ) => (
                    <ListGroup.Item
                      key={lib.libCode}
                      className={`d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 p-3 rounded shadow-sm ${
                        lib.isPreferred ? "border-primary border-3" : ""
                      }`}
                    >
                      <div className="flex-grow-1 me-md-3 mb-2 mb-md-0">
                        <h6 className="mb-1 d-flex align-items-center">
                          {lib.isPreferred && (
                            <span className="badge bg-primary me-2">
                              내 도서관
                            </span>
                          )}
                          {lib.libName}
                          {/* 대출 가능 여부 표시 */}
                          {lib.isLoanAvailable === undefined ? (
                            <span className="badge bg-secondary ms-2">
                              확인 중...
                            </span>
                          ) : lib.isLoanAvailable ? (
                            <span className="badge bg-success ms-2">
                              대출 가능
                            </span>
                          ) : (
                            <span className="badge bg-danger ms-2">
                              대출 불가
                            </span>
                          )}
                        </h6>
                        <p
                          className="mb-1 text-muted"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {lib.address}
                        </p>
                        <small className="text-info">
                          거리: {lib.distance.toFixed(2)} km
                        </small>
                      </div>
                      <div className="d-flex flex-row flex-md-column justify-content-end align-items-end">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="mt-md-2"
                          onClick={() =>
                            window.open(
                              `https://map.kakao.com/link/map/${lib.libName},${lib.latitude},${lib.longitude}`,
                              "_blank"
                            )
                          }
                        >
                          <FaMapMarkerAlt className="me-1" />길 찾기
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )
                )}
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
              </ListGroup>

              {/* 페이지네이션 컨트롤 */}
              {totalPageCount > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    이전 페이지
                  </Button>
                  <span className="align-self-center">
                    {currentPage} / {totalPageCount}
                  </span>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPageCount, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPageCount}
                    className="ms-2"
                  >
                    다음 페이지
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                이 책을 소장한 주변 도서관을 찾을 수 없습니다.
              </p>
              <p className="text-muted">
                다른 지역 도서관을 확인해보거나, 위치 정보 제공을 허용해주세요.
              </p>
            </div>
          )}
        </Col>
      </Row>
<<<<<<< HEAD
=======

      <Modal show={showAddModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>이 책을 어떤 상태로 내 서재에 추가하시겠습니까?</p>
          <Form.Group>
            <Form.Check
              type="radio"
              id="readBook"
              label="다 읽은 책"
              name="bookStatusRadio"
              value="READ"
              checked={bookStatus === "READ"}
              onChange={(e) => setBookStatus(e.target.value)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id="readingBook"
              label="읽고 있는 책"
              name="bookStatusRadio"
              value="READING"
              checked={bookStatus === "READING"}
              onChange={(e) => setBookStatus(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveBookStatus}
            disabled={!bookStatus}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    </Container>
  );
};

export default BookDetail;
