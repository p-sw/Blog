let dev = true;

const loc = {
  backend: (path) => dev ? `http://localhost:8000${path}` : `http://blogbackend:8000${path}`,
  cdn: (path) => `https://cdn.sserve.work/${path}`
}

export default loc;