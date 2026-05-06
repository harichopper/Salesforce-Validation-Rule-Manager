import axios from 'axios';

/**
 * Central Axios instance pointing at the backend.
 * The Vite dev-proxy handles /api and /auth → localhost:3001
 */
const client = axios.create({
  baseURL: '/',
  withCredentials: true,          // send session cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Response interceptor — surface useful error messages ──
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(msg));
  }
);

export default client;
