export default async function handler(req, res) {
  if (req.method === "GET") {
    let series = await getTag(req.headers.hasOwnProperty("token") ? req.headers.token : "");
    res.status(series.status).json(await series.json());
  } else if (req.method === "POST") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await createTag(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else if (req.method === "PATCH") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let series = await updateTag(req.body, req.headers.token);
    res.status(series.status).json(await series.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}

async function getTag(token="") {
  let endpoint = "/admin/tag"
  if (token === "") {
    endpoint = "/api/tag"
  }

  return await fetch("http://127.0.0.1:8000" + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
}

async function createTag({name}, token) {
  return await fetch("http://127.0.0.1:8000/admin/tag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      name: name
    })
  });
}

async function updateTag({id, name=null}, token) {
  return await fetch("http://127.0.0.1:8000/admin/tag", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify({
      id: id,
      name: name
    })
  })
}