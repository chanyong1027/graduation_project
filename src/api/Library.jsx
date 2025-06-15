const API_KEY =
  "ad79e8a862abd18051e4d11cc8cd80446c48d9273cd1f9b332292508d9422682";

export const searchLibraries = async (libName = "") => {
  const response = await fetch(
    `https://data4library.kr/api/libSrch?authKey=${API_KEY}&libName=${encodeURIComponent(
      libName
    )}&format=json`
  );
  const data = await response.json();
  return data.response?.libs || [];
};

export const extractRegionsFromLibraries = async () => {
  const data = await searchLibraries(""); // 전체 검색
  const addressList = data.map((lib) => lib.lib.address);

  const cityMap = {}; // { "서울특별시": Set(["강남구", ...]) }

  addressList.forEach((addr) => {
    const [city, district] = addr.split(" ");
    if (city && district) {
      if (!cityMap[city]) cityMap[city] = new Set();
      cityMap[city].add(district);
    }
  });

  // 변환
  const result = {};
  for (const [city, districtSet] of Object.entries(cityMap)) {
    result[city] = [...districtSet];
  }

  return result;
};
