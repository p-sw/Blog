export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({message: "Method Not Allowed"});
  }

  let query = req.query.query;

  let result = await fetch(`http://127.0.0.1:8000/api/tag/search-by-name?query=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  let data = await result.json();

  res.status(result.status).json(data);
}