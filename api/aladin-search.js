// api/aladin-search.js
import fetch from "node-fetch"; // Node.js 18+ 환경에서는 이 줄 제거 가능

export default async function (req, res) {
  const TTB_KEY = process.env.ALADIN_TTB_KEY; // Vercel 환경 변수에서 API 키 로드
  const {
    query,
    queryType = "Keyword",
    MaxResults = "50",
    start = "1",
  } = req.query; // 클라이언트로부터 받은 쿼리 파라미터

  // 필수 파라미터 및 API 키 누락 검사
  if (!query) {
    return res
      .status(400)
      .json({ error: "Required parameter 'query' is missing." });
  }
  if (!TTB_KEY) {
    return res.status(500).json({
      error: "ALADIN_TTB_KEY is not set in Vercel Environment Variables.",
    });
  }

  // Preflight OPTIONS 요청 처리 (CORS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 실제 배포 시 클라이언트 도메인으로 제한 권장
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );
    return res.status(200).end();
  }

  try {
    const aladinUrl = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${TTB_KEY}&Query=${encodeURIComponent(
      query
    )}&QueryType=${queryType}&MaxResults=${MaxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
    const aladinRes = await fetch(aladinUrl);

    // 응답이 성공적인지 먼저 확인
    if (!aladinRes.ok) {
      const errorText = await aladinRes.text();
      console.error(
        `Aladin Search API returned non-OK status (${aladinRes.status}): ${errorText}`
      );
      return res.status(aladinRes.status).json({
        error: `Failed to fetch from Aladin Search API (Status: ${aladinRes.status})`,
        details:
          errorText.substring(0, 200) + (errorText.length > 200 ? "..." : ""),
      });
    }

    const data = await aladinRes.json();

    // CORS 헤더 설정
    res.setHeader("Access-Control-Allow-Origin", "*"); // 실제 배포 시 클라이언트 도메인으로 제한 권장
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );

    res.status(200).json(data); // 성공적인 JSON 응답 반환
  } catch (error) {
    console.error("Aladin Search proxy error:", error);
    res.status(500).json({
      error:
        "An internal server error occurred while proxying Aladin Search API.",
      details: error.message,
    });
  }
}
