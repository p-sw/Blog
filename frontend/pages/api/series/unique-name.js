import loc from "@/globals";

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!req.headers.hasOwnProperty("token")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    let uniqueCheck = await fetch(loc.backend("/admin/series/unique-name"+`?query=${req.query.query}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": req.headers.token
      }
    })
    res.status(uniqueCheck.status).json(await uniqueCheck.json());
  } else {
    res.status(405).json({message: "Method not allowed"});
  }
}