// api/kakao-coord-to-region.js
import fetch from "node-fetch"; // Node.js 18+ 환경에서는 이 줄 제거 가능

export default async function (req, res) {
  const { x, y } = req.query; // 클라이언트로부터 받은 쿼리 파라미터 (경도, 위도)
  const KAKAO_API_KEY = process.env.KAKAO_API_KEY; // Vercel 환경 변수에서 API 키 로드

  // 필수 파라미터 및 API 키 누락 검사
  if (!x || !y) {
    return res
      .status(400)
      .json({ error: "Required parameters (x, y) are missing." });
  }
  if (!KAKAO_API_KEY) {
    return res
      .status(500)
      .json({
        error: "KAKAO_API_KEY is not set in Vercel Environment Variables.",
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
    const kakaoUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`;
    const kakaoRes = await fetch(kakaoUrl, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`, // 카카오 API는 Authorization 헤더에 키를 요구
      },
    });

    // 응답이 성공적인지 먼저 확인
    if (!kakaoRes.ok) {
      const errorText = await kakaoRes.text();
      console.error(
        `Kakao API returned non-OK status (${kakaoRes.status}): ${errorText}`
      );
      return res.status(kakaoRes.status).json({
        error: `Failed to fetch from Kakao API (Status: ${kakaoRes.status})`,
        details:
          errorText.substring(0, 200) + (errorText.length > 200 ? "..." : ""),
      });
    }

    const data = await kakaoRes.json();

    // CORS 헤더 설정
    res.setHeader("Access-Control-Allow-Origin", "*"); // 실제 배포 시 클라이언트 도메인으로 제한 권장
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );

    res.status(200).json(data); // 성공적인 JSON 응답 반환
  } catch (error) {
    console.error("Kakao coord-to-region proxy error:", error);
    res
      .status(500)
      .json({
        error: "An internal server error occurred while proxying Kakao API.",
        details: error.message,
      });
  }
}
