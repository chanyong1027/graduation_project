// api/lib-srch.js
import fetch from "node-fetch";

export default async function (req, res) {
  const { pageNo, pageSize, region, dtl_region } = req.query; // 클라이언트로부터 받은 쿼리 파라미터
  const API_KEY_LIB = process.env.DATA4LIBRARY_API_KEY; // Vercel 환경 변수에서 API 키 로드

  if (!API_KEY_LIB) {
    return res.status(500).json({ error: "DATA4LIBRARY_API_KEY is not set." });
  }

  try {
    let url = `https://data4library.kr/api/libSrch?authKey=${API_KEY_LIB}&format=json`;
    if (pageNo) url += `&pageNo=${pageNo}`;
    if (pageSize) url += `&pageSize=${pageSize}`;
    if (region) url += `&region=${region}`; // 시도 코드
    if (dtl_region) url += `&dtl_region=${dtl_region}`; // 구군 코드

    const libRes = await fetch(url);
    const data = await libRes.json();

    // CORS 헤더 설정
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    res.status(libRes.status).json(data);
  } catch (error) {
    console.error("libSrch API proxy error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch from data4library libSrch API." });
  }
}
