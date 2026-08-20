import axios from "axios";

// Base URL is provided via the VITE_API_URL environment variable.
// Never hardcode localhost or any other host here.
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set. Requests to the NEXUS backend will fail. " +
      "Copy .env.example to .env and set VITE_API_URL."
  );
}

// Single source of truth for where the access token lives in storage.
// Kept here (rather than duplicated in AuthContext) since this module is
// what actually reads/writes it on every request.
export const TOKEN_STORAGE_KEY = "nexus_token";

// Dispatched whenever a request comes back 401 so any part of the app
// (namely AuthContext) can react without api.js needing to know about
// React state or routing.
export const UNAUTHORIZED_EVENT = "nexus:unauthorized";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token (if present) to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response handling so 401s are dealt with in exactly one
// place instead of being re-implemented in every component that calls
// the API.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default api;
