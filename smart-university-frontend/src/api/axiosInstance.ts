import axios from 'axios';
import toast from 'react-hot-toast';
import keycloak from '../auth/keycloak';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    await keycloak.updateToken(30);
  } catch {
    keycloak.login();
    return Promise.reject(new Error('Token refresh failed'));
  }
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      toast.error('Session expired — logging in again');
      keycloak.login();
    } else if (status === 403) {
      toast.error('Access denied');
    } else if (status && status >= 500) {
      toast.error('Server error — please try again later');
    }
    return Promise.reject(error);
  },
);

export default api;
