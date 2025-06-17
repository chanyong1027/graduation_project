// api/aladin-lookup.js
import fetch from "node-fetch"; // Vercel Node.js 환경에서 fetch를 사용하기 위해 필요 (ExpressJS 등을 사용하면 불필요)

export default async function (req, res) {
  const { itemId, itemIdType } = req.query; // 클라이언트로부터 받은 쿼리 파라미터
  const TTB_KEY = process.env.ALADIN_TTB_KEY; // Vercel 환경 변수에서 API 키 로드

  if (!itemId || !itemIdType || !TTB_KEY) {
    return res
      .status(400)
      .json({
        error:
          "Required parameters (itemId, itemIdType) or ALADIN_TTB_KEY are missing.",
      });
  }

  try {
    const aladinUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${TTB_KEY}&itemIdType=${itemIdType}&ItemId=${itemId}&output=js&Version=20131101`;
    const aladinRes = await fetch(aladinUrl);
    const data = await aladinRes.json();

    // CORS 헤더 설정 (모든 도메인 허용 예시, 실제 배포 시 특정 도메인으로 제한 권장)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );

    if (req.method === "OPTIONS") {
      // Preflight request 처리
      return res.status(200).end();
    }

    res.status(aladinRes.status).json(data);
  } catch (error) {
    console.error("Aladin API proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from Aladin API." });
  }
}
