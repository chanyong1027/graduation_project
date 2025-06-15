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

const MyLibrary = () => {
  const { user, isLoggedIn } = useAuth();
  const currentUserIdentifier = user?.email || null;

  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [libraryList, setLibraryList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
  }, []);

  useEffect(() => {
    localStorage.setItem("allUserLibraries", JSON.stringify(myLibraries));
  }, [myLibraries]);

  useEffect(() => {
    localStorage.setItem("myLibraryActiveTab", activeTab);
  }, [activeTab]);

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
    const pageSize = 100;

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

            if (libs.length === 0) break;
            allResults = allResults.concat(libs);
            page++;

            const totalCount = data.response?.numFound;
            if (allResults.length >= totalCount) break;
          } catch (fetchError) {
            console.error(
              `API 호출 실패 (지역: ${region}, 세부지역 코드: ${dtlRegionCode}, 페이지: ${page}):`,
              fetchError
            );
            break;
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

      if (
        myLibraries.some(
          (lib) =>
            lib.lib.libCode === libToAdd.lib.libCode &&
            lib.userIdentifier === currentUserIdentifier
        )
      ) {
        alert(`'${libToAdd.lib.libName}'은 이미 내 도서관에 있습니다.`);
        return;
      }

      const libWithUserIdentifier = {
        ...libToAdd,
        userIdentifier: currentUserIdentifier,
      };
      setMyLibraries((prev) => [...prev, libWithUserIdentifier]);
      alert(`'${libToAdd.lib.libName}'을 내 도서관에 추가했습니다!`);
      setActiveTab("myLibraries");
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
        setMyLibraries((prev) =>
          prev.filter(
            (lib) =>
              !(
                lib.lib.libCode === libCodeToRemove &&
                lib.userIdentifier === currentUserIdentifier
              )
          )
        );
        alert("도서관이 삭제되었습니다.");
      }
    },
    [isLoggedIn, currentUserIdentifier]
  );

  // **** 누락된 handleTabSelect 함수 추가 ****
  const handleTabSelect = useCallback((k) => {
    setActiveTab(k);
    if (k === "search") {
      setRegion("");
      setSubRegion("");
      setLibraryList([]);
      setHasSearched(false);
      setSearching(false);
    }
  }, []);
  // *****************************************

  const filteredMyLibraries = myLibraries.filter(
    (lib) => lib.userIdentifier === currentUserIdentifier
  );

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📚 내 도서관 관리</h3>

      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="myLibraries" title="내 도서관">
          <h5 className="mt-4">내 도서관 목록</h5>
          {isLoggedIn ? (
            filteredMyLibraries.length > 0 ? (
              <ListGroup>
                {filteredMyLibraries.map((libObj) => (
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
