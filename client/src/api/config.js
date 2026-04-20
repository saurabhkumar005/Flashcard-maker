const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL in client/.env");
}

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export { API_BASE_URL, buildUrl };
