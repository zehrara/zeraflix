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
  login: (email, password) => api.post('/api/login', { email, password }),
  register: (email, password, name) => api.post('/api/register', { email, password, name }),
};

export const contentService = {
  getAll: () => api.get('/api/content', { params: { _t: Date.now() } }),
  search: (query) => api.get('/api/search', { params: { q: query } }),
};

export const userService = {
  getHistory: () => api.get('/api/history'),
  getRecommendations: () => api.get('/api/recommendations'),
  getWatchlist: () => api.get('/api/watchlist'),
  addToWatchlist: (contentId) => api.post('/api/watchlist', { contentId }),
  removeFromWatchlist: (contentId) => api.delete('/api/watchlist', { data: { contentId } }),
  updateProfile: (data) => api.put('/api/profile', data),
  deleteProfile: () => api.delete('/api/profile'),
  rateContent: (contentId, rating) => api.put('/api/rate', { contentId, rating }),
  addToHistory: (contentId) => api.post('/api/history', { contentId }),
};

export default api;
