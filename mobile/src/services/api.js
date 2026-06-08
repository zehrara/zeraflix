import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://zeraflix.vercel.app';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName) => api.post('/auth/register', { email, password, firstName, lastName }),
};

export const contentService = {
  getAll: () => api.get('/contents'),
  search: (query) => api.get('/contents/search', { params: { query } }),
};

export const userService = {
  getHistory: (userId) => api.get(`/users/${userId}/history`),
  getRecommendations: (userId) => api.get(`/users/${userId}/recommendations`),
  getWatchlist: (userId) => api.get(`/users/${userId}/list`),
  addToWatchlist: (userId, contentId) => api.post(`/users/${userId}/list`, { contentId }),
  removeFromWatchlist: (userId, contentId) => api.delete(`/users/${userId}/list/${contentId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
};

export default api;
