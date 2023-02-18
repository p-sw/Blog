let dev = false;

const loc = {
  backend: (path) => dev ? `http://127.0.0.1:8000${path}` : `http://blogbackend:8000${path}`,
  cdn: (path) => `https://cdn.sserve.work/${path}`
}

export default loc;