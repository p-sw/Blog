export default async function handler(req, res) {
  if (req.method === "GET") {
    let posts = await getPosts(req.headers.hasOwnProperty("token") ? req.headers.token : "");
    res.status(posts.status).json(await posts.json());
  } else if (req.method === "POST") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let post = await createPost(req.body, req.headers.token);
    res.status(post.status).json(await post.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

async function getPosts(token="") {
  let endpoint = "/admin/post"
  if (token === "") {
    endpoint = "/api/post"
  }

  return await fetch("http://127.0.0.1:8000" + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
}

async function createPost({title, description, content, thumbnail=null, tag_ids=null, series_id=null, hidden=false}, token) {
  return await fetch("http://127.0.0.1:8000/admin/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      title: title,
      description: description,
      content: content,
      thumbnail: thumbnail,
      tag_ids: tag_ids,
      series_id: series_id,
      hidden: hidden
    })
  })
}