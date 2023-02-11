export default async function handler(req, res) {
  if (req.method === "GET") {
    let {post_id} = req.query;
    let post = await fetch("http://127.0.0.1:8000/api/post/" + post_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    let j = await post.json()
    console.log(j)
    res.status(post.status).json(j);
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}