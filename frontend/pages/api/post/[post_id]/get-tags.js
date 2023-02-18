import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({message: "Method not allowed"});
    return;
  }
  let {post_id} = req.query;
  let tags = await fetch(loc.backend(`/api/post/${post_id}/get-tags`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  res.status(tags.status).json(await tags.json());
}