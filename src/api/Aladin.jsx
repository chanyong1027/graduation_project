const TTB_KEY = "ttbghdcksdyd1230357001"; // 여기에 발급받은 TTB Key를 입력하세요!

export const getBestsellers = async () => {
  try {
    const response = await fetch(
      `/aladin/ttb/api/ItemList.aspx?ttbkey=${TTB_KEY}&QueryType=Bestseller&MaxResults=15&start=1&SearchTarget=Book&Output=JS&Version=20131101`
    );
    const data = await response.json(); // JSON 파싱

    if (data.item) {
      return data.item; // 책 목록 배열 반환
    } else {
      console.error("Aladin API에서 책 정보를 찾을 수 없습니다:", data);
      return []; // 빈 배열 반환
    }
  } catch (error) {
    console.error("베스트셀러 데이터를 가져오는 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};

export const getNewReleases = async () => {
  const response = await fetch(
    `/aladin/ttb/api/ItemList.aspx?ttbkey=${TTB_KEY}&QueryType=ItemNewSpecial&MaxResults=12&start=1&SearchTarget=Book&Output=JS&Version=20131101`
  );
  const data = await response.json();
  return data.item || [];
};

export const searchBooks = async (query, totalCount = 500) => {
  const maxPerPage = 50;
  const callsNeeded = Math.ceil(totalCount / maxPerPage);
  let allBooks = [];
  const seen = new Set();

  for (let i = 0; i < callsNeeded; i++) {
    const start = i + 1; // ✅ 페이지 번호 (1부터 시작)

    const response = await fetch(
      `/aladin/ttb/api/ItemSearch.aspx?ttbkey=${TTB_KEY}&Query=${encodeURIComponent(
        query
      )}&QueryType=Keyword&MaxResults=${maxPerPage}&start=${start}&SearchTarget=Book&Output=JS&Version=20131101`
    );
    const data = await response.json();

    if (data.item?.length) {
      for (const book of data.item) {
        if (!seen.has(book.isbn)) {
          seen.add(book.isbn);
          allBooks.push(book);
        }
      }
    } else {
      break; // 더 이상 결과가 없으면 중단
    }
  }

  return allBooks;
};
