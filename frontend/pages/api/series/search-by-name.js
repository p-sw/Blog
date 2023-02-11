export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({message: "Method Not Allowed"});
  }
  if (req.headers.token === undefined) {
    return res.status(401).json({message: "Unauthorized"});
  }

  let token = req.headers.token;
  let query = req.query.query;

  let result = await fetch(`http://127.0.0.1:8000/admin/series/search-by-name?query=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  })

  let data = await result.json();

  res.status(result.status).json(data);
}