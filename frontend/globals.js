let dev = false;

const loc = {
  backend: (path) => dev ? `http://localhost:8000${path}` : `http://backend:8000${path}`,
  cdn: (path) => `https://cdn.sserve.work/${path}`
}

export default loc;