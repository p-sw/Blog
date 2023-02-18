import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({message: "Method not allowed"});
    return;
  }
  let {post_id} = req.query;
  let series = await fetch(loc.backend(`/api/post/${post_id}/get-series`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  res.status(series.status).json(await series.json());
}