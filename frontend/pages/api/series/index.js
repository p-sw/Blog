export default async function handler(req, res) {
  if (req.method === "GET") {
    let series = await getSeries(req.headers.hasOwnProperty("token") ? req.headers.token : "");
    res.status(series.status).json(await series.json());
  } else if (req.method === "POST") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await createSeries(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

async function getSeries(token="") {
  let endpoint = "/admin/series"
  if (token === "") {
    endpoint = "/api/series"
  }

  return await fetch("http://127.0.0.1:8000" + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
}

async function createSeries({name, description, thumbnail=null, hidden=false, posts=[]}, token) {
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
      posts: posts
    })
  });
}