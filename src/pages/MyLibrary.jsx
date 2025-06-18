import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  Tabs,
  Tab,
  ListGroup,
} from "react-bootstrap";
import REGION_DATA from "../data/RegionData";
import { useAuth } from "../contexts/AuthContext";

const API_KEY =
  "ad79e8a862abd18051e4d11cc8cd80446c48d9273cd1f9b332292508d9422682";

<<<<<<< HEAD
// 새로운 localStorage 키: 사용자별 선호 도서관 목록
const LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX = "userPreferredLibraries_";

=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
const MyLibrary = () => {
  const { user, isLoggedIn } = useAuth();
  const currentUserIdentifier = user?.email || null;

  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [libraryList, setLibraryList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

<<<<<<< HEAD
  // myLibraries는 이제 currentUserIdentifier에 해당하는 도서관만 관리
  const [myLibraries, setMyLibraries] = useState([]);
  const [activeTab, setActiveTab] = useState("myLibraries");

  // 현재 로그인된 사용자의 선호 도서관 목록을 불러오는 함수
  const loadMyLibraries = useCallback(() => {
    if (!currentUserIdentifier) {
      setMyLibraries([]);
      return;
    }
    try {
      const storedUserLibs = localStorage.getItem(
        LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX + currentUserIdentifier
      );
      if (storedUserLibs) {
        setMyLibraries(JSON.parse(storedUserLibs));
      } else {
        setMyLibraries([]);
      }
    } catch (e) {
      console.error(
        "Failed to parse userPreferredLibraries from localStorage",
        e
      );
      localStorage.removeItem(
        LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX + currentUserIdentifier
      );
      setMyLibraries([]);
    }
  }, [currentUserIdentifier]);

  useEffect(() => {
    loadMyLibraries(); // 컴포넌트 마운트 시 또는 사용자 변경 시 내 도서관 불러오기
=======
  const [myLibraries, setMyLibraries] = useState([]);
  const [activeTab, setActiveTab] = useState("myLibraries");

  useEffect(() => {
    const storedLibraries = localStorage.getItem("allUserLibraries");
    if (storedLibraries) {
      try {
        setMyLibraries(JSON.parse(storedLibraries));
      } catch (e) {
        console.error("Failed to parse allUserLibraries from localStorage", e);
        localStorage.removeItem("allUserLibraries");
      }
    }
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

    const resetSignal = localStorage.getItem("myLibraryReset");
    if (resetSignal === "true") {
      setRegion("");
      setSubRegion("");
      setLibraryList([]);
      setSearching(false);
      setHasSearched(false);
      setActiveTab("myLibraries");
      localStorage.removeItem("myLibraryReset");
    }
<<<<<<< HEAD
  }, [loadMyLibraries]);

  // myLibraries 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (currentUserIdentifier) {
      localStorage.setItem(
        LOCAL_STORAGE_PREFERRED_LIBRARIES_KEY_PREFIX + currentUserIdentifier,
        JSON.stringify(myLibraries)
      );
    }
  }, [myLibraries, currentUserIdentifier]);

  // activeTab 상태를 localStorage에 저장하여 새로고침 시 유지
=======
  }, []);

  useEffect(() => {
    localStorage.setItem("allUserLibraries", JSON.stringify(myLibraries));
  }, [myLibraries]);

>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  useEffect(() => {
    localStorage.setItem("myLibraryActiveTab", activeTab);
  }, [activeTab]);

<<<<<<< HEAD
  // 컴포넌트 마운트 시 localStorage에서 저장된 activeTab 불러오기
=======
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  useEffect(() => {
    const storedTab = localStorage.getItem("myLibraryActiveTab");
    if (storedTab && storedTab !== activeTab) {
      setActiveTab(storedTab);
    }
  }, [activeTab]);

  const availableRegions = Object.keys(REGION_DATA).sort();
  const availableSubRegions = region
    ? ["전체", ...Object.keys(REGION_DATA[region]?.subRegions || {}).sort()]
    : [];

  const handleSearch = useCallback(async () => {
    if (!region) return;

    setSearching(true);
    setLibraryList([]);
    setHasSearched(true);

    const regionCode = REGION_DATA[region].code;
    let dtlRegionCodesToFetch = [];

    if (!subRegion || subRegion === "전체") {
      const allSubRegionsInSelectedCity = REGION_DATA[region].subRegions || {};
      dtlRegionCodesToFetch = Object.values(allSubRegionsInSelectedCity);

      if (dtlRegionCodesToFetch.length === 0) {
        console.warn(
          `선택된 지역 ${region}에 대한 세부지역 코드가 REGION_DATA에 없습니다.`
        );
        setSearching(false);
        return;
      }
    } else {
      const dtlRegionCode = REGION_DATA[region].subRegions[subRegion];
      if (dtlRegionCode) {
        dtlRegionCodesToFetch.push(dtlRegionCode);
      } else {
        console.error(
          `선택된 세부지역 ${subRegion}에 대한 코드를 찾을 수 없습니다.`
        );
        setSearching(false);
        return;
      }
    }

    let allResults = [];
<<<<<<< HEAD
    const pageSize = 100; // API 호출 시 한 페이지에 가져올 도서관 수
=======
    const pageSize = 100;
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

    try {
      for (const dtlRegionCode of dtlRegionCodesToFetch) {
        let page = 1;
        while (true) {
          try {
            const res = await fetch(
              `https://data4library.kr/api/libSrch?authKey=${API_KEY}&format=json&region=${regionCode}&dtl_region=${dtlRegionCode}&pageNo=${page}&pageSize=${pageSize}`
            );
            const data = await res.json();
            const libs = data.response?.libs || [];

<<<<<<< HEAD
            if (libs.length === 0) break; // 더 이상 데이터가 없으면 루프 종료
            allResults = allResults.concat(libs);
            page++;

            const totalCount = data.response?.numFound; // 전체 검색결과 건수
            // 현재까지 가져온 도서관 수가 전체 개수와 같거나 많으면 루프 종료
            if (totalCount && allResults.length >= totalCount) break;

            // 무한 루프 방지: API 호출 제한 또는 효율성 고려하여 최대 페이지 제한 설정
            if (page > 50) break; // 예를 들어 최대 50페이지까지만 가져오도록 제한
=======
            if (libs.length === 0) break;
            allResults = allResults.concat(libs);
            page++;

            const totalCount = data.response?.numFound;
            if (allResults.length >= totalCount) break;
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
          } catch (fetchError) {
            console.error(
              `API 호출 실패 (지역: ${region}, 세부지역 코드: ${dtlRegionCode}, 페이지: ${page}):`,
              fetchError
            );
<<<<<<< HEAD
            break; // 오류 발생 시 현재 세부지역 검색 중단
=======
            break;
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
          }
        }
      }
      setLibraryList(allResults);
    } catch (overallError) {
      console.error("도서관 검색 중 치명적인 오류 발생:", overallError);
    } finally {
      setSearching(false);
    }
  }, [region, subRegion]);

  const handleAddLibrary = useCallback(
    (libToAdd) => {
      if (!isLoggedIn || !currentUserIdentifier) {
        alert("로그인 후 도서관을 추가할 수 있습니다.");
        return;
      }

<<<<<<< HEAD
      // 현재 사용자의 myLibraries에서 중복 확인 (lib.lib.libCode로 비교)
      if (myLibraries.some((lib) => lib.lib.libCode === libToAdd.lib.libCode)) {
=======
      if (
        myLibraries.some(
          (lib) =>
            lib.lib.libCode === libToAdd.lib.libCode &&
            lib.userIdentifier === currentUserIdentifier
        )
      ) {
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        alert(`'${libToAdd.lib.libName}'은 이미 내 도서관에 있습니다.`);
        return;
      }

<<<<<<< HEAD
      // myLibraries 상태에 추가 (libToAdd는 이미 lib 객체를 포함하고 있음)
      setMyLibraries((prev) => [...prev, libToAdd]);
      alert(`'${libToAdd.lib.libName}'을 내 도서관에 추가했습니다!`);
      setActiveTab("myLibraries"); // 추가 후 '내 도서관' 탭으로 이동
=======
      const libWithUserIdentifier = {
        ...libToAdd,
        userIdentifier: currentUserIdentifier,
      };
      setMyLibraries((prev) => [...prev, libWithUserIdentifier]);
      alert(`'${libToAdd.lib.libName}'을 내 도서관에 추가했습니다!`);
      setActiveTab("myLibraries");
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    },
    [myLibraries, isLoggedIn, currentUserIdentifier]
  );

  const handleRemoveLibrary = useCallback(
    (libCodeToRemove) => {
      if (!isLoggedIn || !currentUserIdentifier) {
        alert("로그인 후 도서관을 삭제할 수 있습니다.");
        return;
      }

      if (window.confirm("정말 삭제하시겠습니까?")) {
<<<<<<< HEAD
        // lib.lib.libCode로 필터링 (myLibraries는 이미 현재 사용자 것만 포함)
        setMyLibraries((prev) =>
          prev.filter((lib) => lib.lib.libCode !== libCodeToRemove)
=======
        setMyLibraries((prev) =>
          prev.filter(
            (lib) =>
              !(
                lib.lib.libCode === libCodeToRemove &&
                lib.userIdentifier === currentUserIdentifier
              )
          )
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
        );
        alert("도서관이 삭제되었습니다.");
      }
    },
    [isLoggedIn, currentUserIdentifier]
  );

<<<<<<< HEAD
  // Tabs 컴포넌트의 onSelect prop에 사용될 함수
  const handleTabSelect = useCallback((k) => {
    setActiveTab(k);
    // '도서관 검색' 탭으로 이동 시 검색 관련 상태 초기화
=======
  // **** 누락된 handleTabSelect 함수 추가 ****
  const handleTabSelect = useCallback((k) => {
    setActiveTab(k);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
    if (k === "search") {
      setRegion("");
      setSubRegion("");
      setLibraryList([]);
      setHasSearched(false);
      setSearching(false);
    }
  }, []);
<<<<<<< HEAD

  // myLibraries 상태는 이미 loadMyLibraries에서 currentUserIdentifier 기준으로 필터링되므로
  // 별도의 filteredMyLibraries 변수는 필요 없습니다. myLibraries를 직접 사용합니다.
=======
  // *****************************************

  const filteredMyLibraries = myLibraries.filter(
    (lib) => lib.userIdentifier === currentUserIdentifier
  );
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📚 내 도서관 관리</h3>

      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="myLibraries" title="내 도서관">
          <h5 className="mt-4">내 도서관 목록</h5>
          {isLoggedIn ? (
<<<<<<< HEAD
            myLibraries.length > 0 ? ( // myLibraries를 직접 사용
              <ListGroup>
                {myLibraries.map((libObj) => (
=======
            filteredMyLibraries.length > 0 ? (
              <ListGroup>
                {filteredMyLibraries.map((libObj) => (
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
                  <ListGroup.Item
                    key={libObj.lib.libCode}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6>{libObj.lib.libName}</h6>
                      <p className="mb-1 text-muted">{libObj.lib.address}</p>
                      <small>전화: {libObj.lib.tel}</small>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveLibrary(libObj.lib.libCode)}
                    >
                      삭제
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted">
                추가된 도서관이 없습니다. '도서관 검색' 탭에서 도서관을 찾아
                추가해보세요!
              </p>
            )
          ) : (
            <p className="text-muted">
              내 도서관 목록을 보려면 로그인해주세요.
            </p>
          )}
        </Tab>

        <Tab eventKey="search" title="도서관 검색">
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setSubRegion("");
                    setLibraryList([]);
                    setHasSearched(false);
                  }}
                >
                  <option value="">시/도 선택</option>
                  {availableRegions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={4}>
                <Form.Select
                  value={subRegion}
                  onChange={(e) => {
                    setSubRegion(e.target.value);
                    setLibraryList([]);
                    setHasSearched(false);
                  }}
                  disabled={!region}
                >
                  <option value="">구/군 선택</option>
                  {availableSubRegions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={4}>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={
                    !region ||
                    (!subRegion && availableSubRegions.length > 1) ||
                    searching
                  }
                >
                  {searching ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      도서관 검색 중...
                    </>
                  ) : (
                    "도서관 검색"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {searching ? (
            <div className="text-center mt-4">
              <Spinner animation="border" />
              <p className="mt-2">도서관을 검색 중입니다...</p>
            </div>
          ) : libraryList.length > 0 ? (
            <>
              <h5 className="mt-4">📍 검색 결과</h5>
              {libraryList.map((libObj) => (
                <Card key={libObj.lib.libCode} className="my-2">
                  <Card.Body>
                    <Card.Title text-ellipsis-single-line>
                      {libObj.lib.libName}
                    </Card.Title>
                    <Card.Text text-ellipsis-single-line>
                      {libObj.lib.address}
                    </Card.Text>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleAddLibrary(libObj)}
                    >
                      추가
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </>
          ) : (
            hasSearched &&
            !searching &&
            libraryList.length === 0 && (
              <p className="mt-4 text-muted">해당 지역의 도서관이 없습니다.</p>
            )
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyLibrary;
