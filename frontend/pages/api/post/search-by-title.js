import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({message: "Method Not Allowed"});
  }
  if (req.headers.token === undefined) {
    return res.status(401).json({message: "Unauthorized"});
  }

  let token = req.headers.token;
  let query = req.query.query;

  let result = await fetch(loc.backend(`/admin/post/search-by-title?query=${query}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  })

  let data = await result.json();

  res.status(result.status).json(data);
}