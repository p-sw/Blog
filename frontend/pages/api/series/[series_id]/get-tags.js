import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({message: "Method not allowed"});
    return;
  }
  let {series_id} = req.query;
  let post = await fetch(loc.backend(`/api/series/${series_id}/get-tags`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  res.status(post.status).json(await post.json());
}