import axios from 'axios';

const api = axios.create({
  // Adjust the port if your backend is running on a different one (e.g. 5000)
  baseURL: 'https://stock-management-system-qcrz.onrender.com/api', 
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;