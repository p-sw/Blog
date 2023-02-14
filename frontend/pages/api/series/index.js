export default async function handler(req, res) {
  if (req.method === "GET") {
    let series = await getSeries(req.headers.hasOwnProperty("token") ? req.headers.token : "", req.query);
    res.status(series.status).json(await series.json());
  } else if (req.method === "POST") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await createSeries(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else if (req.method === "PATCH") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await updateSeries(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else if (req.method === "DELETE") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await deleteSeries(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

async function getSeries(token="", {p: page, qn: query_name, qt: query_tags}) {
  let endpoint = "/admin/series"
  if (token === "") {
    endpoint = "/api/series"
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

async function createSeries({name, description, thumbnail=null, hidden=false, posts=[], tags=[]}, token) {
  return await fetch("http://127.0.0.1:8000/admin/series", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      name: name,
      description: description,
      thumbnail: thumbnail,
      hidden: hidden,
      posts: posts,
      tags: tags
    })
  });
}

async function updateSeries({id, name=null, description=null, thumbnail=null, hidden=null, posts=[], tags=[]}, token) {
  return await fetch("http://127.0.0.1:8000/admin/series", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      id: id,
      name: name,
      description: description,
      thumbnail: thumbnail,
      hidden: hidden,
      posts: posts,
      tags: tags
    })
  });
}

async function deleteSeries({id}, token) {
  return await fetch("http://127.0.0.1:8000/admin/series", {
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