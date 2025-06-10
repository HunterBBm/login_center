import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL ของ Lumen backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;