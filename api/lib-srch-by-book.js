// api/lib-srch-by-book.js
import fetch from "node-fetch";

export default async function (req, res) {
  const { isbn, region, pageNo, pageSize } = req.query; // 클라이언트로부터 받은 쿼리 파라미터
  const API_KEY_LIB = process.env.DATA4LIBRARY_API_KEY; // Vercel 환경 변수에서 API 키 로드

  if (!isbn || !region || !API_KEY_LIB) {
    return res.status(400).json({
      error:
        "Required parameters (isbn, region) or DATA4LIBRARY_API_KEY are missing.",
    });
  }

  try {
    const url = `https://data4library.kr/api/libSrchByBook?authKey=${API_KEY_LIB}&isbn=${isbn}&region=${region}&pageNo=${
      pageNo || 1
    }&pageSize=${pageSize || 100}&format=json`;

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
    console.error("libSrchByBook API proxy error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch from data4library libSrchByBook API." });
  }
}
