import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let {post_id} = req.query;
    let post = await fetch(loc.backend("/api/post/" + post_id), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    res.status(post.status).json(await post.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}