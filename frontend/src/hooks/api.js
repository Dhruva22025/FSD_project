import axios from 'axios';
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("web3-ott-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;