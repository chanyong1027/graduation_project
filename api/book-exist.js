// api/book-exist.js
import fetch from "node-fetch";

export default async function (req, res) {
  const { libCode, isbn13 } = req.query; // 클라이언트로부터 받은 쿼리 파라미터
  const API_KEY_LIB = process.env.DATA4LIBRARY_API_KEY; // Vercel 환경 변수에서 API 키 로드

  if (!libCode || !isbn13 || !API_KEY_LIB) {
    return res.status(400).json({
      error:
        "Required parameters (libCode, isbn13) or DATA4LIBRARY_API_KEY are missing.",
    });
  }

  try {
    const url = `https://data4library.kr/api/bookExist?authKey=${API_KEY_LIB}&libCode=${libCode}&isbn13=${isbn13}&format=json`;

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
    console.error("bookExist API proxy error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch from data4library bookExist API." });
  }
}
