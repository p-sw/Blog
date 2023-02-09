export default async function handler(req, res) {
  if (!(req.body.username && req.body.password)) {
    res.status(400).json({
      error: "No username or password provided"
    })
    return
  }
  let username = req.body.username
  let password = req.body.password

  let loginRes = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  res.status(loginRes.status).json(await loginRes.json())
}