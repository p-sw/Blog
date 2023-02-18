import loc from "@/globals";

export async function hasToken(cookies) {
  return cookies.hasOwnProperty("token")
}

export async function tokenValidate(token) {
  let res = await fetch(loc.backend("/validate"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token
    })
  })

  return res.status === 200;
}

export async function ServerSideRedirection(dest, permanent) {
  return {
    redirect: {
      destination: dest,
      permanent: permanent
    }
  }
}