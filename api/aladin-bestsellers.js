// api/aladin-bestsellers.js
import fetch from "node-fetch";

export default async function (req, res) {
  const TTB_KEY = process.env.ALADIN_TTB_KEY; // Vercel 환경 변수
  const { categoryId = "0", queryType = "Bestseller" } = req.query; // 베스트셀러 기본값

  if (!TTB_KEY) {
    return res.status(500).json({ error: "ALADIN_TTB_KEY is not set." });
  }

  try {
    const aladinUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${TTB_KEY}&QueryType=${queryType}&MaxResults=20&start=1&SearchTarget=Book&output=js&Version=20131101&CategoryId=${categoryId}`;
    const aladinRes = await fetch(aladinUrl);
    const data = await aladinRes.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type, Accept"
    );

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    res.status(aladinRes.status).json(data);
  } catch (error) {
    console.error("Aladin Bestsellers API proxy error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch bestsellers from Aladin API." });
  }
}
