export default async function handler(req, res) {
  if (req.method === "GET") {
    let posts = await getPosts(req.headers.hasOwnProperty("token") ? req.headers.token : "", req.query);
    res.status(posts.status).json(await posts.json());
  } else if (req.method === "POST") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let post = await createPost(req.body, req.headers.token);
    res.status(post.status).json(await post.json());
  } else if (req.method === "PATCH") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let post = await updatePost(req.body, req.headers.token);
    res.status(post.status).json(await post.json());
  } else if (req.method === "DELETE") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let post = await deletePost(req.body, req.headers.token);
    res.status(post.status).json(await post.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

async function getPosts(token="", {p: page, qn: query_name, qt: query_tags}) {
  let endpoint = "/admin/post"
  if (token === "") {
    endpoint = "/api/post"
  }

  let query = `?${page!==undefined?"p="+page+"&":""}`;
  query = query + `${query_name!==undefined?"qn="+query_name+"&":""}`;
  query = query + `${query_tags!==undefined?typeof query_tags==="string"?"qt="+query_tags:query_tags.map(tag=>"qt="+tag).join("&"):""}`;

  return await fetch("http://127.0.0.1:8000" + endpoint + query, {
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

async function updatePost({id, title=null, description=null, content=null, thumbnail=null, tags=null, series_id=null, hidden=null}, token) {
  return await fetch("http://127.0.0.1:8000/admin/post", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      id: id,
      title: title,
      description: description,
      content: content,
      thumbnail: thumbnail,
      tags: tags,
      series_id: series_id,
      hidden: hidden
    })
  });
}

async function deletePost({id}, token) {
  return await fetch("http://127.0.0.1:8000/admin/post", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      id: id
    })
  });
}