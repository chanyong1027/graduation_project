import fetch from "node-fetch";

export default async function (req, res) {
  const TTB_KEY = process.env.ALADIN_TTB_KEY;
  const { categoryId = "0", queryType = "ItemNewAll" } = req.query;

  if (!TTB_KEY) {
    return res.status(500).json({ error: "ALADIN_TTB_KEY is not set." });
  }

  try {
    const aladinUrl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${TTB_KEY}&QueryType=${queryType}&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101&CategoryId=${categoryId}`;
    const aladinRes = await fetch(aladinUrl);
    const text = await aladinRes.text();

    // 디버깅용 출력
    console.log("Aladin raw response (first 300 chars):", text.slice(0, 300));

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(502).json({
        error: "Aladin API did not return valid JSON",
        raw: text.slice(0, 300),
      });
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    res
      .status(500)
      .json({ error: "Internal server error while fetching Aladin API" });
  }
}
