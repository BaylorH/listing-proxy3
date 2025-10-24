export default async function handler(req, res) {
  const { endpoint, body } = req.query;

  if (!endpoint)
    return res.status(400).json({ error: "Missing endpoint parameter" });

  // Parse body if provided as encoded JSON in the query
  let parsedBody = {};
  try {
    parsedBody =
      typeof body === "string"
        ? JSON.parse(decodeURIComponent(body))
        : {};
  } catch {
    parsedBody = {};
  }

  const targetUrl = `https://listing-collector3.vercel.app/${endpoint}`;

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: endpoint === "data" ? JSON.stringify(parsedBody) : null
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
